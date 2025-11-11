import AmazonProduct from "./AmazonProduct";

export default function AmazonGrid({ asins = [] }) {
  if (!asins || asins.length === 0) return null;

  return (
    <div className="mt-8 mb-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
      {asins.map((asin) => (
        <AmazonProduct key={asin} asin={asin} />
      ))}
    </div>
  );
}
