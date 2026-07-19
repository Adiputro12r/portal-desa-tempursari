export default async function sitemap() {
  // Ganti dengan domain asli jika sudah menggunakan custom domain atau domain Vercel yang valid
  const baseUrl = "https://desa-tempursari.vercel.app";

  const staticPaths = [
    "",
    "/kabar-desa",
    "/umkm-wisata",
    "/kesenian",
    "/peta",
    "/profil/lembaga",
    "/profil/demografi",
  ];

  const sitemaps = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  return sitemaps;
}
