# Dokumentasi Hardware – Komponen Pendukung

Dokumentasi ini menjelaskan komponen hardware yang dibutuhkan selain MCU (ESP32).  
Sistem mendukung beberapa modul opsional dan satu komponen wajib (LED Matrix Panel).

---

## 1. MCU (Mikrokontroler)

Sistem menggunakan salah satu dari board berikut:

| Board              | Keterangan                          |
|--------------------|-------------------------------------|
| ESP32 Classic      | ESP32 biasa (WROOM / WROVER)       |
| ESP32-S3           | ESP32-S3 standar                    |
| ESP32-S3 N16R8     | ESP32-S3 dengan 16MB Flash + 8MB PSRAM |

MCU berfungsi sebagai pusat kontrol untuk mengendalikan semua modul pendukung.

---

## 2. LED Matrix Panel (Wajib)

Komponen **wajib** yang harus ada.

### Tipe Panel yang Didukung
- **P10 RGB**
- **P5 RGB**
- **P2.5 RGB**

### Syarat Scan Rate
Panel **harus** menggunakan salah satu dari:
- **2 Scan** (1/2 scan)
- **4 Scan** (1/4 scan)

> **Catatan:**  
> Panel dengan scan rate lain (misalnya 1/8, 1/16, atau 1/32) **tidak didukung**.

### Keterangan
LED Matrix Panel digunakan untuk menampilkan teks, animasi, dan informasi visual.  
Pastikan panel menggunakan antarmuka **HUB75** (standar yang umum digunakan dengan ESP32).

---

## 3. DFPlayer Mini (Opsional)

Modul pemutar audio berbasis microSD.

### Fungsi
- Memutar file audio (MP3/WAV) dari kartu microSD
- Digunakan untuk pengumuman suara, alarm, atau efek suara

### Keterangan
- Modul ini bersifat **opsional**
- Jika tidak dipasang, sistem tetap berjalan normal (tanpa fitur audio)
- Membutuhkan kartu microSD yang sudah berisi file audio

---

## 4. RTC – Real Time Clock (Opsional)

Modul jam real-time (contoh: DS3231 atau DS1307).

### Fungsi
- Menyimpan dan menyediakan waktu yang akurat
- Berguna untuk penjadwalan, timestamp, atau tampilan jam pada panel

### Keterangan
- Modul ini bersifat **opsional**
- Jika tidak dipasang, sistem dapat menggunakan waktu dari NTP (jika terhubung internet) atau tidak menampilkan waktu akurat
- Disarankan menggunakan DS3231 karena lebih akurat dan stabil

---

## 5. Passive Buzzer (Opsional)

Buzzer pasif yang digunakan untuk menghasilkan suara / melodi.

### Mengapa harus Passive Buzzer?
- **Passive Buzzer** membutuhkan sinyal frekuensi (PWM/tone) dari mikrokontroler untuk menghasilkan suara.
- Karena sistem memiliki **melodi** (bukan sekadar bip tunggal), maka **wajib menggunakan Passive Buzzer**.
- **Active Buzzer** hanya bisa menghasilkan satu frekuensi tetap saat diberi tegangan, sehingga **tidak cocok** untuk memainkan melodi.

### Fungsi
- Memainkan melodi / nada
- Memberikan notifikasi suara (alarm, konfirmasi, dll)

### Keterangan
- Modul ini bersifat **opsional**
- Jika tidak dipasang, sistem tetap berjalan normal (tanpa suara buzzer)

---

## 6. Power Supply

Catu daya yang stabil sangat penting agar semua komponen bekerja dengan baik.

### Rekomendasi
| Komponen              | Tegangan | Arus (perkiraan)      | Keterangan                          |
|-----------------------|----------|-----------------------|-------------------------------------|
| ESP32                 | 5V       | 500 mA – 1A           | Via USB atau pin 5V                 |
| LED Matrix Panel      | 5V       | Tergantung ukuran     | Bisa sangat tinggi (beberapa Ampere)|
| DFPlayer Mini         | 5V       | ~100–200 mA           | -                                   |
| RTC                   | 3.3V/5V  | Sangat kecil          | -                                   |
| Passive Buzzer        | 3.3V/5V  | Sangat kecil          | -                                   |

### Saran Power Supply
- Gunakan power supply **5V** dengan arus yang mencukupi (minimal 2A, lebih baik 3A–5A atau lebih tergantung jumlah/ukuran panel).
- Untuk panel besar (P10/P5 ukuran besar), disarankan power supply terpisah khusus untuk panel LED agar tidak mengganggu stabilitas ESP32.
- Pastikan ground (GND) semua komponen terhubung bersama (common ground).

---

## Ringkasan Komponen

| No | Komponen              | Status     | Keterangan                              |
|----|-----------------------|------------|-----------------------------------------|
| 1  | ESP32 (Classic/S3)    | Wajib      | MCU utama                               |
| 2  | LED Matrix Panel      | **Wajib**  | P10 / P5 / P2.5 RGB (2 scan atau 4 scan)|
| 3  | DFPlayer Mini         | Opsional   | Pemutar audio dari microSD              |
| 4  | RTC (DS3231/DS1307)   | Opsional   | Jam real-time                           |
| 5  | Passive Buzzer        | Opsional   | Untuk melodi (bukan active buzzer)      |
| 6  | Power Supply 5V       | Wajib      | Arus sesuai kebutuhan panel             |

---

## Catatan Penting

1. **LED Matrix Panel** adalah satu-satunya komponen pendukung yang **wajib** ada.
2. Pastikan panel yang digunakan adalah **2 scan atau 4 scan**. Panel dengan scan rate lain tidak akan berfungsi.
3. Gunakan **Passive Buzzer** jika ingin fitur melodi. Active buzzer tidak bisa memainkan nada yang bervariasi.
4. Power supply harus stabil dan cukup arus, terutama untuk panel LED.
5. Semua modul opsional dapat dilepas tanpa mengganggu fungsi dasar sistem (tampil di panel LED).

---

**Dokumentasi Hardware ini dibuat untuk membantu pemilihan dan pemahaman komponen pendukung sistem.**
