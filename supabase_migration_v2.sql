drop trigger if exists before_pengajuan_status_update on public.pengajuan;

-- Penyesuaian skema tabel pengajuan (mendukung multi-file upload & berkas name)
alter table public.pengajuan add column if not exists document_name text default 'berkas_persyaratan.pdf';

create table if not exists public.admins (
  id uuid references auth.users on delete cascade primary key,
  username varchar(50) unique not null,
  nama text not null,
  role varchar(50) check (role in ('Super Admin', 'Verifikator', 'Petugas Pelayanan')) not null default 'Petugas Pelayanan',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.services (
  id text primary key, 
  title text not null,
  description text,
  requirements text[] not null default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create table if not exists public.faqs (
  id varchar(50) primary key, 
  question text not null,
  answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.news (
  id varchar(50) primary key,
  title text not null,
  category varchar(50) check (category in ('Layanan', 'Pengumuman', 'Kegiatan')) not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.contact (
  id integer primary key default 1 check (id = 1),
  phone varchar(20) not null,
  email text not null,
  alamat text not null,
  camat_nama text not null,
  camat_nip varchar(30) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.statistik (
  id serial primary key,
  value varchar(50) not null,
  label varchar(100) not null,
  description text not null,
  color_class varchar(20) not null,
  icon_name varchar(50) default 'Layers',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.alur (
  id serial primary key,
  step_number varchar(5) not null,
  title varchar(100) not null,
  description text not null,
  icon_name varchar(50) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins where id = auth.uid() and role = 'Super Admin'
  );
end;
$$ language plpgsql security definer;

create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_admin_user boolean := false;
  admin_role text := 'Petugas Pelayanan';
  username_val text;
begin
  if (new.email like '%@sipelak.go.id') or 
      (coalesce((new.raw_user_meta_data->>'is_admin')::boolean, false) = true) or
      (new.raw_user_meta_data->>'role' in ('Super Admin', 'Verifikator', 'Petugas Pelayanan')) then
    is_admin_user := true;
  end if;

  if is_admin_user then
    admin_role := coalesce(new.raw_user_meta_data->>'role', 'Petugas Pelayanan');
    username_val := coalesce(
      new.raw_user_meta_data->>'username', 
      split_part(new.email, '@', 1) || '_' || floor(random() * 1000)::text
    );

    insert into public.admins (id, username, nama, role, created_at)
    values (
      new.id,
      username_val,
      coalesce(new.raw_user_meta_data->>'nama', new.raw_user_meta_data->>'nama_lengkap', 'Petugas Kecamatan'),
      admin_role,
      now()
    );
  else
    insert into public.profiles (id, nama_lengkap, phone, nik, created_at)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'nama_lengkap', 'Warga Kecamatan'),
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'nik',
      now()
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

create or replace function public.check_submission_status_update()
returns trigger as $$
begin
  if (OLD.status <> NEW.status or OLD.status_detail <> NEW.status_detail or OLD.verified_at is distinct from NEW.verified_at) then
    if not public.is_admin() then
      raise exception 'Akses ditolak: Hanya administrator yang dapat memperbarui status atau tanggal verifikasi pengajuan.';
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger before_pengajuan_status_update
  before update on public.pengajuan
  for each row
  execute procedure public.check_submission_status_update();


alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.news enable row level security;
alter table public.contact enable row level security;
alter table public.statistik enable row level security;
alter table public.alur enable row level security;

drop policy if exists "Admin dapat melihat data rekan admin lainnya" on public.admins;
drop policy if exists "Hanya Super Admin yang dapat menambahkan admin baru" on public.admins;
drop policy if exists "Hanya Super Admin yang dapat mengupdate data admin" on public.admins;
drop policy if exists "Hanya Super Admin yang dapat menghapus admin" on public.admins;

drop policy if exists "Semua orang dapat melihat daftar layanan" on public.services;
drop policy if exists "Hanya Admin yang dapat memodifikasi layanan" on public.services;

drop policy if exists "Semua orang dapat melihat FAQ" on public.faqs;
drop policy if exists "Hanya Admin yang dapat memodifikasi FAQ" on public.faqs;

drop policy if exists "Semua orang dapat melihat berita" on public.news;
drop policy if exists "Hanya Admin yang dapat memodifikasi berita" on public.news;

drop policy if exists "Semua orang dapat melihat kontak kecamatan" on public.contact;
drop policy if exists "Hanya Admin yang dapat mengupdate kontak" on public.contact;

drop policy if exists "Semua orang dapat melihat statistik" on public.statistik;
drop policy if exists "Hanya Admin yang dapat mengupdate statistik" on public.statistik;

drop policy if exists "Semua orang dapat melihat alur" on public.alur;
drop policy if exists "Hanya Admin yang dapat mengupdate alur" on public.alur;

create policy "Admin dapat melihat data rekan admin lainnya"
  on public.admins for select
  using (auth.uid() = id or public.is_admin());

create policy "Hanya Super Admin yang dapat menambahkan admin baru"
  on public.admins for insert
  with check (public.is_super_admin());

create policy "Hanya Super Admin yang dapat mengupdate data admin"
  on public.admins for update
  using (public.is_super_admin());

create policy "Hanya Super Admin yang dapat menghapus admin"
  on public.admins for delete
  using (public.is_super_admin());

-- Services Policies
create policy "Semua orang dapat melihat daftar layanan"
  on public.services for select
  using (true);

create policy "Hanya Admin yang dapat memodifikasi layanan"
  on public.services for all
  using (public.is_admin());

-- FAQs Policies
create policy "Semua orang dapat melihat FAQ"
  on public.faqs for select
  using (true);

create policy "Hanya Admin yang dapat memodifikasi FAQ"
  on public.faqs for all
  using (public.is_admin());

-- News Policies
create policy "Semua orang dapat melihat berita"
  on public.news for select
  using (true);

create policy "Hanya Admin yang dapat memodifikasi berita"
  on public.news for all
  using (public.is_admin());

-- Contact Policies
create policy "Semua orang dapat melihat kontak kecamatan"
  on public.contact for select
  using (true);

create policy "Hanya Admin yang dapat mengupdate kontak"
  on public.contact for all
  using (public.is_admin());

-- Statistik Policies
create policy "Semua orang dapat melihat statistik"
  on public.statistik for select
  using (true);

create policy "Hanya Admin yang dapat mengupdate statistik"
  on public.statistik for all
  using (public.is_admin());

-- Alur Policies
create policy "Semua orang dapat melihat alur"
  on public.alur for select
  using (true);

create policy "Hanya Admin yang dapat mengupdate alur"
  on public.alur for all
  using (public.is_admin());

-- 7. SEED DATA

-- A. Seed Services
insert into public.services (id, title, description, requirements) values
('ktp', 'Kartu Tanda Penduduk (KTP-el)', 'Pengajuan KTP-el baru (pemula usia 17 tahun) maupun penggantian KTP yang rusak atau hilang.', array[
  'Berusia minimal 17 tahun atau sudah menikah',
  'Fotokopi Kartu Keluarga (KK) terbaru',
  'Surat Pengantar dari RT/RW setempat',
  'Surat Keterangan Kehilangan dari Kepolisian (khusus jika KTP hilang)',
  'KTP lama yang rusak (khusus jika KTP rusak)'
]),
('kk', 'Kartu Keluarga (KK)', 'Pengurusan Kartu Keluarga baru, perubahan data anggota keluarga, atau pemecahan KK.', array[
  'Surat Pengantar RT/RW',
  'Kartu Keluarga (KK) asli yang lama',
  'Fotokopi Akta Nikah / Buku Nikah bagi yang baru menikah',
  'Fotokopi Akta Kelahiran (untuk penambahan anggota keluarga baru)',
  'Surat Keterangan Pindah (jika ada anggota keluarga yang pindah masuk)'
]),
('kia', 'Kartu Identitas Anak (KIA)', 'Penerbitan kartu identitas resmi bagi anak di bawah usia 17 tahun untuk akses fasilitas publik.', array[
  'Fotokopi Akta Kelahiran Anak',
  'Fotokopi Kartu Keluarga (KK) orang tua',
  'Fotokopi KTP kedua orang tua / wali',
  'Pas foto anak ukuran 2x3 berwarna sebanyak 2 lembar (bagi anak usia di atas 5 tahun)'
]),
('skp', 'Surat Keterangan Pindah (SKP)', 'Pengurusan surat kepindahan domisili penduduk ke luar daerah/kecamatan.', array[
  'Surat Pengantar RT/RW',
  'Kartu Keluarga (KK) asli dan fotokopi',
  'KTP-el asli dan fotokopi',
  'Alamat tujuan pindah yang lengkap (RT/RW, Desa/Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi)',
  'Pas foto terbaru ukuran 3x4 sebanyak 3 lembar'
]),
('sktm', 'Surat Keterangan Tidak Mampu (SKTM)', 'Surat keterangan untuk keringanan biaya pendidikan, pelayanan kesehatan, atau bantuan sosial.', array[
  'Surat Pengantar RT/RW',
  'Fotokopi KTP dan Kartu Keluarga (KK) pemohon',
  'Surat Pernyataan Miskin yang ditandatangani oleh RT/RW di atas materai Rp10.000',
  'Fotokopi Kartu Indonesia Sehat (KIS) / BPJS (jika ada)',
  'Foto rumah tampak depan'
]),
('sku', 'Surat Keterangan Usaha (SKU)', 'Pemberian surat keterangan legalitas usaha mikro/kecil untuk syarat pengajuan kredit atau kemitraan.', array[
  'Surat Pengantar RT/RW',
  'Fotokopi KTP-el pengusaha',
  'Fotokopi Kartu Keluarga (KK)',
  'Surat Pernyataan Kepemilikan Usaha dari yang bersangkutan',
  'Foto kegiatan / lokasi usaha secara jelas'
]),
('nikah', 'Surat Pengantar Nikah (N1-N4)', 'Pengurusan berkas administrasi dan surat pengantar pengantar nikah ke KUA.', array[
  'Surat Pengantar RT/RW',
  'Fotokopi KTP-el calon pengantin laki-laki & perempuan',
  'Fotokopi Kartu Keluarga (KK) calon pengantin',
  'Fotokopi Akta Kelahiran calon pengantin',
  'Pas foto latar belakang biru (2x3 sebanyak 4 lembar, 4x6 sebanyak 2 lembar)'
]),
('skck', 'Surat Pengantar SKCK', 'Surat rekomendasi kecamatan untuk pengajuan SKCK di Kepolisian Sektor (Polsek) setempat.', array[
  'Surat Pengantar RT/RW',
  'Fotokopi KTP-el pemohon',
  'Fotokopi Kartu Keluarga (KK)',
  'Fotokopi Akta Kelahiran atau Ijazah Terakhir',
  'Pas foto berwarna ukuran 4x6 sebanyak 2 lembar'
])
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  requirements = excluded.requirements;

-- B. Seed FAQs
insert into public.faqs (id, question, answer) values
('faq-1', 'Apakah pelayanan administrasi SIPELAK dipungut biaya?', 'Tidak sama sekali. Semua jenis pelayanan administrasi kependudukan yang dilakukan melalui sistem SIPELAK adalah 100% gratis atau Rp0 (tanpa biaya apapun), sebagai komitmen kami memberantas pungli.'),
('faq-2', 'Berapa lama waktu yang dibutuhkan hingga dokumen selesai?', 'Rata-rata proses verifikasi dan penyelesaian berkas berlangsung selama 1x24 jam hari kerja sejak berkas Anda diunggah dengan lengkap. Anda akan menerima notifikasi status pengajuan Anda secara berkala.'),
('faq-3', 'Bagaimana cara memantau status pengajuan dokumen saya?', 'Anda dapat memantau status secara langsung melalui fitur "Lacak Status Pengajuan" di halaman Beranda. Cukup masukkan Kode Pengajuan (misalnya: SPLK-XXXXX) yang Anda dapatkan sesaat setelah mengirim formulir.'),
('faq-4', 'Apakah saya masih perlu datang ke kantor kecamatan?', 'Untuk beberapa dokumen yang sudah menggunakan Tanda Tangan Elektronik (TTE) resmi seperti KK atau SKTM, Anda dapat mengunduh dan mencetaknya sendiri di rumah. Namun, untuk berkas fisik seperti KTP-el asli atau kartu KIA, Anda harus datang mengambilnya ke kantor kecamatan dengan menunjukkan Kode Pengajuan.'),
('faq-5', 'Apa yang harus dilakukan jika pengajuan saya ditolak?', 'Jika pengajuan ditolak, Anda akan menerima keterangan atau alasan penolakan secara transparan (misalnya: foto dokumen buram atau KK kedaluwarsa). Anda dipersilakan melakukan pengajuan ulang dengan memperbaiki dokumen sesuai instruksi petugas.'),
('faq-6', 'Bagaimana cara menghubungi petugas jika ada kendala?', 'Anda dapat menghubungi layanan pengaduan dan bantuan kami melalui nomor WhatsApp resmi kecamatan atau mengunjungi bagian Layanan Pelanggan di kantor kecamatan yang detail kontaknya tercantum di bagian bawah website ini.')
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer;

-- C. Seed News
insert into public.news (id, title, category, content, created_at) values
('news-1', 'Pelayanan KTP Digital (IKD) Mulai Diterapkan di Kecamatan Cerdas', 'Layanan', 'Mulai Juli 2026, seluruh warga Kecamatan Cerdas sudah dapat mengaktifkan Identitas Kependudukan Digital (IKD) melalui loket pelayanan nomor 2 di Kantor Kecamatan. Cukup membawa KTP-el fisik dan HP Android/iOS untuk proses verifikasi wajah dan email. IKD mempermudah warga dalam bertransaksi pelayanan publik tanpa perlu lagi memfotokopi fisik KTP.', now() - interval '3 days'),
('news-2', 'Jadwal Pelayanan Keliling Pekan Ini di Desa Cerdas Jaya', 'Pengumuman', 'Untuk mempermudah warga desa yang terpencil, Kantor Kecamatan Cerdas menyelenggarakan program "SIPELAK Keliling Jemput Bola" di Aula Desa Cerdas Jaya pada hari Rabu, 15 Juli 2026. Pelayanan dibuka pukul 09.00 - 13.00 WIB untuk perekaman KTP-el pemula, perbaikan KK, dan cetak KIA. Harap membawa dokumen asli dan fotokopi lengkap.', now() - interval '1 day')
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  content = excluded.content,
  created_at = excluded.created_at;

-- D. Seed Contact
insert into public.contact (id, phone, email, alamat, camat_nama, camat_nip, updated_at)
values (
  1, 
  '08123456789', 
  'kecamatan.cerdas@sipelak.go.id', 
  'Jl. Raya Pembangunan No. 45, Komplek Perkantoran Terpadu, Kode Pos 14045', 
  'Drs. H. ADITYA NUGRAHA, M.Si.', 
  '19780512 200501 1 002',
  now()
)
on conflict (id) do update set
  phone = excluded.phone,
  email = excluded.email,
  alamat = excluded.alamat,
  camat_nama = excluded.camat_nama,
  camat_nip = excluded.camat_nip,
  updated_at = excluded.updated_at;

-- E. Seed Statistik
insert into public.statistik (id, value, label, description, color_class, icon_name) values
(1, '14,825', 'Total Pengajuan', 'Dokumen masuk terhitung sejak awal tahun', 'blue', 'Layers'),
(2, '14,562', 'Selesai Diproses', 'Dokumen berhasil diterbitkan & diserahkan', 'green', 'CheckCircle2'),
(3, '24 Jam', 'Rata-rata Waktu Proses', 'Lebih cepat dibanding pengurusan konvensional', 'yellow', 'Clock'),
(4, '98.6%', 'Kepuasan Warga (IKM)', 'Berdasarkan survei kepuasan pelayanan online', 'teal', 'ThumbsUp')
on conflict (id) do update set
  value = excluded.value,
  label = excluded.label,
  description = excluded.description,
  color_class = excluded.color_class,
  icon_name = excluded.icon_name;

-- F. Seed Alur
insert into public.alur (id, step_number, title, description, icon_name) values
(1, '01', 'Pilih Layanan', 'Tentukan jenis administrasi yang Anda butuhkan, baca persyaratannya, lalu klik tombol Ajukan Sekarang.', 'Search'),
(2, '02', 'Isi Data & Unggah', 'Lengkapi formulir online dengan data diri Anda yang valid, dan unggah foto/scan dokumen persyaratan yang diminta.', 'Edit3'),
(3, '03', 'Verifikasi Petugas', 'Petugas kecamatan akan memverifikasi berkas Anda secara online. Jika ada kekurangan, Anda akan langsung dihubungi.', 'ShieldAlert'),
(4, '04', 'Selesai & Ambil', 'Setelah dokumen selesai diproses, Anda akan menerima notifikasi untuk mengunduh dokumen atau mengambilnya di kantor.', 'CheckCircle2')
on conflict (id) do update set
  step_number = excluded.step_number,
  title = excluded.title,
  description = excluded.description,
  icon_name = excluded.icon_name;

-- Reload PostgREST schema cache to make new columns visible immediately
notify pgrst, 'reload schema';
