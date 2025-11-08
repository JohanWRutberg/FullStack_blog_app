export default function AmazonProduct({ asin, product }) {
  if (!product) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      {product.image ? (
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-contain mb-4 rounded-lg"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center mb-4 rounded-lg">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {product.title}
      </h3>

      <p className="text-gray-700 mb-3">{product.price}</p>

      <a
        href={`https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition"
      >
        Buy on Amazon
      </a>
    </div>
  );
}
