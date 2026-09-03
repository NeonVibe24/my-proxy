export default async function handler(request) {
  try {
    const url = new URL(request.url);

    const website = "https://d.kyat06xx.xyz";
    const apk =
      "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

    // APK Download
    if (url.pathname === "/download.apk") {
      const response = await fetch(apk);

      if (!response.ok) {
        return new Response("APK Download Failed", {
          status: response.status
        });
      }

      const headers = new Headers();

      headers.set(
        "Content-Type",
        "application/vnd.android.package-archive"
      );

      headers.set(
        "Content-Disposition",
        'attachment; filename="com.Kyat06x72101.app.apk"'
      );

      headers.set("Cache-Control", "no-store");

      return new Response(response.body, {
        status: 200,
        headers: headers
      });
    }

    // Original Website
    const target = website + url.pathname + url.search;

    const response = await fetch(target, {
      headers: {
        "User-Agent":
          request.headers.get("user-agent") ||
          "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return new Response(
        "Website Proxy Error: " + response.status,
        {
          status: response.status
        }
      );
    }

    const contentType =
      response.headers.get("content-type") || "";

    // HTML
    if (contentType.toLowerCase().includes("text/html")) {
      let html = await response.text();

      const proxyApk =
        url.origin + "/download.apk";

      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyApk
      );

      html = html.replace(
        /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyApk
      );

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "no-store"
        }
      });
    }

    // CSS / JS / Images / Other files
    const headers = new Headers(response.headers);

    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      headers: headers
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
