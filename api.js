export default async function handler(req, res) {

  const originalSite = "https://d.kyat06xx.xyz";
  const apkUrl =
    "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk";

  const host = req.headers.host || "";

  /*
   * APK Download
   */
  if (req.url === "/download.apk") {

    try {

      const response = await fetch(apkUrl);

      if (!response.ok) {
        return res.status(response.status).send(
          "APK Download Failed"
        );
      }

      const buffer = Buffer.from(
        await response.arrayBuffer()
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.android.package-archive"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="com.Kyat06x72101.app.apk"'
      );

      res.setHeader(
        "Content-Length",
        buffer.length
      );

      return res.status(200).send(buffer);

    } catch (error) {

      return res.status(500).send(
        "APK Proxy Error"
      );
    }
  }


  /*
   * Original Website
   */

  let path = req.url || "/";

  if (path.startsWith("/")) {
    path = path.substring(1);
  }

  const target =
    originalSite + "/" + path;

  try {

    const response = await fetch(target, {
      headers: {
        "User-Agent":
          req.headers["user-agent"] ||
          "Mozilla/5.0"
      }
    });

    const contentType =
      response.headers.get("content-type") || "";


    /*
     * HTML
     */
    if (
      contentType
        .toLowerCase()
        .includes("text/html")
    ) {

      let html = await response.text();

      /*
       * Original APK URL
       * → Vercel APK Proxy
       */

      const proxyUrl =
        "https://" +
        host +
        "/download.apk";


      html = html.replace(
        /https?:\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyUrl
      );


      html = html.replace(
        /\/\/globeshapes\.com\/Kyat06\/com\.Kyat06x72101\.app\.apk/gi,
        proxyUrl
      );


      return res.status(200)
        .setHeader(
          "Content-Type",
          "text/html; charset=UTF-8"
        )
        .send(html);
    }


    /*
     * CSS / JS / Image / Other files
     */

    const data = Buffer.from(
      await response.arrayBuffer()
    );

    const headers = {};

    response.headers.forEach(
      (value, key) => {
        headers[key] = value;
      }
    );

    delete headers["content-encoding"];
    delete headers["content-length"];

    Object.entries(headers).forEach(
      ([key, value]) => {
        res.setHeader(key, value);
      }
    );

    return res.status(response.status).send(data);


  } catch (error) {

    return res.status(500).send(
      "Website Proxy Error: " +
      error.message
    );
  }
}
