# Template Formatter Teks (Format)

Fungsi `fmt(mode, text)` mengubah atau mengukur teks hasil evaluasi. Beberapa mode membutuhkan argumen ketiga berupa batas panjang.

## Sintaks

```text
{{fmt(mode, text)}}
```

Untuk mode yang membutuhkan batas panjang:

```text
{{fmt(mode, text, limit)}}
```

## Mode yang Tersedia

| Mode | Fungsi | Argumen Ketiga |
|------|--------|----------------|
| `up` | Mengubah semua huruf menjadi kapital | Tidak perlu |
| `low` | Mengubah semua huruf menjadi kecil | Tidak perlu |
| `cap` | Membuat huruf awal setiap kata kapital | Tidak perlu |
| `len` | Menghitung jumlah karakter | Tidak perlu |
| `ell` | Memotong teks lalu menambahkan `...` | Wajib |
| `cut` | Memotong teks tanpa menambahkan apa pun | Wajib |

## Aturan Penulisan

1. `text` dapat berupa teks langsung atau hasil fungsi lain, misalnya `time(EEEE)` dan `moon(nnnn)`.
2. `text` sebaiknya ditulis di dalam tanda kutip jika mengandung spasi.
3. `limit` pada mode `ell` dan `cut` harus berupa angka dan tidak boleh negatif.
4. Jika panjang teks tidak melebihi `limit`, teks dikembalikan tanpa perubahan.
5. Mode `cap` menganggap karakter selain huruf sebagai pemisah kata.
6. Hasil `fmt` berupa teks.

## Contoh

Mengubah menjadi huruf kapital:

```text
{{fmt(up, "hello")}}
```

Hasil: `HELLO`

Mengubah menjadi huruf kecil:

```text
{{fmt(low, "sOme tExT")}}
```

Hasil: `some text`

Membuat huruf awal kata kapital:

```text
{{fmt(cap, "sOme tExT")}}
```

Hasil: `Some Text`

Menghitung panjang teks:

```text
{{fmt(len, "sOme tExT")}}
```

Hasil: `9`

Memotong teks dan menambahkan elipsis:

```text
{{fmt(ell, "sOme tExT", 4)}}
```

Hasil: `sOme...`

Memotong teks tanpa elipsis:

```text
{{fmt(cut, "sOme tExT", 4)}}
```

Hasil: `sOme`

Mengubah hasil fungsi waktu menjadi kapital:

```text
{{fmt(up, time(EEEE))}}
```

Hasil: `SUNDAY`

Memotong nama fase bulan:

```text
{{fmt(cut, moon(nnnn), 6)}}
```

Hasil: `Waxing`

Teks yang lebih pendek dari batas tidak berubah:

```text
{{fmt(ell, "Hello", 10)}}
```

Hasil: `Hello`

## Catatan

- Mode yang tidak dikenal membuat tag ditampilkan apa adanya.
- Mode `ell` dan `cut` membutuhkan argumen ketiga. Tanpa argumen tersebut, tag ditampilkan apa adanya.
- Pemotongan dihitung berdasarkan jumlah karakter, bukan jumlah kata.
- Lihat juga [Template Fase Bulan](./moonphase-template) dan [Template Waktu](./time-template).
