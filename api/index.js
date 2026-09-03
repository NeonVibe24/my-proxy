export default async function handler(request) {
  const url = new URL(request.url);

  const WEBSITE = "https://d.kyat06xx.xyz";
  const APK =
    "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

  try {

    // =========================
    // APK DOWNLOAD
    // =========================
    if (url.pathname === "/download.apk") {

      const response = await fetch(APK, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (!response.ok) {
        return new Response(
          "APK Error: " + response.status,
          { status: response.status }
        );
      }

      return new Response(response.body, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.android.package-archive",

          "Content-Disposition":
            'attachment; filename="com.Kyat06x72101.app.apk"',

          "Cache-Control": "no-store"
        }
      });
    }


    // =========================
    // WEBSITE
    // =========================
    const target =
      WEBSITE + url.pathname + url.search;

    const response = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return new Response(
        "Website Error: " + response.status,
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "";


    // =========================
    // HTML
    // =========================
    if (
      contentType
        .toLowerCase()
        .includes("text/html")
    ) {

      let html = await response.text();

      const proxyAPK =
        url.origin + "/download.apk";

      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyAPK
      );

      html = html.replace(
        /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyAPK
      );

      html = html.replace(
        /globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyAPK.replace(/^https?:\/\//, "")
      );

      return new Response(html, {
        status: response.status,
        headers: {
          "Content-Type":
            "text/html; charset=UTF-8",

          "Cache-Control": "no-store"
        }
      });
    }


    // =========================
    // CSS / JS / IMAGE
    // =========================
    const headers = new Headers(
      response.headers
    );

    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      headers
    });

  } catch (error) {

    return new Response(
      "Proxy Error: " + error.message,
      {
        status: 500,
        headers: {
          "Content-Type":
            "text/plain; charset=UTF-8"
        }
      }
    );
  }
}
