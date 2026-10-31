# Template Fase Bulan (Moon Phase)

Fungsi `moon(format)` menampilkan indeks dan nama fase bulan dari **MoonPhase Provider**.

## Sintaks

```text
{{moon(format)}}
```

## Token Format

| Token | Arti | Keterangan |
|-------|------|------------|
| `n` | Indeks fase bulan | Angka 0–29 |
| `nn` | Indeks fase bulan | Angka 0–29 dengan lebar 2 digit |
| `nnn` | Nama fase singkat | Contoh: `W. Cres` |
| `nnnn` | Nama fase penuh | Contoh: `Waxing Crescent` |

Aturan:

1. `n` dan `nn` menghasilkan angka. `nn` menambahkan nol di depan jika nilainya satu digit.
2. `nnn` menghasilkan nama singkat.
3. `nnnn` dan seterusnya menghasilkan nama penuh.
4. Karakter selain huruf ditampilkan sebagai teks biasa.

## Pembagian Fase

| Indeks | Nama Penuh (`nnnn`) | Nama Singkat (`nnn`) |
|--------|---------------------|----------------------|
| 0–3 | `New Moon` | `N. Moon` |
| 4–7 | `Waxing Crescent` | `W. Cres` |
| 8–10 | `First Quarter` | `F. Quarter` |
| 11–14 | `Waxing Gibbous` | `W. Gibbous` |
| 15–18 | `Full Moon` | `Full Moon` |
| 19–21 | `Waning Gibbous` | `Wan. Gibbous` |
| 22–25 | `Last Quarter` | `L. Quarter` |
| 26–29 | `Waning Crescent` | `Wan. Cres` |

## Contoh

Indeks fase:

```text
{{moon(n)}}
```

Hasil: `5`

Indeks fase dengan lebar 2 digit:

```text
{{moon(nn)}}
```

Hasil: `05`

Nama fase singkat:

```text
{{moon(nnn)}}
```

Hasil: `W. Cres`

Nama fase penuh:

```text
{{moon(nnnn)}}
```

Hasil: `Waxing Crescent`

## Catatan

- MoonPhase Provider harus dalam keadaan siap. Jika data fase bulan belum tersedia, tag ditampilkan apa adanya.
- Indeks fase berada pada rentang 0–29 dan ditentukan oleh provider, bukan oleh template.
- Nama fase selalu menggunakan bahasa Inggris.
- Lihat juga [Template Formatter](./formatter-template) dan [Template Matematika](./math-template).
