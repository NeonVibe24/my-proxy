import { routes, type VercelConfig } from "@vercel/config/v1";

const config: VercelConfig = {
  rewrites: [
    routes.rewrite(
      "/download.apk",
      "https://globeshapes.com/Kyat06/com.Kyat06x72101.app.apk"
    ),

    routes.rewrite(
      "/:path*",
      "https://d.kyat06xx.xyz/:path*"
    )
  ]
};

export default config;
