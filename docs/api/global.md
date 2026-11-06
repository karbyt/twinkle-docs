# Global API

The `global` controller exposes device information, global configuration, live display
state, license activation, and reboot.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `global` | Device information and runtime statistics. |
| `get`  | `global.config` | Global configuration. |
| `get`  | `global.schema` | Field/type map for the configuration. |
| `get`  | `global.state` | Display and active-scene state. |
| `set`  | `global.config` | Patch the global configuration and restart. |
| `set`  | `global.state` | Change display brightness. |
| `set`  | `global` | Activate a license key. |
| `del`  | `global` | Deactivate the license. |
| `cmd`  | `global` | Reboot the device. |

## `GET global`

```json
{
  "id": 1,
  "path": "global",
  "data": {
    "chipModel": "ESP32-S3",
    "chipCores": 2,
    "cpuFreqMHz": 240,
    "freeHeap": 180000,
    "totalHeap": 320000,
    "freePsram": 7000000,
    "totalPsram": 8388608,
    "totalFS": 1048576,
    "freeFS": 900000,
    "uptime": 3600,
    "wifiSSID": "MyWiFi",
    "wifiIP": "192.168.1.50",
    "wifiRSSI": -52,
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "firmwareVersion": "v1.0.0",
    "deviceName": "Twinkle",
    "hwid": "0123456789ABCDEF",
    "premium": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `chipModel` | string | SoC model. |
| `chipCores` | integer | CPU core count. |
| `cpuFreqMHz` | integer | CPU frequency in MHz. |
| `freeHeap` / `totalHeap` | integer | Internal RAM in bytes. |
| `freePsram` / `totalPsram` | integer | PSRAM in bytes. |
| `totalFS` / `freeFS` | integer | LittleFS capacity and free space in bytes. |
| `uptime` | integer | Uptime in seconds. |
| `wifiSSID` | string | Active Wi-Fi SSID (station or AP). |
| `wifiIP` | string | Device IP address. |
| `wifiRSSI` | integer | Signal strength; `0` in AP mode. |
| `macAddress` | string | Wi-Fi MAC address. |
| `firmwareVersion` | string | Firmware version string. |
| `deviceName` | string | Device name. |
| `hwid` | string | Hardware identifier used for licensing. |
| `premium` | boolean | Whether a premium license is active. |

`GET global.<other>` returns `unknown path`.

## `GET global.config`

```json
{
  "id": 2,
  "path": "global.config",
  "data": {
    "wifiSSID": "MyWiFi",
    "wifiPassword": "secret",
    "apSSID": "Twinkle-AP",
    "apPassword": "12345678",
    "displayWidth": 64,
    "displayHeight": 32,
    "numRows": 1,
    "numCols": 1,
    "autoSleep": false,
    "sleepAt": 1380,
    "wakeAt": 300,
    "r1": 1,
    "g1": 2,
    "b1": 3,
    "r2": 4,
    "g2": 5,
    "b2": 6,
    "a": 7,
    "b": 8,
    "c": 9,
    "d": 10,
    "e": 11,
    "lat": 12,
    "oe": 13,
    "clk": 14,
    "clkPhase": false,
    "buzzer": 15,
    "dfPlayerRx": 16,
    "dfPlayerTx": 17,
    "scl": 18,
    "sda": 19
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `wifiSSID` / `wifiPassword` | string | Station credentials, up to 15 characters. |
| `apSSID` / `apPassword` | string | Access point credentials, up to 15 characters. |
| `displayWidth` / `displayHeight` | integer | Matrix size in pixels, `1`–`65535`. |
| `numRows` / `numCols` | integer | Panel layout, `1`–`65535`. |
| `autoSleep` | boolean | Enable scheduled display sleep. |
| `sleepAt` | integer | Sleep time as minute of day, `0`–`1439`. |
| `wakeAt` | integer | Wake time as minute of day, `0`–`1439`. |
| `r1`,`g1`,`b1`,`r2`,`g2`,`b2` | integer | RGB pin mapping. |
| `a`,`b`,`c`,`d`,`e` | integer | Row address pins. |
| `lat`,`oe`,`clk` | integer | Latch, output-enable, and clock pins. |
| `clkPhase` | boolean | Clock phase. |
| `buzzer` | integer | Buzzer pin. |
| `dfPlayerRx` / `dfPlayerTx` | integer | DFPlayer UART pins; may be `-1` when unused. |
| `scl` / `sda` | integer | I2C pins. |

Required pins must be `0`–`gpioMax`. Only `dfPlayerRx` and `dfPlayerTx` accept `-1`.

## `GET global.schema`

```json
{
  "id": 3,
  "path": "global.schema",
  "data": {
    "wifiSSID": "char16",
    "wifiPassword": "password16",
    "apSSID": "char16",
    "apPassword": "password16",
    "displayWidth": "uint16",
    "displayHeight": "uint16",
    "numRows": "uint16",
    "numCols": "uint16",
    "autoSleep": "bool",
    "sleepAt": "clock",
    "wakeAt": "clock",
    "r1": "int8",
    "g1": "int8",
    "b1": "int8",
    "r2": "int8",
    "g2": "int8",
    "b2": "int8",
    "a": "int8",
    "b": "int8",
    "c": "int8",
    "d": "int8",
    "e": "int8",
    "lat": "int8",
    "oe": "int8",
    "clk": "int8",
    "clkPhase": "bool",
    "buzzer": "int8",
    "dfPlayerRx": "int8",
    "dfPlayerTx": "int8",
    "scl": "int8",
    "sda": "int8"
  }
}
```

## `SET global.config`

Patches the configuration. The update is **all-or-nothing**: every supplied field is
validated before anything is written. If validation or the flash write fails, the previous
configuration is restored.

```json
{
  "id": 4,
  "method": "set",
  "path": "global.config",
  "data": {
    "wifiSSID": "MyWiFi",
    "wifiPassword": "newpassword"
  }
}
```

On success the reply echoes the submitted values, then the device restarts after
approximately one second. The reply is sent before the restart.

```json
{ "id": 4, "path": "global.config", "data": { "wifiSSID": "MyWiFi", "wifiPassword": "newpassword" } }
```

Errors:

| Error | Cause |
|-------|-------|
| `missing data` | `data` is not an object. |
| `invalid <field>` | A field failed validation, for example `invalid wifiSSID`. |
| `unknown field` | A key is not part of the global configuration. |
| `write failed` | The configuration could not be persisted. |

## `GET global.state`

```json
{
  "id": 5,
  "path": "global.state",
  "data": {
    "brightness": 128,
    "activeScene": 2,
    "activePlaylist": -1,
    "playlistIndex": 0,
    "playlistOnce": false
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `brightness` | integer | Display brightness, `0`–`255`. |
| `activeScene` | integer | Active scene ID, or `-1` if none. |
| `activePlaylist` | integer | Active playlist ID, or `-1` for a static scene. |
| `playlistIndex` | integer | Current entry index within the active playlist. |
| `playlistOnce` | boolean | Whether the playlist is running as a one-shot. |

## `SET global.state`

Only `brightness` is writable.

```json
{
  "id": 6,
  "method": "set",
  "path": "global.state",
  "data": { "brightness": 200 }
}
```

A successful change produces **no unicast reply**. Every client receives:

```json
{ "event": "global.state", "data": { "brightness": 200 } }
```

If the value is unchanged, the device does not publish an event.

Errors: `missing data`, `invalid brightness` (not an integer or outside `0`–`255`),
`unknown field`.

## License

### `SET global` — activate

```json
{
  "id": 7,
  "method": "set",
  "path": "global",
  "data": { "key": "XXXX-XXXX-XXXX-XXXX" }
}
```

```json
{ "id": 7, "path": "global", "data": { "key": "XXXX-XXXX-XXXX-XXXX" } }
```

Errors: `missing data`, `missing key`, `invalid license key`.

### `DEL global` — deactivate

```json
{ "id": 8, "method": "del", "path": "global" }
```

```json
{ "id": 8, "path": "global", "data": { "premium": false } }
```

Errors: `delete failed`. A `del` with a non-empty path returns `unknown path`.

## `CMD global` — reboot

```json
{ "id": 9, "method": "cmd", "path": "global", "data": { "action": "reboot" } }
```

Success produces no unicast reply and restarts the device after approximately one second.
Errors: `missing data`, `missing action`, `unknown action`, `restart failed`.

`cmd` with a non-empty path, and any `add`, return `method not allowed`.
