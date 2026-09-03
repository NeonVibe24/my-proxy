export default async function handler(req) {
  const url = new URL(req.url);

  const WEBSITE = "https://d.kyat06xx.xyz";
  const APK =
    "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

  // =========================
  // APK DOWNLOAD PROXY
  // =========================
  if (url.pathname === "/download.apk") {
    try {
      const response = await fetch(APK, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (!response.ok) {
        return new Response(
          "APK Download Failed: " + response.status,
          { status: response.status }
        );
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
        headers
      });

    } catch (error) {
      return new Response(
        "APK Proxy Error: " + error.message,
        { status: 502 }
      );
    }
  }

  // =========================
  // WEBSITE PROXY
  // =========================
  try {
    const target =
      WEBSITE + url.pathname + url.search;

    const response = await fetch(target, {
      headers: {
        "User-Agent":
          req.headers.get("user-agent") ||
          "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return new Response(
        "Website Proxy Error: " + response.status,
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "";

    // =========================
    // HTML DOWNLOAD LINK REPLACE
    // =========================
    if (
      contentType
        .toLowerCase()
        .includes("text/html")
    ) {
      let html = await response.text();

      const proxyAPK =
        url.origin + "/download.apk";

      // https://globeshapes.com/...
      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyAPK
      );

      // //globeshapes.com/...
      html = html.replace(
        /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyAPK
      );

      // globeshapes.com/...
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
    // CSS / JS / IMAGE / OTHER
    // =========================
    const headers =
      new Headers(response.headers);

    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      headers
    });

  } catch (error) {
    return new Response(
      "Website Proxy Error: " + error.message,
      { status: 502 }
    );
  }
}
