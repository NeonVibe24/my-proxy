export default async function handler(req) {
  const url = new URL(req.url);

  // APK Download Proxy
  if (url.pathname === "/download.apk") {
    const apk = "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

    const response = await fetch(apk);

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="com.Kyat06x72101.app.apk"'
      }
    });
  }

  return new Response("OK");
}
