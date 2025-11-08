import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import axios from "axios";

const cache = {};
const cacheTTL = 1000 * 60 * 60; // 1 timme

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { asin } = req.body;
  console.log("🔍 API called with ASIN:", asin);

  try {
    await mongooseConnect();

    // 1️⃣ Kolla RAM-cache
    if (cache[asin] && Date.now() - cache[asin].timestamp < cacheTTL) {
      console.log("⚡ Using in-memory cache for", asin);
      return res.status(200).json(cache[asin].data);
    }

    // 2️⃣ Kolla MongoDB-cache
    const existingProduct = await Product.findOne({ asin });
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (existingProduct && existingProduct.lastFetched > oneDayAgo) {
      console.log("📦 Using MongoDB cached product:", existingProduct.asin);
      cache[asin] = { data: existingProduct, timestamp: Date.now() };
      return res.status(200).json(existingProduct);
    }

    // 3️⃣ Hämta från Amazon API
    const response = await axios.post(
      "https://webservices.amazon.com/paapi5/getitems",
      {
        ItemIds: [asin],
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
    if (!item) throw new Error("No item returned from Amazon API");

    const productData = {
      asin,
      title: item.ItemInfo?.Title?.DisplayValue || "Unknown Product",
      price:
        item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "See on Amazon",
      image: item.Images?.Primary?.Large?.URL || null,
      url: item.DetailPageURL,
      lastFetched: new Date(),
    };

    // 4️⃣ Spara i DB och cache
    await Product.findOneAndUpdate({ asin }, productData, { upsert: true });
    cache[asin] = { data: productData, timestamp: Date.now() };

    console.log("✅ Product cached and returned:", asin);
    return res.status(200).json(productData);
  } catch (error) {
    console.error(
      "💥 Amazon API Error:",
      error.response?.data || error.message
    );

    // 5️⃣ Fallback till DB om API misslyckas
    const fallback = await Product.findOne({ asin });
    if (fallback) {
      console.log("🧩 Using fallback MongoDB data for", asin);
      return res.status(200).json(fallback);
    }

    // 6️⃣ Mock som sista utväg
    const mockData = {
      asin,
      title: "Demo Product (Mock)",
      price: "$99.99",
      image: null,
      url: `https://www.amazon.com/dp/${asin}`,
    };
    return res.status(200).json(mockData);
  }
}
