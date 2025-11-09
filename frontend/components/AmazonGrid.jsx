import AmazonProduct from "./AmazonProduct";

export default function AmazonGrid({ asins }) {
  if (!asins || asins.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Products featured in this post
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {asins.map((asin) => (
          <AmazonProduct key={asin} asin={asin} />
        ))}
      </div>
    </div>
  );
}
