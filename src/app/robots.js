export default function robots() {
  // Ganti dengan domain asli jika sudah menggunakan custom domain atau domain Vercel yang valid
  const baseUrl = "https://desa-tempursari.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login/"], // Menghindari halaman admin dan login diindeks oleh robot pencari Google
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
