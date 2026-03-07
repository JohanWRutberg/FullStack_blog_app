import AmazonProductGlass from "./AmazonProductGlass";

export default function AmazonGrid({ asins = [] }) {
  if (!asins || asins.length === 0) return null;

  return (
    <div
      className="
        mt-10 mb-14
        grid gap-10
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4
        place-items-center
      "
    >
      {asins.map((asin) => (
        <AmazonProductGlass key={asin} asin={asin} />
      ))}
    </div>
  );
}
