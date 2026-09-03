export default async function handler(req, res) {
  const url = new URL(req.url);

  const target =
    "https://d.kyat06xx.xyz" +
    url.pathname +
    url.search;

  try {
    const response = await fetch(target, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const contentType =
      response.headers.get("content-type") || "";

    // Website HTML ကို Download link ပြောင်း
    if (contentType.includes("text/html")) {
      let html = await response.text();

      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        url.origin + "/download.apk"
      );

      html = html.replace(
        /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        url.origin + "/download.apk"
      );

      return new Response(html, {
        status: response.status,
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    // CSS / JS / Image စသည်
    return new Response(response.body, {
      status: response.status,
      headers: {
        "content-type": contentType
      }
    });

  } catch (error) {
    return new Response(
      "Proxy Error: " + error.message,
      { status: 500 }
    );
  }
}
