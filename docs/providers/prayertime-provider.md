# Dokumentasi Prayer Time Provider

Prayer Time Provider menghitung dan menyediakan waktu sholat berdasarkan data dari **Location Provider**.

## Cara Kerja

1. Prayer Time Provider mengambil data koordinat dari **Location Provider**.
2. Menghitung waktu sholat menggunakan metode perhitungan astronomi.
3. Hasil perhitungan dapat dikoreksi secara manual menggunakan **offset**.
4. Jika terdapat file **cache** resmi dari Kemenag, maka sistem akan **memprioritaskan data cache** daripada hasil perhitungan.

## Metode Cache (Disarankan untuk akurasi Kemenag)

Jika ingin waktu sholat **sama persis** dengan jadwal Kementerian Agama (Kemenag):

1. Buka situs: [https://karbyt.github.io/twinkle/jadwal](https://karbyt.github.io/twinkle/jadwal)
2. Pilih **Provinsi** dan **Kabupaten/Kota**
3. Download file `.bin` sesuai tahun yang ingin di-cache  
   Contoh: `2026.bin`
4. Upload file tersebut ke filesystem perangkat pada path:  
   ```
   fs/cache/2026.bin
   ```
5. Pastikan semua **offset diset ke 0** ketika menggunakan metode cache.

> **Prioritas:**  
> Jika file cache tersedia → sistem menggunakan data cache.  
> Jika file cache tidak ada → sistem menggunakan hasil perhitungan + offset.

## Konfigurasi

| Parameter          | Tipe     | Keterangan                                              | Contoh Nilai |
|--------------------|----------|---------------------------------------------------------|--------------|
| `updateInterval`   | Number   | Interval update perhitungan waktu sholat (detik)        | `3600`       |
| `imsakOffset`      | Number   | Koreksi manual waktu Imsak (menit)                      | `0`          |
| `subuhOffset`      | Number   | Koreksi manual waktu Subuh (menit)                      | `0`          |
| `terbitOffset`     | Number   | Koreksi manual waktu Terbit (menit)                     | `0`          |
| `duhaOffset`       | Number   | Koreksi manual waktu Duha (menit)                       | `0`          |
| `zuhurOffset`      | Number   | Koreksi manual waktu Zuhur (menit)                      | `0`          |
| `asarOffset`       | Number   | Koreksi manual waktu Asar (menit)                       | `0`          |
| `magribOffset`     | Number   | Koreksi manual waktu Magrib (menit)                     | `0`          |
| `isyaOffset`       | Number   | Koreksi manual waktu Isya (menit)                       | `0`          |

> **Catatan:**  
> Saat menggunakan file cache Kemenag, **semua offset harus diset ke 0**.

## Data yang Dihasilkan

Semua waktu sholat dinyatakan dalam **menit dari tengah malam** (0 – 1439).

| Field         | Tipe     | Keterangan                                      | Contoh (menit) |
|---------------|----------|-------------------------------------------------|----------------|
| `isReady`     | Boolean  | `true` jika data waktu sholat sudah siap        | `true`         |
| `isActive`    | Boolean  | `true` jika Prayer Time Provider aktif          | `true`         |
| `imsak`       | Number   | Waktu Imsak (menit dari tengah malam)           | `265`          |
| `subuh`       | Number   | Waktu Subuh (menit dari tengah malam)           | `275`          |
| `terbit`      | Number   | Waktu Terbit (menit dari tengah malam)          | `360`          |
| `duha`        | Number   | Waktu Duha (menit dari tengah malam)            | `420`          |
| `zuhur`       | Number   | Waktu Zuhur (menit dari tengah malam)           | `720`          |
| `asar`        | Number   | Waktu Asar (menit dari tengah malam)            | `930`          |
| `magrib`      | Number   | Waktu Magrib (menit dari tengah malam)          | `1080`         |
| `isya`        | Number   | Waktu Isya (menit dari tengah malam)            | `1155`         |

#### Cara Membaca Nilai Menit dari Tengah Malam

Contoh:
- `zuhur = 720` → 720 ÷ 60 = **12:00**
- `magrib = 1080` → 1080 ÷ 60 = **18:00**
- `imsak = 265` → 265 ÷ 60 = **04:25**

---

## Hubungan Antar Modul

```
[Location Provider]
       │
       │  latitude, longitude, altitude
       ▼
[Prayer Time Provider]
       │
       ├── Perhitungan Astronomi + Offset
       │         atau
       └── Cache Kemenag (jika file .bin tersedia)
       │
       ▼
[Data waktu sholat siap dipakai]
  → imsak, subuh, terbit, duha, zuhur, asar, magrib, isya
```

---

## Contoh Konfigurasi Prayer Time Provider

### Menggunakan Perhitungan + Offset

```json
{
  "updateInterval": 3600,
  "imsakOffset": 2,
  "subuhOffset": 0,
  "terbitOffset": 0,
  "duhaOffset": 0,
  "zuhurOffset": -1,
  "asarOffset": 0,
  "magribOffset": 2,
  "isyaOffset": 0
}
```

### Menggunakan Cache Kemenag (Direkomendasikan)

```json
{
  "updateInterval": 3600,
  "imsakOffset": 0,
  "subuhOffset": 0,
  "terbitOffset": 0,
  "duhaOffset": 0,
  "zuhurOffset": 0,
  "asarOffset": 0,
  "magribOffset": 0,
  "isyaOffset": 0
}
```

Pastikan file cache sudah diunggah ke:
```
fs/cache/2026.bin
```

---

## Catatan Penting

1. **Location Provider** harus aktif dan `isReady = true` agar Prayer Time Provider dapat menghitung waktu dengan benar.
2. Offset digunakan untuk koreksi manual jika hasil perhitungan sedikit berbeda dengan jadwal resmi.
3. Untuk hasil yang **identik dengan Kemenag**, gunakan metode cache dan set semua offset ke **0**.
4. File cache bersifat tahunan. Ganti file `.bin` setiap tahun (contoh: `2026.bin`, `2027.bin`, dst).
5. Path cache harus tepat: `fs/cache/YYYY.bin` (YYYY = tahun).

---

**Dokumentasi ini menjelaskan Location Provider dan Prayer Time Provider beserta cara kerja, konfigurasi, dan metode cache Kemenag.**
