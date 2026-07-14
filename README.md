# 📱 SIPELAK - Portal Pelayanan Warga Kecamatan (User Portal)

Selamat datang di repositori **SIPELAK - Portal Pelayanan Warga**, antarmuka publik berbasis web yang dirancang untuk mempermudah warga kecamatan dalam mengurus berbagai dokumen kependudukan secara mandiri, melacak status permohonan secara berkala, dan membaca informasi terbaru dari kecamatan.

---

## 🌟 Fitur Utama (Key Features)

Aplikasi portal warga ini dilengkapi dengan berbagai fitur modern untuk memberikan pengalaman terbaik bagi pengguna:

1. **Dashboard Beranda Publik**:
   - **Informasi Layanan**: Menu interaktif yang menampilkan 8 layanan utama beserta persyaratan dokumen secara detail.
   - **Alur Pelayanan**: Alur grafis langkah-langkah pengajuan dari pengisian formulir hingga pengambilan dokumen.
   - **Statistik Pelayanan**: Menampilkan jumlah pengajuan yang sukses diproses, sedang berjalan, dan ditolak.
   - **Berita & Pengumuman**: Kabar terbaru mengenai kegiatan kecamatan, sosialisasi, dan pengumuman penting lainnya.
   - **FAQ (Tanya Jawab)**: Modul akordeon untuk menjawab pertanyaan umum yang sering diajukan warga.
   - **Kontak & Hubungi Kami**: Informasi alamat kantor kecamatan, peta lokasi, nomor WhatsApp, email, dan detail pimpinan kecamatan (Camat).

2. **Otentikasi & Profil Warga**:
   - Pendaftaran akun baru warga menggunakan NIK (16 digit), Nama Lengkap, Nomor Telepon, Email, dan Kata Sandi.
   - Masuk akun secara aman.
   - Manajemen profil otomatis yang secara instan mengisi data formulir pengajuan berikutnya.

3. **Formulir Pengajuan Surat Multi-Step**:
   - **Langkah 1 (Pilih Layanan)**: Dropdown pilihan dokumen kependudukan lengkap dengan daftar persyaratannya.
   - **Langkah 2 (Data Pemohon)**: Pengisian data pribadi (NIK, Nama, Kontak, Alamat Lengkap, RT/RW) dengan validasi regex otomatis.
   - **Langkah 3 (Unggah Berkas)**: Drag-and-drop berkas persyaratan (tipe file JPG, PNG, PDF; batas ukuran maksimal 5MB per file).
   - **Langkah 4 (Selesai/Resi)**: Tanda terima digital yang berisi kode lacak unik (`SPLK-XXXXX`), detail ringkasan, tombol unduh resi (ramah cetak), dan petunjuk pengambilan berkas.

4. **Sistem Pelacakan Dokumen (Tracking System)**:
   - **Pelacakan Anonim**: Warga dapat memasukkan kode unik (`SPLK-XXXXX`) pada kolom pencarian di beranda untuk memantau status secara langsung tanpa perlu masuk akun.
   - **Tracking Terpusat (Surat Saya)**: Warga yang telah login dapat memantau seluruh riwayat pengajuan mereka, melihat alasan penolakan, melakukan pratinjau draf dokumen, atau mencetak/mengunduh dokumen fisik yang telah ditandatangani secara elektronik (jika status telah 'Siap Diambil').

---

## 🛠️ Stack Teknologi (Tech Stack)

Aplikasi portal warga ini dibangun di atas teknologi frontend modern:

* **Framework Library**: [React v19](https://react.dev/) dengan [TypeScript](https://www.typescriptlang.org/) untuk menjamin kode yang *type-safe* dan mudah dipelihara.
* **Build Tool**: [Vite v8](https://vite.dev/) untuk proses kompilasi instan dan Hot Module Replacement (HMR) yang cepat.
* **Ikon**: [Lucide React](https://lucide.dev/) untuk representasi visual UI yang bersih.
* **Styling**: Vanilla CSS kustom ([`src/App.css`](file:///home/dimasarjuna/Documents/sipelak/user/src/App.css) & [`src/index.css`](file:///home/dimasarjuna/Documents/sipelak/user/src/index.css)) dengan arsitektur responsif (desktop, tablet, dan mobile) serta dukungan *print-styling* kustom untuk cetak berkas/resi.

---

## 💾 Integrasi Database & Mekanisme API Fallback

Aplikasi portal warga ini dirancang dengan kecerdasan backend hibrida (3-tier fallback) di berkas [`src/lib/supabaseService.ts`](file:///home/dimasarjuna/Documents/sipelak/user/src/lib/supabaseService.ts):

1. **Supabase Client (Utama)**:
   Aplikasi akan memeriksa variabel `.env` berikut:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   Jika ada, sistem akan langsung menggunakan API Supabase. Data disimpan langsung di cloud dan divalidasi dengan aturan Row Level Security (RLS) di tabel `profiles` dan `pengajuan`.

2. **Next.js Admin Server (Simulasi Lokal)**:
   Jika Supabase tidak diaktifkan, portal warga akan secara dinamis mendeteksi keberadaan server panel kontrol admin Next.js di alamat `http://localhost:3000`. Jika server online, data warga akan langsung disinkronkan ke server admin dan tersimpan dalam berkas `db.json` milik admin.

3. **Local Storage Fallback (Offline Mode)**:
   Jika kedua backend di atas tidak tersedia, aplikasi beralih secara otomatis ke penyimpanan browser lokal (`localStorage`). Banner informasi kuning akan muncul di bagian atas untuk menandai bahwa aplikasi sedang berjalan dalam mode demonstrasi offline.

---

## 🚀 Cara Menjalankan Aplikasi di Lingkungan Lokal

Ikuti langkah-langkah di bawah ini untuk memulai:

### 📋 Prasyarat
- Pastikan Anda sudah menginstal **Node.js (versi >= 18.x)**.

### ⚙️ Jalankan Aplikasi
1. Buka terminal di folder `user`:
   ```bash
   npm install
   ```

2. Buat file `.env` di dalam folder `user/` (Opsional, hanya jika ingin diintegrasikan dengan Supabase):
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxx...
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```
   Aplikasi warga akan berjalan di **`http://localhost:5173`** (atau port lain yang dialokasikan oleh Vite).

---

## 🏗️ Struktur File Penting

* [`src/App.tsx`](file:///home/dimasarjuna/Documents/sipelak/user/src/App.tsx): File root yang mengatur navigasi antar halaman (*conditional rendering* untuk beranda, formulir, otentikasi, dan daftar dokumen).
* [`src/lib/supabaseService.ts`](file:///home/dimasarjuna/Documents/sipelak/user/src/lib/supabaseService.ts): Jantung dari logika penanganan API, autentikasi, serta mekanisme *fallback* 3-tier.
* [`src/components/FormPengajuan.tsx`](file:///home/dimasarjuna/Documents/sipelak/user/src/components/FormPengajuan.tsx): Formulir pengajuan multi-step yang mengelola validasi input data dan simulasi unggah dokumen warga.
* [`src/components/SuratSaya.tsx`](file:///home/dimasarjuna/Documents/sipelak/user/src/components/SuratSaya.tsx): Panel pelacakan pribadi bagi warga terautentikasi untuk melihat semua dokumen yang diajukan beserta status terbarunya, serta mencakup generator dokumen cetak (PDF/print).
* [`supabase_migration.sql`](file:///home/dimasarjuna/Documents/sipelak/user/supabase_migration.sql): Skrip inisialisasi basis data PostgreSQL untuk Supabase.
