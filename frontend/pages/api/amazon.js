import aws4 from "aws4";
import https from "https";
import mockData from "../../data/products.json";

const cache = {};
const cacheTTL = 1000 * 60 * 60; // 1 hour

export default async function handler(req, res) {
  const { asin, test } = req.body || {};
  // DIRECT RETURN FROM LOCAL products.json
  if (!test && mockData[asin]) {
    return res.status(200).json({
      asin,
      ...mockData[asin],
      from: "mock",
      url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
    });
  }

  if (!asin && !test) {
    return res.status(400).json({ error: "ASIN missing" });
  }

  const asinToUse = test ? "B0002E1G5C" : asin;

  // CACHE
  if (
    !test &&
    cache[asinToUse] &&
    Date.now() - cache[asinToUse].timestamp < cacheTTL
  ) {
    return res.status(200).json(cache[asinToUse].data);
  }

  // PA-API CALL
  const apiResponse = await callAmazonAPI(asinToUse);

  // TEST MODE
  if (test) {
    if (apiResponse?.ItemsResult?.Items?.length > 0) {
      return res.status(200).json({ status: "OK" }); // PA-API accessible
    }
    return res.status(200).json({ status: "NOT_READY" });
  }

  // SUCCESSFUL PA-API RESULT
  if (apiResponse?.ItemsResult?.Items?.length > 0) {
    const item = apiResponse.ItemsResult.Items[0];

    const product = {
      asin,
      title: item?.ItemInfo?.Title?.DisplayValue || "Unknown Title",
      price:
        item?.Offers?.Listings?.[0]?.Price?.DisplayAmount ||
        "Price unavailable",
      image: item?.Images?.Primary?.Large?.URL || "/img/noimage.jpg",
      url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
      from: "amazon-api",
    };

    cache[asinToUse] = { data: product, timestamp: Date.now() };
    return res.status(200).json(product);
  }

  // MOCK DATA
  if (mockData[asinToUse]) {
    const product = {
      asin,
      ...mockData[asinToUse],
      url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
      from: "mock",
    };
    cache[asinToUse] = { data: product, timestamp: Date.now() };
    return res.status(200).json(product);
  }

  // FALLBACK
  const fallback = {
    asin,
    title: "Product (awaiting Amazon API access)",
    price: "N/A",
    image: "/img/noimage.jpg",
    url: `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
    from: "fallback",
  };

  cache[asinToUse] = { data: fallback, timestamp: Date.now() };
  return res.status(200).json(fallback);
}

// ---------------------

async function callAmazonAPI(asin) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      ItemIds: [asin],
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
      ],
      PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
    });

    const opts = {
      host: "webservices.amazon.com",
      path: "/paapi5/getitems",
      region: "us-east-1",
      service: "ProductAdvertisingAPIv1",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
      },
      body: payload,
    };

    aws4.sign(opts, {
      accessKeyId: process.env.AMAZON_ACCESS_KEY,
      secretAccessKey: process.env.AMAZON_SECRET_KEY,
    });

    const request = https.request(opts, (response) => {
      let data = "";
      response.on("data", (chunk) => (data += chunk));
      response.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    });

    request.on("error", () => resolve(null));
    request.write(payload);
    request.end();
  });
}
