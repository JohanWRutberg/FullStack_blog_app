"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";
import isPAAPIAvailable from "./isPAAPIAvailable";

export default function AmazonProductCompact({ asin }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      await isPAAPIAvailable(); // optional
      const res = await fetch("/api/amazon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      });
      setProduct(await res.json());
    };

    load();
  }, [asin]);

  if (!product)
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;

  const imageSrc = product.image.startsWith("http")
    ? product.image
    : "/img/noimage.jpg";

  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col justify-between w-full">
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.title}
        </h4>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 font-semibold hover:text-black flex items-center mt-1"
        >
          <BsAmazon className="mr-1 text-gray-600" />
          View
        </a>
      </div>
    </div>
  );
}
