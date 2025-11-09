import "dotenv/config";
import axios from "axios";
import crypto from "crypto";

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const associateTag = process.env.AMAZON_ASSOCIATE_TAG;
const region = "us-east-1";

async function testAmazon() {
  const payload = JSON.stringify({
    ItemIds: ["B0CJL1GQVT"], // testprodukt
    PartnerTag: associateTag,
    PartnerType: "Associates",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
  });

  const host = "webservices.amazon.com";
  const path = "/paapi5/getitems";
  const service = "ProductAdvertisingAPI";

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const datestamp = amzDate.substring(0, 8);

  // Step 1: Canonical request
  const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date";
  const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // Step 2: String to sign
  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;

  // Step 3: Calculate signature
  function sign(key, msg) {
    return crypto.createHmac("sha256", key).update(msg).digest();
  }
  const kDate = sign(`AWS4${secretKey}`, datestamp);
  const kRegion = sign(kDate, region);
  const kService = sign(kRegion, service);
  const kSigning = sign(kService, "aws4_request");
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");

  // Step 4: Authorization header
  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  try {
    const response = await axios.post(`https://${host}${path}`, payload, {
      headers: {
        "Content-Encoding": "amz-1.0",
        "Content-Type": "application/json; charset=utf-8",
        "X-Amz-Date": amzDate,
        Authorization: authorizationHeader,
      },
    });

    console.log("✅ Success:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

testAmazon();
