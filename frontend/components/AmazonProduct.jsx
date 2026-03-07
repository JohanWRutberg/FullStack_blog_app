"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";

// -------------------------------
// A: Testar om Amazon PA-API fungerar
// -------------------------------
async function isPAAPIAvailable() {
  try {
    const res = await fetch("/api/amazon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    });

    const data = await res.json();
    return data?.status === "OK";
  } catch {
    return false;
  }
}

export default function AmazonProduct({ asin }) {
  const [product, setProduct] = useState(null);
  const [source, setSource] = useState("loading");
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!asin) return;

      const available = await isPAAPIAvailable();
      setApiAvailable(available);

      const res = await fetch("/api/amazon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      });

      const data = await res.json();
      setProduct(data);
      setSource(data.from);
    };

    load();
  }, [asin]);

  if (!product) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : "/img/noimage.jpg";

  return (
    <div
      className="
      group relative w-full max-w-xs mx-auto 
      bg-white border border-gray-200 rounded-2xl 
      shadow-sm hover:shadow-md hover:-translate-y-1 
      transition-all duration-300 ease-out
    "
    >
      {/* Badge for fallback / mock */}
      {source !== "amazon-api" && (
        <div
          className="
          absolute top-2 left-2 
          text-[10px] px-2 py-1 
          bg-gray-100 text-gray-500 
          rounded-full shadow-sm
        "
        >
          Preview Mode
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100" />
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-contain p-4 relative z-10 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[40px]">
          {product.title}
        </h3>

        <p className="text-gray-600 font-medium mt-2">{product.price}</p>

        {/* Button */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
          mt-4 w-full flex items-center justify-center
          text-sm font-medium 
          bg-gray-800 text-white
          hover:bg-black
          px-4 py-2 rounded-lg
          shadow-sm
          transition-all duration-200
        "
        >
          <BsAmazon className="mr-2 text-white" />
          Buy on Amazon
        </a>
      </div>
    </div>
  );
}
