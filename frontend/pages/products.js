import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const asins = ["B0CJL1GQVT", "B08Y6G7L5Z", "B07VXLH6Q6"]; // dina produkter

  useEffect(() => {
    async function fetchProducts() {
      const results = [];

      for (const asin of asins) {
        try {
          const res = await fetch("/api/amazon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ asin }),
          });
          const data = await res.json();
          results.push(data);
        } catch (err) {
          console.error("Fetch error:", err);
        }

        // Delay mellan varje anrop (för att inte trigga throttling)
        await new Promise((r) => setTimeout(r, 2000));
      }

      setProducts(results);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Amazon Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-between transition hover:shadow-xl"
          >
            <img
              src={p.image || "/placeholder.png"}
              alt={p.title}
              className="w-48 h-48 object-contain mb-3"
            />
            <h2 className="text-lg font-medium text-center">{p.title}</h2>
            <p className="text-green-600 font-semibold mt-2">{p.price}</p>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-xl transition"
            >
              Buy on Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
