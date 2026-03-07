import Product from "../../models/Product";
import dbConnect from "../../lib/mongodb";

export default async function handler(req, res) {
  await dbConnect();

  const asins = ["B0002E1G5C", "B07L4TBX9S"];

  const updated = [];

  for (const asin of asins) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amazon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asin }),
    });

    const data = await res.json();

    await Product.findOneAndUpdate(
      { asin },
      { ...data },
      { upsert: true, new: true }
    );

    updated.push(data);
  }

  return res.status(200).json({ updated });
}
