# Template Waktu (Time)

Fungsi `time(format)` menampilkan tanggal dan waktu saat ini dari **Time Provider**. Ekspresi ditulis di dalam tag template, sedangkan teks di luar tag ditampilkan apa adanya. Contoh pada halaman ini menggunakan nama hari dan bulan dalam bahasa Inggris.

## Sintaks

```text
{{time(format)}}
```

## Token Format

| Token | Arti | Keterangan |
|-------|------|------------|
| `y` | Tahun | Angka, lebar mengikuti jumlah huruf |
| `M` | Bulan | 1–2 huruf = angka, 3 huruf = nama singkat, 4+ huruf = nama penuh |
| `d` | Tanggal | Angka (1–31) |
| `E` | Nama hari | 1–3 huruf = singkat, 4+ huruf = penuh |
| `h` / `H` | Jam | Format 24 jam (0–23) |
| `m` | Menit | Angka (0–59) |
| `s` | Detik | Angka (0–59) |
| `D` | Hari ke-N | Hari dalam tahun (1–366) |
| `w` | Minggu ke-N | Minggu dalam tahun menurut ISO (1–53) |
| `f` | Hari dalam minggu | 1 = Senin, 2 = Selasa, ..., 7 = Minggu |

## Aturan Penulisan

1. **Jumlah huruf = lebar minimum angka.** Angka yang lebih panjang tidak pernah dipotong.
   - `h` menghasilkan `4`, sedangkan `hh` menghasilkan `04`.
   - `yyyy` menghasilkan `2026`, sedangkan `yyyyy` menghasilkan `02026`.
2. **Token `M`** memiliki perilaku khusus:
   - `M` = angka tanpa nol di depan (`9`)
   - `MM` = angka dengan nol di depan (`09`)
   - `MMM` = nama bulan singkat (`Sep`)
   - `MMMM` = nama bulan penuh (`September`)
3. **Token `E`** memiliki perilaku khusus:
   - `E`, `EE`, atau `EEE` = nama hari singkat (`Sun`)
   - `EEEE` dan seterusnya = nama hari penuh (`Sunday`)
4. **Karakter selain huruf ditampilkan sebagai teks biasa**, misalnya `:`, `/`, `-`, spasi, dan titik.
5. **Tanda `+` di dalam format berfungsi sebagai penyambung teks**, bukan penjumlahan.
6. Nama hari dan bulan mengikuti pengaturan `language` pada Time Provider (`id` atau `en`).

## Contoh Waktu

Jam dan menit dengan nol di depan:

```text
{{time(hh:mm)}}
```

Hasil: `18:04`

Jam dan menit tanpa nol di depan:

```text
{{time(h:m)}}
```

Hasil: `18:4`

Lebar 4 digit:

```text
{{time(hhhh:mmmm)}}
```

Hasil: `0018:0004`

## Contoh Tanggal

Tanggal, bulan singkat, dan tahun penuh:

```text
{{time(d MMM yyyy)}}
```

Hasil: `24 Sep 2026`

Tanggal/bulan/tahun dalam bentuk angka:

```text
{{time(dd/MM/yyyy)}}
```

Hasil: `24/09/2026`

Bulan angka tanpa nol di depan:

```text
{{time(d/M/y)}}
```

Hasil: `24/9/2026`

## Contoh Nama Hari dan Bulan

Nama hari penuh:

```text
{{time(EEEE)}}
```

Hasil: `Sunday`

Nama hari singkat:

```text
{{time(EEE)}}
```

Hasil: `Sun`

Nama bulan penuh:

```text
{{time(MMMM)}}
```

Hasil: `September`

Nama bulan singkat:

```text
{{time(MMM)}}
```

Hasil: `Sep`

## Contoh Nilai Numerik

Hari dalam tahun:

```text
{{time(D)}}
```

Hasil: `270`

Minggu dalam tahun:

```text
{{time(w)}}
```

Hasil: `39`

Minggu dalam tahun dengan lebar 4 digit:

```text
{{time(wwww)}}
```

Hasil: `0039`

Hari dalam minggu (1 = Senin, 7 = Minggu):

```text
{{time(f)}}
```

Hasil: `7`

## Catatan

- Time Provider harus dalam keadaan siap. Jika data waktu belum tersedia, tag ditampilkan apa adanya.
- Contoh di atas adalah ilustrasi format. Nilai sebenarnya mengikuti waktu perangkat.
- Operasi matematika menggunakan nilai dari `time()` dijelaskan pada [Template Matematika](./math-template).
- Lihat juga [Template Kondisional](./conditional-template).
