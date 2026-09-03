export default async function handler(request) {
  const url = new URL(request.url);

  const website = "https://d.kyat06xx.xyz";
  const apk =
    "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

  // APK
  if (url.pathname === "/download.apk") {
    const response = await fetch(apk);

    if (!response.ok) {
      return new Response("APK Download Failed", {
        status: response.status
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          "application/vnd.android.package-archive",
        "Content-Disposition":
          'attachment; filename="com.Kyat06x72101.app.apk"',
        "Cache-Control": "no-store"
      }
    });
  }

  // Original Website
  const target =
    website + url.pathname + url.search;

  const response = await fetch(target, {
    headers: {
      "User-Agent":
        request.headers.get("user-agent") ||
        "Mozilla/5.0"
    }
  });

  const contentType =
    response.headers.get("content-type") || "";

  // HTML ကို ပြင်ပြီး APK link ပြောင်း
  if (contentType.includes("text/html")) {
    let html = await response.text();

    const proxyApk =
      `${url.origin}/download.apk`;

    html = html.replace(
      /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
      proxyApk
    );

    html = html.replace(
      /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
      proxyApk
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

  // CSS / JS / Images
  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  });
}
