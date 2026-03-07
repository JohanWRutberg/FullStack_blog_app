"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";
import isPAAPIAvailable from "./isPAAPIAvailable"; // see helper below

export default function AmazonProductGlass({ asin }) {
  const [product, setProduct] = useState(null);
  const [source, setSource] = useState("loading");

  useEffect(() => {
    const load = async () => {
      const apiAvailable = await isPAAPIAvailable();

      const res = await fetch("/api/amazon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      });

      const data = await res.json();
      setProduct(data);
      setSource(apiAvailable ? "amazon-api" : data.from);
    };

    load();
  }, [asin]);

  if (!product) {
    return (
      <div className="p-4 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl animate-pulse h-64 w-full max-w-xs" />
    );
  }

  const imageSrc = product.image.startsWith("http")
    ? product.image
    : "/img/noimage.jpg";

  return (
    <div
      className="
      relative w-full max-w-xs mx-auto p-5
      rounded-3xl border border-white/40 
      bg-white/10 backdrop-blur-2xl 
      shadow-[0_8px_25px_rgba(0,0,0,0.25)]
      transition-all duration-300 hover:-translate-y-1
      before:content-[''] before:absolute before:inset-0 
      before:rounded-3xl 
      before:bg-gradient-to-br before:from-white/30 before:to-transparent 
      before:opacity-60
      hover:before:opacity-80
      overflow-hidden
    "
    >
      {/* Shine Overlay */}
      <div
        className="
      pointer-events-none absolute inset-0 
      bg-gradient-to-tl from-white/40 via-transparent to-white/20 
      rounded-3xl opacity-40
    "
      />

      {/* Preview Badge */}
      {source !== "amazon-api" && (
        <span className="absolute top-3 left-3 bg-white/50 backdrop-blur-md text-gray-800 text-[10px] px-2 py-[2px] rounded-full shadow-sm">
          Preview
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="
          object-contain transition-transform duration-300 
          group-hover:scale-105 drop-shadow-xl
        "
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-sm drop-shadow-lg line-clamp-2 mb-2">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-white/90 font-medium mb-4 drop-shadow">
        {product.price}
      </p>

      {/* Button */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="
        w-full flex items-center justify-center
        bg-black/60 backdrop-blur-xl border border-white/20 
        hover:bg-black/80
        text-white text-sm font-medium py-2 rounded-xl
        shadow-md
        transition
      "
      >
        <BsAmazon className="mr-2" /> Buy on Amazon
      </a>
    </div>
  );
}
