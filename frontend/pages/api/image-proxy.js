// pages/api/image-proxy.js
export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).send("Missing ?url parameter");
    }

    // Enbart tillåt Amazon-bilder (säkerhetsåtgärd)
    if (!url.startsWith("https://m.media-amazon.com/")) {
      return res.status(403).send("Forbidden");
    }

    // Hämta bilden via servern
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Failed to fetch image: ${response.statusText}`);
    }

    // Sätt rätt header och returnera själva bilden
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("❌ Image proxy error:", error);
    res.status(500).send("Server error fetching image");
  }
}
