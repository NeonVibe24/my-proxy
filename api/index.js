export default async function handler(request) {
  const url = new URL(request.url);

  const WEBSITE = "https://d.kyat06xx.xyz";
  const APK = "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

  try {
    // APK Download
    if (url.pathname === "/download.apk") {
      const apkResponse = await fetch(APK, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (!apkResponse.ok) {
        return new Response(
          "APK Error: " + apkResponse.status,
          { status: apkResponse.status }
        );
      }

      return new Response(apkResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition":
            'attachment; filename="com.Kyat06x72101.app.apk"'
        }
      });
    }

    // Website
    const target =
      WEBSITE + url.pathname + url.search;

    const response = await fetch(target, {
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

    const type =
      response.headers.get("content-type") || "";

    // HTML ထဲက မူရင်း APK link ကို Vercel link ပြောင်း
    if (type.includes("text/html")) {
      let html = await response.text();

      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        url.origin + "/download.apk"
      );

      return new Response(html, {
        status: response.status,
        headers: {
          "Content-Type": "text/html; charset=UTF-8"
        }
      });
    }

    // CSS / JS / Images
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": type
      }
    });

  } catch (error) {
    return new Response(
      "Function Error: " + String(error),
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );
  }
}
