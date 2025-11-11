"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";

export default function AmazonProduct({ asin }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

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

        if (
          !data.image ||
          data.image.includes("noimage.jpg") ||
          data.title.includes("(Demo)")
        ) {
          setIsUsingFallback(true);
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching product:", err);
        setLoading(false);
        setIsUsingFallback(true);
      });
  }, [asin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center text-center border border-gray-200 rounded-2xl p-6 shadow-sm bg-white animate-pulse">
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

  const regionHost = "https://www.amazon.com";
  const affiliateTag =
    process.env.NEXT_PUBLIC_AFFILIATE_TAG || "beatmastermin-20";
  const amazonUrl = `${regionHost}/dp/${asin}/?tag=${affiliateTag}`;

  const imageSrc =
    product.image && product.image.startsWith("http")
      ? product.image
      : "/img/noimage.jpg";

  return (
    <div className="relative group flex flex-col items-center text-center border border-gray-200 rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300">
      {/* 🔹 Fallback-banner */}
      {isUsingFallback && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full shadow-sm z-20">
          Demo Info (awaiting API)
        </div>
      )}

      {/* Produktbild med elegant gradientbakgrund */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDF3FF] via-[#DDE6FF] to-[#A8B5E6]" />
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain relative z-10"
          priority={false}
        />
      </div>

      {/* Produktnamn */}
      <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
        {product.title}
      </h3>

      {/* Pris */}
      <p className="text-gray-700 font-medium text-md mb-4">
        {product.price || "Price unavailable"}
      </p>

      {/* Köpknapp – mindre, med Amazon-ikon */}
      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-gray-200 hover:bg-orange-100 text-white font-medium text-sm py-1.5 px-4 rounded-lg shadow-sm transition-all transform hover:scale-105"
      >
        <div className="st_icon_amazon !bg-[#f68f3d] !text-white !p-[6px] !mr-2">
          <BsAmazon />
        </div>
        <span className="link-alt text-white text-sm">Buy on Amazon</span>
      </a>
    </div>
  );
}
