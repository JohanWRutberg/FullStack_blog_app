import "dotenv/config";
import axios from "axios";
import crypto from "crypto";

const accessKey = process.env.AMAZON_ACCESS_KEY;
const secretKey = process.env.AMAZON_SECRET_KEY;
const associateTag = process.env.AMAZON_ASSOCIATE_TAG;
const region = process.env.AMAZON_REGION || "us-east-1";

async function testAmazonSearch() {
  const host = "webservices.amazon.com";
  const path = "/paapi5/searchitems";
  const service = "ProductAdvertisingAPI";

  const payload = JSON.stringify({
    Keywords: "electronic drums",
    SearchIndex: "MusicalInstruments",
    PartnerTag: associateTag,
    PartnerType: "Associates",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
    ],
  });

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const datestamp = amzDate.substring(0, 8);

  // Canonical request
  const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date";
  const payloadHash = crypto.createHash("sha256").update(payload).digest("hex");
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // String to sign
  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;

  // Signing
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

  // Authorization header
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

    console.log("✅ Success! Example search results:");
    console.log(
      JSON.stringify(
        response.data.ItemsResult?.Items?.slice(0, 3) || response.data,
        null,
        2
      )
    );
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

testAmazonSearch();
