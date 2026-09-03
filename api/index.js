export default async function handler(req) {
  const url = new URL(req.url);

  if (url.pathname === "/download.apk") {
    const apkUrl =
      "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

    const r = await fetch(apkUrl);

    if (!r.ok) {
      return new Response("APK Error", { status: r.status });
    }

    return new Response(r.body, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition":
          'attachment; filename="com.Kyat06x72101.app.apk"'
      }
    });
  }

  return new Response("OK");
}
