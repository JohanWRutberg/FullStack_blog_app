import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import axios from "axios";

export default async function handler(req, res) {
  // Endast GET eller CRON-anrop
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await mongooseConnect();

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Hitta produkter äldre än 7 dagar
    const oldProducts = await Product.find({
      lastFetched: { $lt: sevenDaysAgo },
    });

    if (oldProducts.length === 0) {
      console.log("✅ No products need refreshing.");
      return res.status(200).json({ message: "No products to update." });
    }

    console.log(`🔁 Found ${oldProducts.length} products to refresh.`);

    const updatedProducts = [];

    for (const prod of oldProducts) {
      try {
        const response = await axios.post(
          "https://webservices.amazon.com/paapi5/getitems",
          {
            ItemIds: [prod.asin],
            Resources: [
              "Images.Primary.Large",
              "ItemInfo.Title",
              "Offers.Listings.Price",
              "DetailPageURL",
            ],
            PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
            PartnerType: "Associates",
            Marketplace: "www.amazon.com",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Amz-Date": new Date().toISOString(),
              "X-Amz-Target":
                "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
            },
            auth: {
              username: process.env.AMAZON_ACCESS_KEY,
              password: process.env.AMAZON_SECRET_KEY,
            },
          }
        );

        const item = response.data.ItemsResult?.Items?.[0];
        if (!item) continue;

        const updatedData = {
          title: item.ItemInfo?.Title?.DisplayValue || prod.title,
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || prod.price,
          image: item.Images?.Primary?.Large?.URL || prod.image,
          url: item.DetailPageURL || prod.url,
          lastFetched: new Date(),
        };

        await Product.findByIdAndUpdate(prod._id, updatedData);
        updatedProducts.push(prod.asin);

        console.log(`✅ Updated product: ${prod.asin}`);
      } catch (error) {
        console.error(`❌ Failed to update ${prod.asin}`, error.message);
      }

      // Vänta lite mellan anropen (Amazon throttling)
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return res.status(200).json({
      message: `Updated ${updatedProducts.length} products.`,
      asins: updatedProducts,
    });
  } catch (error) {
    console.error("💥 Error in refresh job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
