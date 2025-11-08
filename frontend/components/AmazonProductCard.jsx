import { useEffect, useState } from "react";

export default function AmazonProductCard({ asin }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/amazon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asin }),
        });
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Amazon fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [asin]);

  if (loading) return <p>Loading Amazon product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="my-6 p-4 border rounded-xl shadow-sm bg-white text-center">
      <img
        src={product.image || "/placeholder.png"}
        alt={product.title}
        className="w-40 h-40 mx-auto object-contain mb-3"
      />
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-green-600 font-medium mt-1">{product.price}</p>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition"
      >
        Buy on Amazon
      </a>
    </div>
  );
}
