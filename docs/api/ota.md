# OTA API

Firmware updates are uploaded over plain HTTP on port 80. This replaces ArduinoOTA,
which uses a raw UDP/TCP protocol that browsers cannot speak.

## `POST /api/ota`

Send one firmware `.bin` as `multipart/form-data` with the field name `firmware`.

```http
POST /api/ota
Content-Type: multipart/form-data; boundary=...
x-fw-size: 1048576
x-md5: d41d8cd98f00b204e9800998ecf8427e

--...
Content-Disposition: form-data; name="firmware"; filename="firmware.bin"
Content-Type: application/octet-stream

<binary>
--...--
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `x-fw-size` | no | Firmware size in bytes. Passed to `Update.begin(size)` so excess or short transfers are rejected up front. |
| `x-md5` | no | 32-character hex MD5 of the firmware. When present, verified after the transfer. This detects corruption, not tampering. |

### Responses

| Status | Body | Description |
|--------|------|-------------|
| `200` | `{"ok":true}` | Update accepted; the device restarts in about one second. |
| `400` | `{"error":"ota busy"}` | Another update is already in progress. |
| `400` | `{"error":"no filename"}` | The multipart part has no filename. |
| `400` | `{"error":"<Update.errorString()>"}` | Flashing failed; the message comes from the update library. |

The `200` response is sent before the restart is scheduled, so the client receives it
before the connection drops.

## Browser Example

```js
async function uploadFirmware(file) {
  const body = new FormData();
  body.append("firmware", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/ota");
  xhr.setRequestHeader("x-fw-size", file.size);
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) console.log(`${(e.loaded / e.total) * 100}%`);
  };
  xhr.onload = () => console.log(xhr.status, xhr.responseText);
  xhr.send(body);
}
```

## Behavior

- The image is always written to `U_FLASH`; filesystem images are never accepted, so
  `/config` cannot be overwritten.
- The multipart body is streamed to `Update.write()` chunk by chunk; the full firmware is
  never buffered in RAM.
- Background provider and system tasks are suspended while flash is being written.
- Only one update runs at a time; a second request returns `ota busy`.

## Security

This endpoint has **no authentication or authorization**, by design for a home or local
AP network. Anyone who can reach the device can flash it. Do not expose the device to an
untrusted network.
