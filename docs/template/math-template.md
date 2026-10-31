# Template Matematika (Math)

Semua tag template dapat berisi operasi matematika. Operator `+`, `-`, `*`, `/`, dan `%` di dalam tag dihitung sebagai operasi angka, bukan ditampilkan sebagai teks.

## Operator

| Operator | Arti | Contoh |
|----------|------|--------|
| `+` | Penjumlahan | `10 + 5` = `15` |
| `-` | Pengurangan | `10 - 5` = `5` |
| `*` | Perkalian | `10 * 5` = `50` |
| `/` | Pembagian | `10 / 5` = `2` |
| `%` | Sisa bagi (modulo) | `10 % 3` = `1` |
| `( )` | Pengelompokan | `(10 + 2) * 5` = `60` |
| `-` | Negasi angka | `-5 + 2` = `-3` |

## Urutan Perhitungan

Operasi dihitung berdasarkan prioritas berikut, dari yang paling tinggi:

1. Tanda kurung `( )`
2. Negasi `-`
3. Perkalian, pembagian, dan modulo `* / %`
4. Penjumlahan dan pengurangan `+ -`
5. Perbandingan `< > <= >= == !=`
6. Logika DAN `&&`
7. Logika ATAU `||`

## Aturan Angka dan Teks

1. Angka bulat dan desimal didukung, misalnya `1.5` dan `2.25`.
2. Hasil pembagian dapat berupa desimal. Contoh: `10 / 4` menghasilkan `2.5`.
3. Pembagian atau modulo dengan nol membuat tag gagal dievaluasi, sehingga tag ditampilkan apa adanya.
4. Jika salah satu operand bukan angka, nilai digabung sebagai teks tanpa menampilkan operator.
5. Hasil berupa bilangan bulat ditampilkan tanpa `.0`. Contoh: `2.0` ditampilkan sebagai `2`.

## Perbedaan `+` di Dalam dan di Luar Fungsi

Tanda `+` di **dalam format fungsi** seperti `time()` dan `hijri()` berfungsi sebagai penyambung teks dan dibuang dari hasil. Tanda `+` di **luar fungsi** berfungsi sebagai operator matematika.

Nilai hari dalam minggu ditambah 4:

```text
{{time(f)+4}}
```

Hasil: `11` (jika `f` bernilai `7`, maka `7 + 4 = 11`)

Angka 4 ditulis sebagai teks di dalam format `time()`:

```text
{{time(f+4)}}
```

Hasil: `74` (nilai `7` disambung dengan teks `4`)

Tanda `+` di dalam format Hijriah juga menyambung teks:

```text
{{hijri(MMMM+3)}}
```

Hasil: `Muharram3`

Tanda `+` di luar fungsi menggabungkan teks dengan angka:

```text
{{hijri(MMMM)+3}}
```

Hasil: `Muharram3`

## Contoh Lain

Perkalian:

```text
{{20*5}}
```

Hasil: `100`

Modulo:

```text
{{10%3}}
```

Hasil: `1`

Kurung dan penjumlahan:

```text
{{(10*2)+4}}
```

Hasil: `24`

Pembagian desimal:

```text
{{10/4}}
```

Hasil: `2.5`

Negasi:

```text
{{-5+2}}
```

Hasil: `-3`

## Catatan

- Operasi matematika dapat digabungkan dengan fungsi apa pun yang menghasilkan angka, seperti `time()`, `hijri()`, `loc()`, dan `moon()`.
- Gunakan tanda kurung untuk memperjelas urutan perhitungan.
- Lihat juga [Template Kondisional](./conditional-template).
