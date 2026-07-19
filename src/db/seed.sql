-- ==========================================
-- SEED SQL: SEED DATA DUMMY & ADMIN ACCOUNTS
-- Jalankan skrip ini setelah schema.sql selesai dijalankan
-- ==========================================

-- 1. Seeding Akun Admin ke Auth Supabase
-- Untuk membuat akun admin, masukkan email dan password berikut di menu:
-- Supabase Dashboard > Authentication > Users > Add User
-- Silakan buat 3 akun berikut dengan password bebas (misal: "admin123"):
--
-- Akun 1: admin1@tempursari.desa.id
-- Akun 2: admin2@tempursari.desa.id
-- Akun 3: admin3@tempursari.desa.id
--
-- Catatan: Supabase secara otomatis mengamankan penyimpanan password menggunakan pgcrypto.
-- Jika Anda ingin memasukkan lewat SQL Editor langsung, jalankan query berikut:
-- (Harus dijalankan oleh Superuser jika terjadi kendala izin)

-- 2. Seeding Data Pemerintah Desa
insert into pemerintah_desa (nama, jabatan, foto_url, kontak, has_whatsapp, deskripsi, urutan)
values
  ('H. Joko Susilo, S.P.', 'Kepala Desa', '/assets/avatar-kades.svg', '+6281234567890', true, 'Memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan, dan pemberdayaan masyarakat Desa Tempursari.', 1),
  ('Sri Wahyuni, S.E.', 'Sekretaris Desa', '/assets/avatar-sekdes.svg', '+6281298765432', true, 'Membantu Kepala Desa dalam bidang administrasi, ketatausahaan, dan penyusunan regulasi desa.', 2),
  ('Budi Santoso', 'Kepala Urusan Keuangan', '/assets/avatar-kaur-keu.svg', '085234567890', false, 'Mengelola administrasi keuangan desa, pelaporan anggaran belanja, dan pendapatan desa.', 3),
  ('Rian Hidayat', 'Kepala Urusan Umum & Perencanaan Pembangunan', '/assets/avatar-kaur-umum.svg', '+6287712345678', true, 'Mengurus pelayanan persuratan, inventarisasi aset desa, dan penyusunan Rencana Kerja Pemerintah Desa (RKPDes).', 4),
  ('Siti Aminah, S.Pd.', 'Kepala Seksi Pemerintahan', '/assets/avatar-kasi-pem.svg', '081399887766', false, 'Mengurusi bidang kependudukan, ketertiban umum, dan pembinaan keamanan lingkungan masyarakat.', 5),
  ('Wawan Hermawan', 'Kepala Dusun Sabrang Kidul', '/assets/avatar-kadus-sabrang.svg', '+628998888777', true, 'Kepala wilayah Dusun Sabrang Kidul, mengoordinir kegiatan warga dan pembangunan di tingkat dusun.', 6),
  ('Supriyadi', 'Kepala Dusun Limbangan', '/assets/avatar-kadus-limbangan.svg', '087811223344', false, 'Kepala wilayah Dusun Limbangan, mengoordinir kegiatan warga dan pembangunan di tingkat dusun.', 7);

-- 3. Seeding Data Artikel / Berita
insert into artikel (judul, konten, foto_url, kategori, tanggal, author)
values
  ('Sosialisasi Digitalisasi UMKM Desa Tempursari oleh Tim KKN', 'Tim KKN Universitas menyelenggarakan sosialisasi digitalisasi untuk pelaku UMKM di Desa Tempursari. Acara ini bertujuan mengenalkan metode promosi online dan pembayaran non-tunai (QRIS) guna membantu memperluas jangkauan pasar produk lokal desa. Pelatihan yang dihadiri oleh sekitar 30 pelaku usaha lokal ini berlangsung interaktif dengan antusiasme yang sangat tinggi.', '/assets/kesenian-placeholder.svg', 'Kegiatan', '2026-07-15', 'Tim KKN Tempursari'),
  ('Pembangunan Jalan Penghubung Antara Dusun Sabrang Kidul dan Limbangan', 'Pemerintah Desa Tempursari telah meresmikan dimulainya proyek pengaspalan jalan penghubung antara Dusun Sabrang Kidul dan Dusun Limbangan sepanjang 1.5 kilometer. Pembangunan infrastruktur jalan ini diharapkan dapat mempermudah akses transportasi warga desa, memperlancar distribusi hasil pertanian, serta mendukung pertumbuhan ekonomi lokal.', '/assets/kesenian-placeholder.svg', 'Pembangunan', '2026-07-10', 'Pemerintah Desa'),
  ('Festival Budaya Bersih Dusun Tempursari Tahun 2026', 'Masyarakat Desa Tempursari merayakan tradisi Bersih Dusun dengan menggelar festival kirab budaya dan pagelaran kesenian lokal seperti Jathilan dan Wayang Kulit. Acara tahunan ini ditujukan sebagai bentuk rasa syukur atas hasil panen yang melimpah sekaligus wadah pelestarian budaya jawa tradisional bagi generasi muda desa.', '/assets/kesenian-placeholder.svg', 'Kesenian & Budaya', '2026-07-05', 'Lembaga Kebudayaan Desa');

-- 4. Seeding Data UMKM
insert into umkm (nama_usaha, pemilik, deskripsi, foto_url, kontak, alamat)
values
  ('Kripik Singkong Gurih Tempursari', 'Ibu Sumarni', 'Kripik singkong renyah dengan resep tradisional tanpa pengawet. Tersedia rasa original asin, pedas manis, dan balado.', '/assets/umkm-kripik.svg', '+6281234567801', 'RT 02 / RW 01, Dusun Sabrang Kidul'),
  ('Batik Tulis Motif Khas Tempursari', 'Bapak Maryono', 'Kerajinan batik tulis handmade yang mengangkat kearifan lokal berupa flora dan fauna khas lereng pegunungan desa.', '/assets/umkm-batik.svg', '+6285298765402', 'RT 05 / RW 02, Dusun Limbangan');

-- 5. Seeding Data Objek Wisata
insert into objek_wisata (nama_wisata, deskripsi, foto_url, lokasi, maps_url)
values
  ('Embong Air Indah Tempursari', 'Destinasi wisata air berupa embung buatan yang menawarkan panorama pegunungan yang asri, persewaan perahu dayung, dan spot foto instagramable.', '/assets/wisata-embung.svg', 'Dusun Sabrang Kidul, Tempursari', 'https://maps.google.com'),
  ('Hutan Pinus Lereng Bukit', 'Kawasan camping ground di bawah naungan pohon pinus yang sejuk dengan fasilitas toilet, mushola, dan gardu pandang matahari terbit.', '/assets/wisata-pinus.svg', 'Bagian Utara Dusun Limbangan, Tempursari', 'https://maps.google.com');

-- 6. Seeding Data Kesenian Daerah
insert into kesenian_daerah (nama_kesenian, deskripsi, foto_url, jadwal_kegiatan)
values
  ('Tari Jathilan Tempursari', 'Seni tari tradisional kuda lumping khas Tempursari yang menceritakan kegagahan prajurit berkuda, sering dipentaskan saat upacara adat bersih dusun.', '/assets/kesenian-jathilan.svg', 'Setiap Malam Minggu Kliwon'),
  ('Karawitan Laras Sari', 'Kelompok gamelan jawa tradisional yang dimainkan oleh ibu-ibu PKK dan pemuda desa untuk mengiringi hajatan dan melestarikan gending klasik.', '/assets/kesenian-karawitan.svg', 'Latihan rutin setiap Jumat malam');

-- 7. Seeding Data Lembaga Desa
insert into lembaga_desa (nama_lembaga, deskripsi, logo_url)
values
  ('Lembaga Pemberdayaan Masyarakat Desa (LPMD)', 'Lembaga yang membantu Pemerintah Desa dalam menyerap aspirasi pembangunan desa dan menggerakkan partisipasi swadaya gotong royong warga.', '/assets/logo-lpmd.svg'),
  ('Pemberdayaan Kesejahteraan Keluarga (PKK)', 'Gerakan pembangunan masyarakat yang tumbuh dari bawah dengan wanita sebagai penggeraknya untuk mewujudkan keluarga sejahtera.', '/assets/logo-pkk.svg'),
  ('Karang Taruna Tunas Harapan', 'Wadah pengembangan generasi muda desa di bidang sosial, olahraga, kesenian, dan kepemimpinan untuk kemajuan pemuda desa.', '/assets/logo-kartar.svg');
