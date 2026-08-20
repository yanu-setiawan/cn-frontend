# Call Monitoring — Frontend

## 1. Overview

Aplikasi frontend **Call Monitoring**: dashboard untuk memantau daftar panggilan Customer Service beserta skor sentimen nasabah. Fitur yang tersedia meliputi pencarian, filter periode tanggal, filter skor sentimen, filter status, sorting, dan pagination.

Aplikasi ini **tidak memiliki database sendiri**. Seluruh data diambil dari **backend Spring Boot yang berjalan terpisah** melalui HTTP request ke endpoint `/api/v1/call-monitoring`. Base URL backend dikonfigurasi lewat environment variable (lihat [Setup Environment Variable](#3-setup-environment-variable)). Backend harus sudah berjalan sebelum aplikasi ini dipakai — kalau tidak, tabel akan kosong dan muncul notifikasi error.

### Tech Stack

Versi diambil langsung dari `package.json`.

| Kategori       | Package                            | Versi            |
| -------------- | ---------------------------------- | ---------------- |
| UI Library     | `react`, `react-dom`               | ^19.2.8          |
| Bahasa         | `typescript`                       | ~6.0.2           |
| Build Tool     | `vite`                             | ^8.2.0           |
| Plugin React   | `@vitejs/plugin-react`             | ^6.0.4           |
| Styling        | `tailwindcss`, `@tailwindcss/vite` | ^4.3.3           |
| Komponen UI    | `@heroui/react`                    | ^2.8.10          |
| Data Fetching  | `@tanstack/react-query`            | ^5.101.4         |
| Devtools Query | `@tanstack/react-query-devtools`   | ^5.101.4         |
| Tabel          | `@tanstack/react-table`            | ^8.21.3          |
| HTTP Client    | `axios`                            | ^1.19.0          |
| Routing        | `react-router-dom`                 | ^7.18.2          |
| Tanggal        | `@internationalized/date`          | ^3.12.3          |
| Animasi        | `framer-motion`                    | ^13.1.1          |
| Ikon           | `lucide-react`, `react-icons`      | ^1.33.0, ^5.7.0  |
| Notifikasi     | `react-hot-toast`                  | ^2.6.0           |
| Testing        | `vitest`                           | ^4.1.11          |
| Testing        | `@testing-library/react`           | ^16.3.2          |
| Testing        | `@testing-library/jest-dom`        | ^7.0.1           |
| Testing        | `@testing-library/user-event`      | ^14.6.5          |
| Testing        | `jsdom`                            | ^29.1.1          |
| Linting        | `eslint`, `typescript-eslint`      | ^10.8.0, ^8.65.0 |
| Formatting     | `prettier`                         | ^3.9.6           |

### Struktur Folder

```
src/
├── api/            # Instance axios + interceptor response (error handling)
├── assets/         # Aset statis (gambar, svg)
├── components/     # Komponen reusable
│   ├── Loader/     # Loading indicator full-screen
│   └── Table/      # Tabel generic: pagination, skeleton, empty state
├── constant/       # Opsi dropdown filter & sorting
├── interface/      # Tipe TypeScript
│   ├── request/    # Tipe payload & query param request
│   └── response/   # Tipe response backend
├── lib/            # Utility function murni (format & parsing tanggal)
├── pages/          # Halaman
│   ├── CallMonitoring/  # Halaman utama monitoring
│   └── WelcomePage/     # Landing page
├── services/       # Service layer + React Query hook
│   └── CallMonitoring/
└── test/           # Setup file Vitest
```

---

## 2. Cara Menjalankan Aplikasi

### 1. Prasyarat

- **Node.js 20+** (rekomendasi umum — project ini tidak mendefinisikan field `engines` di `package.json`, jadi versi tidak dikunci)
- **npm** (terpasang bersama Node.js)
- **Backend Spring Boot sudah berjalan** — lihat README backend untuk cara menjalankannya

### 2. Install Dependency

```bash
npm install
```

### 3. Setup Environment Variable

> **Catatan:** project ini **belum menyertakan file `.env.example`**. File `.env` harus dibuat manual di root project.

Buat file bernama `.env` di root project (sejajar dengan `package.json`), lalu isi dengan:

```env
VITE_HTTP_API=http://localhost:8080
```

Daftar environment variable yang benar-benar dipakai di source code:

| Variable        | Contoh Value            | Keterangan                                                                                                                                                                                                                                                         |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_HTTP_API` | `http://localhost:8080` | Base URL backend Spring Boot, **tanpa trailing slash**. Dipakai sebagai `baseURL` instance axios di `src/api/axios.ts`. Nilai sebenarnya menyesuaikan host dan port tempat backend dijalankan — `[isi manual: konfirmasi host & port backend dari README backend]` |

Hanya satu variable di atas yang dipakai di seluruh source code (diverifikasi lewat pencarian `import.meta.env` di folder `src/`). Prefix `VITE_` wajib ada, karena Vite hanya mengekspos variable berawalan `VITE_` ke sisi client.

Jika `VITE_HTTP_API` tidak diisi, `baseURL` akan bernilai `undefined` dan semua request ke backend gagal.

### 4. Menjalankan Mode Development

```bash
npm run dev
```

Aplikasi berjalan di **http://localhost:5173** (port default Vite).

> Kalau port 5173 sedang dipakai proses lain, Vite otomatis memilih port kosong berikutnya (5174, 5175, dan seterusnya). Selalu cek URL yang tercetak di terminal setelah menjalankan perintah di atas.

### 5. Production Build

```bash
npm run build
```

Perintah ini menjalankan `tsc -b` (type check seluruh project) lalu `vite build`. Build **gagal jika ada type error**. Hasil build masuk ke folder `dist/`.

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

### Script Lain yang Tersedia

| Script       | Perintah               | Fungsi                             |
| ------------ | ---------------------- | ---------------------------------- |
| `dev`        | `vite`                 | Menjalankan dev server dengan HMR  |
| `build`      | `tsc -b && vite build` | Type check + production build      |
| `preview`    | `vite preview`         | Preview hasil production build     |
| `lint`       | `eslint .`             | Menjalankan ESLint                 |
| `test`       | `vitest run`           | Menjalankan unit test sekali jalan |
| `test:watch` | `vitest`               | Unit test mode watch               |

---

## 3. Unit Test

### Daftar File Test

Total **3 file test** dengan **32 test case**.

| File Test                                        | Jumlah Test Case | Cakupan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/__tests__/date.test.ts`                 | 22               | Menguji 5 utility tanggal di `src/lib/date.ts`. **`toISODateString`** — konversi `Date` ke format `YYYY-MM-DD`, padding nol, pembuangan bagian jam, dan `RangeError` untuk `Date` tidak valid. **`getDefaultDateRange`** — rentang 3 bulan terakhir, format output, rollover tanggal akhir bulan (31 Mei dikurangi 3 bulan bukan 31 Februari), dan rentang lintas tahun. **`parseDate`** — konversi string ke `CalendarDate`, tanggal kabisat 29 Februari, serta error untuk string kosong dan format salah. **`formatCallTimestamp`** — format locale `id-ID`, padding, format 24 jam, input UTC bersuffix `Z`, dan `"Invalid Date"` untuk input tidak valid. **`formatDateTime`** — format `Hari, DD Bulan YYYY \| HH.mm WIB`, nama hari dan bulan Bahasa Indonesia, serta penanganan tengah malam `00.00`. |
| `src/components/Table/__tests__/index.test.tsx`  | 7                | Menguji komponen `CustomTable`: render header kolom, tampilan seluruh baris data, skeleton loading saat `isLoading` aktif (sekaligus memastikan data lama tidak ikut tampil), empty state saat data kosong, perhitungan rentang item yang ditampilkan di halaman kedua (`Menampilkan 11-12 dari 12 Item`), penyembunyian pagination lewat prop `hidePagination`, dan reset otomatis ke halaman 1 ketika `currentPage` melebihi jumlah halaman.                                                                                                                                                                                                                                                                                                                                                                |
| `src/components/Loader/__tests__/index.test.tsx` | 3                | Menguji komponen `LoaderPage`: render tanpa crash beserta teks `Loading ...`, jumlah bar animasi tepat 12 buah, dan `animation-delay` bertahap 0.1 detik per bar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Cara Menjalankan Test

Sekali jalan (dipakai sebelum commit atau di CI):

```bash
npm run test
```

Mode watch (test otomatis jalan ulang saat file berubah):

```bash
npm run test:watch
```

Output yang diharapkan:

```
 Test Files  3 passed (3)
      Tests  32 passed (32)
```

### Pendekatan Testing

Testing memakai **Vitest** dengan environment **jsdom**, dikonfigurasi langsung di `vite.config.ts` sehingga path alias `@/` dan konfigurasi plugin yang sudah ada tetap berlaku di test. Matcher tambahan `@testing-library/jest-dom` diregistrasi lewat `src/test/setup.ts`.

Utility murni di `src/lib/` ditest langsung sebagai function call tanpa render komponen — lebih cepat dan assertion-nya bisa mengecek nilai persis, bukan sekadar memastikan hasilnya tidak kosong. Setiap function dicover skenario normal sekaligus edge case (input kosong, `Date` tidak valid, boundary tanggal akhir bulan dan pergantian tahun). Khusus function yang bergantung timezone, objek `Date` dibuat lewat constructor waktu lokal atau `Date.UTC()` secara eksplisit supaya hasil test konsisten di mesin dengan timezone berbeda.

Komponen ditest dengan **React Testing Library**, dengan assertion berbasis apa yang benar-benar dilihat user — teks yang tampil, jumlah baris tabel, dan role elemen (`getByRole("columnheader")`) — bukan implementation detail seperti nama state internal atau struktur props. Interaksi antar-prop diverifikasi lewat efek yang terlihat: misalnya `handlePageChange` yang dipastikan terpanggil dengan nilai `1` saat `currentPage` melebihi total halaman.

---

## 4. AI Usage

**AI tool yang digunakan:** Claude (Anthropic)

**Bagian pekerjaan yang dibantu AI:** Setup konfigurasi testing (Vitest + React Testing Library) dan penulisan unit test untuk komponen tabel dan utility function tanggal.

**Contoh prompt utama:**

1. "Setup Vitest dan React Testing Library untuk project ini tanpa mengubah konfigurasi Vite yang sudah ada (React Compiler, Tailwind v4, path alias, image optimizer). Sertakan environment jsdom, setup file untuk jest-dom matcher, dan script `test`/`test:watch` di package.json."

2. "Review unit test `CustomTable` berikut — validasi setiap assertion terhadap implementasi komponen aslinya baris per baris, tandai kalau ada assertion yang rapuh (bergantung pada implementation detail) atau ada behavior komponen yang tidak sesuai ekspektasi test."

**Cara verifikasi hasil AI:**

- Setiap assertion di test dicek manual terhadap kode komponen asli (bukan cuma percaya hasil AI).
- `npm run test` dijalankan untuk verifikasi otomatis semua test lulus sebelum commit
- Konfigurasi Vitest di `vite.config.ts` dicek manual untuk pastikan tidak menimpa konfigurasi plugin lain yang sudah ada (React Compiler, Tailwind, path alias, image optimizer)
