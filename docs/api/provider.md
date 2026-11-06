# Provider API

Providers supply data used by scenes and templates. Each provider has metadata, live data
(`state`), persisted configuration (`config`), and a schema.

Providers are read-only through `get`; configuration is updated with `set` on
`provider.N.config`. There are no provider commands.

## Provider IDs

| ID | Name | Depends on |
|----|------|------------|
| 0  | Time | — |
| 1  | PrayerTime | Time, Location |
| 2  | Hijri | Time |
| 3  | Location | — |
| 4  | Moon Phase | Time, Location |

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `provider` | List provider metadata. |
| `get`  | `provider.N` | Metadata for one provider. |
| `get`  | `provider.N.state` | Live provider data. |
| `get`  | `provider.N.config` | Persisted configuration. |
| `set`  | `provider.N.config` | Patch the persisted configuration. |
| `get`  | `provider.N.schema` | Field/type map for the configuration. |

`cmd`, `add`, and `del` are not supported and return `unknown command path`. A `set` on
`provider`, `provider.N`, `provider.N.state`, or `provider.N.schema` returns
`method not allowed`.

### `GET provider`

```json
{
  "id": 1,
  "path": "provider",
  "data": [
    {
      "id": 0,
      "name": "Time",
      "updateInterval": 3600000,
      "isActive": true,
      "isReady": true
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Provider ID. |
| `name` | string | Provider name. |
| `updateInterval` | integer | Refresh interval in milliseconds. |
| `isActive` | boolean | Whether the provider is enabled. |
| `isReady` | boolean | Whether the provider currently has valid data. |

### `GET provider.N`

Returns the same object as one element of the list.

### `GET provider.N.state`

Returns the provider's data object. `isActive` and `isReady` are always read live from the
provider, so they remain correct even when the cached data is stale.

```json
{
  "id": 2,
  "path": "provider.0.state",
  "data": {
    "isReady": true,
    "isActive": true,
    "year": 2026,
    "month": 11,
    "day": 6,
    "hour": 12,
    "minute": 30,
    "second": 0,
    "dow": 5,
    "dowShortName": "Jum",
    "dowLongName": "Jumat",
    "monthShortName": "Nov",
    "monthLongName": "November"
  }
}
```

### `GET provider.N.config`

Returns the persisted configuration.

### `SET provider.N.config`

Patches the configuration. Only the supplied keys change. The provider validates, clamps,
persists to flash, and immediately requests a refresh of dependent providers. The reply
echoes the submitted values.

```json
{
  "id": 3,
  "method": "set",
  "path": "provider.3.config",
  "data": { "latitude": -6.2, "longitude": 106.8166 }
}
```

Errors: `missing data`, `config rejected`.

> `updateInterval` below `1000` is clamped to `1000` ms rather than rejected.

### `GET provider.N.schema`

Returns a field/type map. See the [schema type vocabulary](./#schema-type-vocabulary).

## Provider 0 — Time

### Config

```json
{
  "isActive": true,
  "updateInterval": 3600000,
  "ntpServer1": "pool.ntp.org",
  "ntpServer2": "id.pool.ntp.org",
  "utcOffsetSec": 25200,
  "language": "Indonesia"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | boolean | Enable the provider. |
| `updateInterval` | uint32 | Refresh interval in milliseconds (minimum `1000`). |
| `ntpServer1` | char64 | Primary NTP server. An empty value falls back to `pool.ntp.org`. |
| `ntpServer2` | char64 | Secondary NTP server. |
| `utcOffsetSec` | int32 | UTC offset in seconds. `25200` = UTC+7. |
| `language` | string | `Indonesia` or `English`. Also accepts `0`/`1`. |

### Schema

```json
{
  "isActive": "bool",
  "updateInterval": "uint32",
  "ntpServer1": "char64",
  "ntpServer2": "char64",
  "utcOffsetSec": "int32",
  "language": ["Indonesia", "English"]
}
```

### State

```json
{
  "isReady": true,
  "isActive": true,
  "year": 2026,
  "month": 11,
  "day": 6,
  "hour": 12,
  "minute": 30,
  "second": 15,
  "dow": 5,
  "dowShortName": "Jum",
  "dowLongName": "Jumat",
  "monthShortName": "Nov",
  "monthLongName": "November"
}
```

`dow` is `0` = Sunday through `6` = Saturday. Day and month names follow the configured
`language`.

## Provider 1 — PrayerTime

Prayer times are derived from the Location provider and the Time provider's UTC offset.
Times in `state` are minutes from midnight.

### Config

```json
{
  "isActive": true,
  "updateInterval": 3600000,
  "imsakOffset": 0,
  "subuhOffset": 0,
  "terbitOffset": 0,
  "duhaOffset": 0,
  "zuhurOffset": 0,
  "asarOffset": 0,
  "magribOffset": 0,
  "isyaOffset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | boolean | Enable the provider. |
| `updateInterval` | uint32 | Refresh interval in milliseconds (minimum `1000`). |
| `imsakOffset` | int8 | Minute offset for Imsak. |
| `subuhOffset` | int8 | Minute offset for Subuh. |
| `terbitOffset` | int8 | Minute offset for Terbit. |
| `duhaOffset` | int8 | Minute offset for Duha. |
| `zuhurOffset` | int8 | Minute offset for Zuhur. |
| `asarOffset` | int8 | Minute offset for Asar. |
| `magribOffset` | int8 | Minute offset for Magrib. |
| `isyaOffset` | int8 | Minute offset for Isya. |

### Schema

```json
{
  "isActive": "bool",
  "updateInterval": "uint32",
  "imsakOffset": "int8",
  "subuhOffset": "int8",
  "terbitOffset": "int8",
  "duhaOffset": "int8",
  "zuhurOffset": "int8",
  "asarOffset": "int8",
  "magribOffset": "int8",
  "isyaOffset": "int8"
}
```

### State

```json
{
  "isReady": true,
  "isActive": true,
  "imsak": 265,
  "subuh": 275,
  "terbit": 305,
  "duha": 325,
  "zuhur": 450,
  "asar": 585,
  "magrib": 665,
  "isya": 685
}
```

Changing Location configuration also triggers an immediate PrayerTime refresh.

## Provider 2 — Hijri

### Config

```json
{
  "isActive": true,
  "updateInterval": 360000,
  "dayOffset": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | boolean | Enable the provider. |
| `updateInterval` | uint32 | Refresh interval in milliseconds (minimum `1000`). |
| `dayOffset` | int8 | Manual correction in days. |

### Schema

```json
{
  "isActive": "bool",
  "updateInterval": "uint32",
  "dayOffset": "int8"
}
```

### State

```json
{
  "isReady": true,
  "isActive": true,
  "day": 24,
  "month": 5,
  "year": 1448,
  "monthName": "Jumadil Awal"
}
```

Month names are `Muharram`, `Safar`, `Rabiul Awal`, `Rabiul Akhir`, `Jumadil Awal`,
`Jumadil Akhir`, `Rajab`, `Syakban`, `Ramadhan`, `Syawal`, `Zulkaidah`, `Zulhijah`.

## Provider 3 — Location

### Config

```json
{
  "isActive": true,
  "updateInterval": 86400000,
  "latitude": -6.170089,
  "longitude": 106.83105,
  "altitude": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | boolean | Enable the provider. |
| `updateInterval` | uint32 | Refresh interval in milliseconds (minimum `1000`). |
| `latitude` | float | Latitude, `-90` to `90`. |
| `longitude` | float | Longitude, `-180` to `180`. |
| `altitude` | float | Altitude in metres. |

`set` is rejected if latitude or longitude is out of range.

### Schema

```json
{
  "isActive": "bool",
  "updateInterval": "uint32",
  "latitude": "float",
  "longitude": "float",
  "altitude": "float"
}
```

### State

```json
{
  "isReady": true,
  "isActive": true,
  "latitude": -6.170089,
  "longitude": 106.83105,
  "altitude": 0
}
```

## Provider 4 — Moon Phase

### Config

```json
{
  "isActive": true,
  "updateInterval": 3600000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `isActive` | boolean | Enable the provider. |
| `updateInterval` | uint32 | Refresh interval in milliseconds (minimum `1000`). |

### Schema

```json
{
  "isActive": "bool",
  "updateInterval": "uint32"
}
```

### State

```json
{
  "isReady": true,
  "isActive": true,
  "phaseIndex": 12,
  "phaseName": "Waxing Gibbous"
}
```

`phaseIndex` is `0`–`29`. `phaseName` is one of New Moon, Waxing Crescent, First Quarter,
Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent.
