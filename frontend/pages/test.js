export default function TestAmazon() {
  async function handleClick() {
    const res = await fetch("/api/amazon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asin: "B0CJL1GQVT" }),
    });
    const data = await res.json();
    console.log("Amazon result:", data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Amazon API Test</h1>
      <button
        onClick={handleClick}
        style={{ padding: "10px 20px", background: "gold", borderRadius: 8 }}
      >
        Fetch Alesis Nitro Max
      </button>
    </div>
  );
}
