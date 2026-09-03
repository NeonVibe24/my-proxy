export default async function middleware(request) {
  const url = new URL(request.url);

  const targetHost = "d.kyat06xx.xyz";

  // မူရင်း Website URL
  const targetUrl =
    `https://${targetHost}${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      redirect: "follow"
    });

    const contentType =
      response.headers.get("content-type") || "";

    /*
     * HTML ဖြစ်ရင် Download APK link ကို
     * Vercel Proxy URL အဖြစ် အလိုအလျောက်ပြောင်းမယ်
     */
    if (contentType.includes("text/html")) {
      let html = await response.text();

      const proxyOrigin = url.origin;

      const originalApk =
        "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

      const proxyApk =
        `${proxyOrigin}/apk/com.Kyat06x72101.app.apk`;

      // APK URL ကို Proxy URL ပြောင်း
      html = html.replaceAll(
        originalApk,
        proxyApk
      );

      return new Response(html, {
        status: response.status,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "no-store"
        }
      });
    }

    /*
     * HTML မဟုတ်တဲ့ CSS / JS / Image စတာတွေ
     * မူရင်းအတိုင်း ပြန်ပေး
     */
    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });

  } catch (error) {

    return new Response(
      "Proxy Error: " + error.message,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8"
        }
      }
    );
  }
}
