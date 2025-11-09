import { useState, useEffect } from "react";
import Image from "next/image";

export default function AmazonProduct({ asin }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asin) return;
    setLoading(true);

    fetch("/api/amazon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asin }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching product:", err);
        setLoading(false);
      });
  }, [asin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center text-center border rounded-lg p-4 shadow-sm animate-pulse">
        <div className="w-full h-64 bg-gray-200 mb-4 rounded-lg"></div>
        <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 mb-3 rounded"></div>
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Product not available</p>
      </div>
    );
  }

  // ✅ Bygg rätt URL för rätt region
  const regionHost = "https://www.amazon.com";
  const affiliateTag =
    process.env.NEXT_PUBLIC_AFFILIATE_TAG || "beatmastermin-20";
  const amazonUrl = `${regionHost}/dp/${asin}?tag=${affiliateTag}`;

  const imageSrc = product.image?.startsWith("http")
    ? `/api/image-proxy?url=${encodeURIComponent(product.image)}`
    : product.image || "/img/noimage.jpg";

  return (
    <div className="flex flex-col items-center text-center border-2 border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition bg-gray-50">
      <Image
        src={imageSrc}
        alt={product.title}
        width={400}
        height={400}
        className="w-full h-64 object-contain mb-4 rounded-lg"
        unoptimized={false}
      />

      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
        {product.title}
      </h3>

      <p className="text-gray-700 mb-3">{product.price}</p>

      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-yellow-200 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition"
      >
        Buy on Amazon
      </a>
    </div>
  );
}
