export default async function handler(req) {
  const url = new URL(req.url);

  const target =
    "https://d.kyat06xx.xyz" +
    url.pathname +
    url.search;

  const response = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const headers = new Headers(response.headers);

  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.set("cache-control", "no-store");

  return new Response(response.body, {
    status: response.status,
    headers
  });
}
