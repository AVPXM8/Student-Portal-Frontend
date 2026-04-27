export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/test/", "/report-issue/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/test/"],
      },
    ],
    sitemap: "https://question.maarula.in/sitemap.xml",
  };
}
