# Template Kondisional (Conditional)

Fungsi `if(condition, nilai_benar, nilai_salah)` memilih salah satu nilai berdasarkan kondisi. Fungsi ini dapat digunakan di dalam fungsi lain dan dapat disarangkan dengan `if` lagi.

## Sintaks

```text
{{if(condition, nilai_benar, nilai_salah)}}
```

## Operator Perbandingan dan Logika

| Operator | Arti |
|----------|------|
| `==` | Sama dengan |
| `!=` | Tidak sama dengan |
| `<` | Lebih kecil |
| `>` | Lebih besar |
| `<=` | Lebih kecil atau sama dengan |
| `>=` | Lebih besar atau sama dengan |
| `&&` | DAN (kedua kondisi benar) |
| <code>&#124;&#124;</code> | ATAU (salah satu kondisi benar) |

Urutan prioritas: `||` paling rendah, lalu `&&`, lalu perbandingan, lalu operasi matematika, lalu tanda kurung.

## Nilai Benar dan Salah

- **Angka:** `0` bernilai salah, selain `0` bernilai benar.
- **Teks:** teks kosong bernilai salah. Teks `0` dan `false` juga bernilai salah.
- **Perbandingan:** menghasilkan `1` untuk benar dan `0` untuk salah.

## Aturan Penulisan

1. Gunakan tanda kutip untuk teks yang mengandung spasi, koma, atau operator.
2. Teks sederhana tanpa spasi boleh ditulis tanpa tanda kutip, misalnya `ganjil` dan `genap`.
3. Perbandingan teks bersifat **case-sensitive** (huruf besar dan kecil dibedakan).
4. Jika kedua nilai berupa angka, perbandingan dilakukan secara numerik. Jika salah satunya teks, perbandingan dilakukan sebagai teks.
5. Hanya cabang yang terpilih yang dievaluasi, sehingga `if` bersarang aman digunakan.
6. Nama hari dan bulan pada `time()` mengikuti pengaturan bahasa Time Provider.

## Contoh

Hari dalam minggu lebih besar dari 5:

```text
{{if(time(f)>5, "Weekend", "Weekday")}}
```

Hasil: `Weekend` (jika hari Sabtu atau Minggu)

Perbandingan angka yang salah:

```text
{{if(3==4, "Benar", "Salah")}}
```

Hasil: `Salah`

Perbandingan nama hari:

```text
{{if(time(EEEE)=="Sunday", "Yay liburan", "kerja")}}
```

Hasil: `Yay liburan` (jika bahasa Time Provider adalah `en`)

Perhitungan tanggal Hijriah:

```text
{{if(hijri(d)+6==30, "Yes", "No")}}
```

Hasil: `Yes` (jika tanggal Hijriah bernilai 24)

Operator ATAU:

```text
{{if(3||4>2, "true", "false")}}
```

Hasil: `true`

Modulo untuk bilangan ganjil:

```text
{{if(11%2==1, ganjil, genap)}}
```

Hasil: `ganjil`

Perhitungan dengan tanda kurung:

```text
{{if(4+(10*2)==25, 1, 0)}}
```

Hasil: `0`

Kondisional bersarang untuk sapaan berdasarkan jam:

```text
{{if(time(h) >= 5 && time(h) < 12, "Good Morning", if(time(h) >= 12 && time(h) < 17, "Good Afternoon", if(time(h) >= 17 && time(h) < 21, "Good Evening", "Good Night")))}}
```

Hasil: `Good Evening` (jika jam menunjukkan pukul 18)

## Catatan

- Kondisi harus menghasilkan angka atau teks yang dapat ditentukan benar/salahnya.
- Jika fungsi di dalam kondisi gagal dievaluasi, tag ditampilkan apa adanya.
- Teks hasil `if` dapat digunakan sebagai argumen fungsi lain, misalnya formatter teks.
- Lihat juga [Template Matematika](./math-template) dan [Template Formatter](./formatter-template).
