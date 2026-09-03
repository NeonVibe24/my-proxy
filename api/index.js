export default async function handler(req) {
  const url = new URL(req.url);

  if (url.pathname === "/download.apk") {
    const response = await fetch(
      "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk"
    );

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition":
          'attachment; filename="com.Kyat06x72101.app.apk"'
      }
    });
  }

  return new Response("OK");
}
