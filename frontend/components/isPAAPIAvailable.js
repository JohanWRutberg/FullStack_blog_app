export default async function isPAAPIAvailable() {
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
