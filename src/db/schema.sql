-- ==========================================
-- SCHEMA SQL: WEBSITE DESA TEMPURSARI
-- Jalankan skrip ini di SQL Editor Supabase Anda
-- Aman dijalankan ulang: menggunakan IF NOT EXISTS
-- ==========================================

-- 1. Tabel Pemerintah Desa
create table if not exists pemerintah_desa (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  jabatan text not null,
  foto_url text,
  kontak text not null,
  has_whatsapp boolean default true,
  deskripsi text,
  urutan int default 0,
  created_at timestamp with time zone default now()
);

-- 2. Tabel Artikel / Kabar Desa
create table if not exists artikel (
  id uuid default gen_random_uuid() primary key,
  judul text not null,
  konten text not null,
  foto_url text,
  kategori text not null,
  tanggal date default current_date,
  author text default 'Tim KKN',
  created_at timestamp with time zone default now()
);

-- 3. Tabel UMKM
create table if not exists umkm (
  id uuid default gen_random_uuid() primary key,
  nama_usaha text not null,
  pemilik text not null,
  deskripsi text not null,
  foto_url text,
  kontak text not null,
  alamat text,
  created_at timestamp with time zone default now()
);

-- 4. Tabel Objek Wisata
create table if not exists objek_wisata (
  id uuid default gen_random_uuid() primary key,
  nama_wisata text not null,
  deskripsi text not null,
  foto_url text,
  lokasi text,
  maps_url text,
  created_at timestamp with time zone default now()
);

-- 5. Tabel Kesenian Daerah
create table if not exists kesenian_daerah (
  id uuid default gen_random_uuid() primary key,
  nama_kesenian text not null,
  deskripsi text not null,
  foto_url text,
  jadwal_kegiatan text,
  created_at timestamp with time zone default now()
);

-- 6. Tabel Lembaga Desa
create table if not exists lembaga_desa (
  id uuid default gen_random_uuid() primary key,
  nama_lembaga text not null,
  deskripsi text not null,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- 7. Tabel Demografi Desa
create table if not exists demografi_desa (
  id uuid default gen_random_uuid() primary key,
  kategori text not null,  -- 'Pekerjaan' | 'Pendidikan' | 'Usia'
  nama text not null,      -- label (cth: 'Petani', 'Tamat SD', '25-49 tahun')
  jumlah int not null default 0,
  created_at timestamp with time zone default now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Semua tabel dapat dibaca oleh siapa saja (public),
-- tetapi hanya dapat diubah/ditulis oleh admin terautentikasi.
-- ==========================================

alter table pemerintah_desa enable row level security;
alter table artikel enable row level security;
alter table umkm enable row level security;
alter table objek_wisata enable row level security;
alter table kesenian_daerah enable row level security;
alter table lembaga_desa enable row level security;
alter table demografi_desa enable row level security;

-- Kebijakan Baca (Select) untuk Public
-- Gunakan DO $$ ... END $$ agar tidak error jika policy sudah ada
do $$ begin
  create policy "Pemerintah Desa terbuka untuk semua" on pemerintah_desa for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Artikel terbuka untuk semua" on artikel for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "UMKM terbuka untuk semua" on umkm for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Objek Wisata terbuka untuk semua" on objek_wisata for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Kesenian Daerah terbuka untuk semua" on kesenian_daerah for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Lembaga Desa terbuka untuk semua" on lembaga_desa for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Demografi Desa terbuka untuk semua" on demografi_desa for select using (true);
exception when duplicate_object then null; end $$;

-- Kebijakan CRUD (Write/Edit) untuk Admin Terautentikasi
do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Pemerintah Desa" on pemerintah_desa for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Artikel" on artikel for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah UMKM" on umkm for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Objek Wisata" on objek_wisata for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Kesenian Daerah" on kesenian_daerah for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Lembaga Desa" on lembaga_desa for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Hanya admin terautentikasi yang dapat mengubah Demografi Desa" on demografi_desa for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
