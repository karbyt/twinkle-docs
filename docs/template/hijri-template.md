# Template Tanggal Hijriah (Hijri)

Fungsi `hijri(format)` menampilkan tanggal Hijriah dari **Hijri Provider**. Aturan penulisan token angka dan nama sama dengan fungsi `time()`, tetapi hanya tersedia token tanggal.

## Sintaks

```text
{{hijri(format)}}
```

## Token Format

| Token | Arti | Keterangan |
|-------|------|------------|
| `y` | Tahun Hijriah | Angka, lebar mengikuti jumlah huruf |
| `M` | Bulan Hijriah | 1–2 huruf = angka, 3 huruf = nama singkat, 4+ huruf = nama penuh |
| `d` | Tanggal Hijriah | Angka (1–30) |

Token `E`, `h`, `m`, `s`, `D`, `w`, dan `f` tidak tersedia pada fungsi ini.

## Nama Bulan Hijriah

| No | Singkat (`MMM`) | Penuh (`MMMM`) |
|----|-----------------|----------------|
| 1 | `Muh` | `Muharram` |
| 2 | `Saf` | `Safar` |
| 3 | `Raw` | `Rabiul Awal` |
| 4 | `Rak` | `Rabiul Akhir` |
| 5 | `Jaw` | `Jumadil Awal` |
| 6 | `Jak` | `Jumadil Akhir` |
| 7 | `Raj` | `Rajab` |
| 8 | `Syb` | `Syakban` |
| 9 | `Ram` | `Ramadhan` |
| 10 | `Sya` | `Syawal` |
| 11 | `Zul` | `Zulkaidah` |
| 12 | `Zuh` | `Zulhijah` |

## Aturan Penulisan

1. **Jumlah huruf = lebar minimum angka.** Angka yang lebih panjang tidak dipotong.
   - `d` = `4`, `dd` = `04`
   - `y` = `1448`, `yyyy` = `1448`, `yyyyy` = `01448`
2. **Token `M`** memiliki perilaku khusus:
   - `M` = angka tanpa nol di depan (`1`)
   - `MM` = angka dengan nol di depan (`01`)
   - `MMM` = nama bulan singkat (`Muh`)
   - `MMMM` = nama bulan penuh (`Muharram`)
3. **Karakter selain huruf ditampilkan sebagai teks biasa**, misalnya `/`, `-`, spasi, dan huruf `H` di luar tag.
4. **Tanda `+` di dalam format berfungsi sebagai penyambung teks**, bukan penjumlahan.

## Contoh

Tanggal, bulan singkat, tahun, dan akhiran H:

```text
{{hijri(dd MMM yyyy)}}H
```

Hasil: `24 Muh 1448H`

Tanggal/bulan/tahun tanpa nol di depan:

```text
{{hijri(d/M/y)}}
```

Hasil: `24/1/1448`

Tanggal/bulan/tahun dengan nol di depan:

```text
{{hijri(dd-MM-yy)}}
```

Hasil: `24-01-1448`

Bulan penuh dan tahun dengan lebar 5 digit:

```text
{{hijri(dd MMMM yyyyy)}}
```

Hasil: `24 Muharram 01448`

Bulan singkat saja:

```text
{{hijri(MMM)}}
```

Hasil: `Muh`

Bulan sebagai angka:

```text
{{hijri(MM)}}
```

Hasil: `01`

## Catatan

- Hijri Provider harus dalam keadaan siap. Jika data Hijriah belum tersedia, tag ditampilkan apa adanya.
- `yy` bukan “dua digit terakhir”. Token `yy` berarti lebar minimum 2, sehingga tahun `1448` tetap ditampilkan `1448`. Gunakan `yyyyy` untuk padding menjadi `01448`.
- Tanggal Hijriah dihitung oleh Hijri Provider. Nilainya dapat dipengaruhi oleh konfigurasi offset hari pada provider tersebut.
- Lihat juga [Template Waktu](./time-template), [Template Matematika](./math-template), dan [Template Kondisional](./conditional-template).
