# Template Lokasi (Location)

Fungsi `loc(field)` menampilkan data koordinat dari **Location Provider**. Nilai yang dihasilkan berupa angka, sehingga bisa langsung digunakan dalam operasi matematika.

## Sintaks

```text
{{loc(field)}}
```

## Field yang Tersedia

| Field | Arti | Contoh Nilai |
|-------|------|--------------|
| `lat` | Latitude / lintang | `-8.1234` |
| `lon` | Longitude / bujur | `111.1234` |
| `alt` | Altitude / ketinggian | `10` |

Nama field harus ditulis dengan huruf kecil.

## Aturan Nilai

1. Semua nilai `loc()` dibulatkan hingga **4 angka di belakang desimal**.
2. Karena berupa angka, nilai `loc()` dapat dijumlahkan, dikurangi, dikalikan, atau dibagi dengan operator matematika di luar tag fungsi.
3. Nama field yang tidak dikenal membuat tag ditampilkan apa adanya.

## Contoh

Latitude:

```text
{{loc(lat)}}
```

Hasil: `-8.1234`

Longitude:

```text
{{loc(lon)}}
```

Hasil: `111.1234`

Altitude:

```text
{{loc(alt)}}
```

Hasil: `10`

Penjumlahan latitude:

```text
{{loc(lat)+2}}
```

Hasil: `-6.1234`

Pengurangan longitude:

```text
{{loc(lon)-1.1234}}
```

Hasil: `110`

## Catatan

- Location Provider harus dalam keadaan siap. Jika data lokasi belum tersedia, tag ditampilkan apa adanya.
- Pembulatan 4 desimal berlaku untuk semua field lokasi.
- Lihat juga [Template Matematika](./math-template) dan [Template Kondisional](./conditional-template).
