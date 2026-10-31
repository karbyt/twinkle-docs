# Location Provider

Location Provider menyediakan data koordinat geografis yang digunakan sebagai dasar perhitungan waktu sholat.

### Konfigurasi

| Parameter     | Tipe     | Keterangan                          | Contoh Nilai     |
|---------------|----------|-------------------------------------|------------------|
| `latitude`    | Number   | Lintang lokasi (derajat)            | `-6.2088`        |
| `longitude`   | Number   | Bujur lokasi (derajat)              | `106.8456`       |
| `altitude`    | Number   | Ketinggian lokasi (meter)           | `10`             |

### Data yang Dihasilkan

| Field         | Tipe     | Keterangan                          |
|---------------|----------|-------------------------------------|
| `isReady`     | Boolean  | `true` jika data lokasi sudah siap  |
| `isActive`    | Boolean  | `true` jika Location Provider aktif |
| `latitude`    | Number   | Nilai latitude yang digunakan       |
| `longitude`   | Number   | Nilai longitude yang digunakan      |
| `altitude`    | Number   | Nilai altitude yang digunakan       |

### Contoh Konfigurasi

```json
{
  "latitude": -6.2088,
  "longitude": 106.8456,
  "altitude": 10
}
```
