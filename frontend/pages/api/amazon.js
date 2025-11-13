import aws4 from "aws4";
import https from "https";

const cache = {};
const cacheTTL = 1000 * 60 * 60; // 1 timme

export default async function handler(req, res) {
  const { asin } = req.body || {};
  if (!asin) return res.status(400).json({ error: "ASIN missing" });

  console.log(`🔍 API called with ASIN: ${asin}`);

  // Använd cache om data finns nyligen
  if (cache[asin] && Date.now() - cache[asin].timestamp < cacheTTL) {
    console.log(`⚡ Using cached data for ${asin}`);
    return res.status(200).json(cache[asin].data);
  }

  // Miljövariabler
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const partnerTag = process.env.AMAZON_ASSOCIATE_TAG;
  const region = process.env.AMAZON_REGION || "us-east-1";
  const host = "webservices.amazon.com";
  const path = "/paapi5/getitems";

  const payload = JSON.stringify({
    ItemIds: [asin],
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
  });

  const opts = {
    host,
    path,
    service: "ProductAdvertisingAPIv1",
    region,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
    },
    body: payload,
  };

  aws4.sign(opts, { accessKeyId: accessKey, secretAccessKey: secretKey });

  // 🧾 Extra debug-info
  console.log("🧾 SIGNATURE DEBUG", {
    host: opts.host,
    region: opts.region,
    service: opts.service,
    partnerTag,
    accessKey: accessKey?.slice(0, 8) + "...",
    secretKey: secretKey ? "[SET]" : "[MISSING]",
    headers: opts.headers,
  });

  try {
    const product = await new Promise((resolve, reject) => {
      const request = https.request(opts, (response) => {
        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => {
          try {
            const json = JSON.parse(data);

            // 🔍 Ny: mer detaljerad felsökning av svar
            if (json.Errors) {
              const err = json.Errors[0];
              console.error("💥 Amazon API Error (Detailed):", err);

              let reason = "Unknown";
              if (err.Code === "InvalidSignature")
                reason = "❌ Invalid Signature – check Access/Secret keys";
              else if (err.Code === "AccessDenied")
                reason = "🔒 Access Denied – keys not yet active";
              else if (err.Code === "InvalidPartnerTag")
                reason = "🏷️ Wrong or inactive Partner Tag";
              else if (
                json.Output?.__type?.includes("InternalFailure") ||
                err.Code === "InternalFailure"
              )
                reason =
                  "🕒 Likely PA-API still not fully activated (wait up to 72h)";
              else if (err.Message) reason = err.Message;

              console.warn(`📋 Reason hint: ${reason}`);
              reject(json);
              return;
            }

            if (json.ItemsResult && json.ItemsResult.Items.length > 0) {
              const item = json.ItemsResult.Items[0];
              const result = {
                asin,
                title: item.ItemInfo?.Title?.DisplayValue || "Untitled Product",
                price:
                  item.Offers?.Listings?.[0]?.Price?.DisplayAmount ||
                  "Price unavailable",
                image: item.Images?.Primary?.Large?.URL || "/img/noimage.jpg",
                url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
              };
              resolve(result);
            } else {
              console.error("⚠️ No items found:", json);
              reject(json);
            }
          } catch (err) {
            console.error("💥 JSON parse error:", err);
            reject(err);
          }
        });
      });

      request.on("error", (err) => {
        console.error("💥 HTTPS Request Error:", err);
        reject(err);
      });

      request.write(payload);
      request.end();
    });

    cache[asin] = { data: product, timestamp: Date.now() };
    console.log(`✅ Cached API data for ${asin}`);
    return res.status(200).json(product);
  } catch (error) {
    console.error("💥 Amazon API Request Failed:", error);
  }

  // --- Fallback om API inte fungerar ---
  const fallback = {
    asin,
    title: "Demo Product (Mock)",
    price: "N/A",
    image: "/img/noimage.jpg",
    url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
  };

  console.log(`🧩 Using fallback for ${asin}`);
  return res.status(200).json(fallback);
}
