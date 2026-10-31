# Flashing board lewat WEB FLAHSER

Dokumentasi ini menjelaskan cara melakukan flashing firmware ESP32 melalui **Web Flasher**.  
User hanya perlu memilih board yang digunakan, lalu klik tombol **Flash**.

---

## Board yang Didukung

Web Flasher ini mendukung 3 jenis board:

| No | Board                  | Keterangan                          |
|----|------------------------|-------------------------------------|
| 1  | **ESP32 Classic**      | ESP32 biasa (WROOM / WROVER)       |
| 2  | **ESP32-S3**           | ESP32-S3 standar                    |
| 3  | **ESP32-S3 N16R8**     | ESP32-S3 dengan 16MB Flash + 8MB PSRAM |

---

## Persyaratan

Sebelum memulai, pastikan:

1. **Browser yang didukung**
   - Google Chrome (direkomendasikan)
   - Microsoft Edge
   - Opera  
   *(Firefox dan Safari belum mendukung Web Serial API)*

2. **Kabel USB data** (bukan kabel charge-only)

3. **Driver USB** sudah terinstall (jika diperlukan):
   - ESP32 Classic → biasanya menggunakan CP2102 / CH340
   - ESP32-S3 → biasanya menggunakan USB native (CDC) atau CP2102

4. Board dalam keadaan **siap di-flash** (tombol BOOT bisa ditekan jika diperlukan)

---

## Cara Menggunakan Web Flasher

### Langkah 1: Buka Web Flasher
Buka halaman Web Flasher di browser Chrome/Edge.

### Langkah 2: Pilih Board
Pada dropdown **Select Board**, pilih salah satu:
- `ESP32 Classic`
- `ESP32-S3`
- `ESP32-S3 N16R8`

### Langkah 3: Hubungkan Board
1. Sambungkan board ke komputer menggunakan kabel USB.
2. Klik tombol **Connect**.
3. Browser akan menampilkan daftar port serial. Pilih port yang sesuai dengan board Anda.
4. Setelah terhubung, status akan berubah menjadi **Connected**.

### Langkah 4: Flash Firmware
1. Pastikan board sudah terpilih dan terhubung.
2. Klik tombol **Flash**.
3. Proses flashing akan berjalan otomatis (erase → write → verify).
4. Tunggu hingga muncul notifikasi **Flash Success** / **Done**.

### Langkah 5: Selesai
Setelah berhasil, board akan otomatis reboot (atau tekan tombol RESET jika diperlukan).  
Firmware sudah siap digunakan.

---

## Tips & Troubleshooting

| Masalah                        | Solusi                                                                 |
|--------------------------------|------------------------------------------------------------------------|
| Port tidak muncul              | Ganti kabel USB, coba port USB lain, atau install driver CH340/CP210x |
| Gagal connect                  | Tekan dan tahan tombol **BOOT**, lalu klik Connect, lepaskan BOOT     |
| Flash gagal / error            | Pastikan board yang dipilih sudah benar, coba tekan BOOT saat flash   |
| Board ESP32-S3 tidak terdeteksi| Gunakan mode USB-CDC atau pastikan driver sudah terinstall            |
| Browser tidak support          | Gunakan Chrome atau Edge versi terbaru                                |

---

## Catatan Penting

- Pastikan memilih **board yang sesuai**. Salah pilih board dapat menyebabkan gagal flash atau firmware tidak berjalan.
- Proses flash akan **menghapus data** yang ada di flash memory.
- Jangan cabut kabel USB selama proses flashing berlangsung.
- Untuk ESP32-S3 N16R8, pastikan firmware yang di-flash memang dikompilasi untuk board dengan 16MB Flash + 8MB PSRAM.

---

## Alur Singkat (Quick Guide)

```
1. Buka Web Flasher
2. Pilih Board (ESP32 Classic / ESP32-S3 / ESP32-S3 N16R8)
3. Klik Connect → pilih port serial
4. Klik Flash
5. Tunggu sampai selesai
```

---

**Dokumentasi ini dibuat untuk memudahkan proses flashing firmware ESP32 melalui Web Flasher.**  
Jika mengalami kendala, pastikan semua persyaratan sudah terpenuhi dan coba ulang langkah-langkah di atas.
