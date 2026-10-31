# Dokumentasi Time Provider

Time Provider adalah modul software yang menyediakan waktu sistem secara akurat.  
Modul ini menggabungkan **NTP (Network Time Protocol)** dan **RTC (Real Time Clock)** untuk menjaga waktu tetap presisi.

---

## Cara Kerja

1. Sistem mengambil waktu dari internet melalui **NTP Server**.
2. Waktu yang didapat dari NTP kemudian **disimpan ke RTC**.
3. Update dari NTP dilakukan secara berkala (default setiap **1 jam**).
4. Di antara interval update, sistem membaca waktu dari **RTC**.

### Mengapa harus online?
RTC memiliki sifat **drifting** (waktu bisa bergeser sedikit demi sedikit seiring waktu).  
Oleh karena itu, sistem **harus terhubung ke internet** secara berkala agar waktu tetap akurat melalui sinkronisasi NTP.

> **Ringkasan:**  
> NTP → update waktu setiap interval → simpan ke RTC → baca dari RTC di antara update.

---

## Konfigurasi

Berikut adalah parameter konfigurasi yang tersedia:

| Parameter              | Tipe     | Keterangan                                                                 | Contoh Nilai                  |
|------------------------|----------|----------------------------------------------------------------------------|-------------------------------|
| `updateInterval`       | Number   | Interval update waktu dari NTP ke RTC (dalam detik atau milidetik*)       | `3600` (1 jam)                |
| `ntpServer1`           | String   | Alamat NTP Server utama                                                    | `"pool.ntp.org"`              |
| `ntpServer2`           | String   | Alamat NTP Server cadangan                                                 | `"time.google.com"`           |
| `utcOffsetSecond`      | Number   | Offset zona waktu dalam detik terhadap UTC                                 | `25200` (UTC+7)               |
| `language`             | String   | Bahasa untuk nama hari dan bulan                                           | `"id"` / `"en"`               |

> *Catatan: Pastikan satuan `updateInterval` sesuai dengan implementasi (detik disarankan).

### Contoh Konfigurasi

```json
{
  "updateInterval": 3600,
  "ntpServer1": "pool.ntp.org",
  "ntpServer2": "time.google.com",
  "utcOffsetSecond": 25200,
  "language": "id"
}
```

### Keterangan Zona Waktu (utcOffsetSecond)

| Zona Waktu     | Offset (detik) |
|----------------|----------------|
| UTC+0          | 0              |
| UTC+7 (WIB)    | 25200          |
| UTC+8 (WITA)   | 28800          |
| UTC+9 (WIT)    | 32400          |

---

## Data yang Dihasilkan

Time Provider menghasilkan data waktu lengkap sebagai berikut:

| Field              | Tipe     | Keterangan                                      | Contoh                  |
|--------------------|----------|-------------------------------------------------|-------------------------|
| `isReady`          | Boolean  | `true` jika waktu sudah siap digunakan          | `true`                  |
| `isActive`         | Boolean  | `true` jika Time Provider sedang aktif          | `true`                  |
| `year`             | Number   | Tahun                                           | `2026`                  |
| `month`            | Number   | Bulan (1–12)                                    | `10`                    |
| `day`              | Number   | Tanggal (1–31)                                  | `31`                    |
| `hour`             | Number   | Jam (0–23)                                      | `11`                    |
| `minute`           | Number   | Menit (0–59)                                    | `2`                     |
| `second`           | Number   | Detik (0–59)                                    | `15`                    |
| `dow`              | Number   | Day of Week (0=Minggu, 1=Senin, ..., 6=Sabtu)  | `6`                     |
| `dowShortName`     | String   | Nama hari singkat sesuai bahasa                 | `"Sab"` / `"Sat"`       |
| `dowLongName`      | String   | Nama hari lengkap sesuai bahasa                 | `"Sabtu"` / `"Saturday"`|
| `monthShortName`   | String   | Nama bulan singkat sesuai bahasa                | `"Okt"` / `"Oct"`       |
| `monthLongName`    | String   | Nama bulan lengkap sesuai bahasa                | `"Oktober"` / `"October"`|

---

## Status Modul

| Status      | Keterangan                                                                 |
|-------------|----------------------------------------------------------------------------|
| `isReady`   | Menandakan apakah data waktu sudah valid dan siap dipakai aplikasi        |
| `isActive`  | Menandakan apakah Time Provider sedang berjalan / aktif                   |

---

## Alur Kerja Singkat

```
[Internet]
    │
    ▼
[NTP Server 1 / NTP Server 2]
    │
    ▼ (setiap updateInterval)
[Simpan ke RTC]
    │
    ▼
[Baca waktu dari RTC]
    │
    ▼
[Data waktu siap dipakai]
  → year, month, day, hour, minute, second
  → dow, dowShortName, dowLongName
  → monthShortName, monthLongName
```

---

## Catatan Penting

1. **Koneksi internet** diperlukan untuk sinkronisasi NTP. Tanpa internet, waktu hanya mengandalkan RTC yang bisa drifting.
2. Disarankan `updateInterval` di-set **3600 detik (1 jam)** agar RTC tetap akurat tanpa terlalu sering mengakses internet.
3. `utcOffsetSecond` harus disesuaikan dengan zona waktu lokasi.
4. Parameter `language` mempengaruhi nama hari dan bulan yang dihasilkan (`dowShortName`, `dowLongName`, `monthShortName`, `monthLongName`).
5. Jika RTC tidak terpasang, sistem tetap bisa berjalan hanya dengan NTP (waktu akan hilang saat restart jika tidak ada internet).

---

**Dokumentasi Time Provider ini menjelaskan konfigurasi, data yang dihasilkan, dan cara kerja modul waktu sistem.**
