# Template Waktu Sholat (Prayer Time)

Fungsi `prayer(source, format)` menampilkan waktu sholat dari **Prayer Time Provider**. Aturan format jam dan menit sama dengan fungsi `time()`.

## Sintaks

```text
{{prayer(source, format)}}
```

## Sumber Waktu

| Source | Keterangan |
|--------|------------|
| `imsak` | Waktu Imsak |
| `subuh` | Waktu Subuh |
| `terbit` | Waktu Terbit |
| `duha` | Waktu Duha |
| `zuhur` | Waktu Zuhur |
| `asar` | Waktu Asar |
| `magrib` | Waktu Magrib |
| `isya` | Waktu Isya |

Nama source harus ditulis dengan huruf kecil.

## Token Format

| Token | Arti | Keterangan |
|-------|------|------------|
| `h` / `H` | Jam | Format 24 jam (0–23) |
| `m` | Menit | Angka (0–59) |

Ketentuan format:

1. Jumlah huruf menentukan lebar minimum angka. Contoh: `h` = `4`, `hh` = `04`, `hhhh` = `0004`.
2. Angka yang lebih panjang dari lebar token tidak dipotong.
3. Karakter selain huruf ditampilkan sebagai teks biasa, misalnya `:`, `/`, `-`, dan spasi.
4. Tanda `+` di dalam format berfungsi sebagai penyambung teks, bukan penjumlahan.
5. Token tanggal dan nama hari tidak tersedia pada fungsi ini.

## Contoh

Imsak dengan jam dan menit:

```text
{{prayer(imsak, hh:mm)}}
```

Hasil: `04:10`

Subuh tanpa nol di depan:

```text
{{prayer(subuh, h:m)}}
```

Hasil: `4:10`

Zuhur dengan lebar 4 digit:

```text
{{prayer(zuhur, hhhh:mmmm)}}
```

Hasil: `0004:0010`

Asar dengan pemisah teks:

```text
{{prayer(asar, hh - mm)}}
```

Hasil: `04 - 10`

Magrib dengan pemisah garis miring:

```text
{{prayer(magrib, hh/mm)}}
```

Hasil: `04/10`

Isya dengan pemisah tanda hubung:

```text
{{prayer(isya, h-m)}}
```

Hasil: `4-10`

Terbit dengan format 24 jam:

```text
{{prayer(terbit, HH:mm)}}
```

Hasil: `06:00`

## Catatan

- Prayer Time Provider harus dalam keadaan siap. Jika data waktu sholat belum tersedia, tag ditampilkan apa adanya.
- Nama source yang tidak dikenal juga membuat tag ditampilkan apa adanya.
- Untuk menghitung selisih atau penjumlahan menit, gunakan ekspresi matematika di luar fungsi.
- Lihat juga [Template Waktu](./time-template) dan [Template Matematika](./math-template).
