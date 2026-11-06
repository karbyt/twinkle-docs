# API Overview

Twinkle exposes two transports:

- **WebSocket** for control, configuration, and live state — `ws://<device-ip>/ws` on port `80`.
- **HTTP** for filesystem operations (`/api/fs/*`) and firmware updates (`/api/ota`).

All WebSocket messages are JSON text frames. There is one socket for the whole device;
requests are routed by the first segment of their `path`.

## Connecting

```js
const ws = new WebSocket(`ws://${location.hostname}/ws`);

ws.addEventListener('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'get',
    path: 'global'
  }));
});

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);

  if (msg.event) {
    // Unsolicited broadcast (state changed on the device)
    console.log('event', msg.event, msg.data);
    return;
  }

  // Reply to a request: id/path are echoed from the request
  console.log('reply', msg.id, msg.path, msg.data, msg.error);
});
```

The device does not require authentication. Anyone on the same network can connect and
control it.

## Request Envelope

```json
{
  "id": 1,
  "method": "get",
  "path": "scene.0.state",
  "data": {}
}
```

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `id`     | any    | no       | Client-chosen identifier. Echoed verbatim in the reply; defaults to `0` when omitted. |
| `method` | string | yes      | One of `get`, `set`, `cmd`, `add`, `del`. |
| `path`   | string | yes      | Resource path. The first segment selects the controller. |
| `data`   | any    | depends  | Payload for `set`, `cmd`, `add`, `del`. Usually an object. |

## Response Envelope

Replies to `get` and `set`:

```json
{
  "id": 1,
  "path": "scene.0.state",
  "data": { "duration": 5000 }
}
```

Errors:

```json
{
  "id": 1,
  "path": "scene.99",
  "error": "unknown scene"
}
```

`id` and `path` are always copied verbatim from the request. A reply contains either
`data` or `error`, never both.

### Methods

| Method | Purpose | Success reply |
|--------|---------|---------------|
| `get`  | Read a resource. | Unicast reply with `data`. |
| `set`  | Patch a configuration or state. | Unicast reply with `data` (usually an echo of the submitted values), unless the change is announced by broadcast only. |
| `cmd`  | Run an action. | **No unicast reply.** The result is announced to every client as an event (for example `global.state`). Failures are sent to the requester only. |
| `add`  | Create a resource. | Usually no unicast reply; the change is announced as a collection event (`automation`, `playlist`). |
| `del`  | Delete a resource. | Usually no unicast reply; the change is announced as a collection event. |

> `add` and `del` follow the same transport rule as `cmd`: the handler only sends a
> unicast reply when it sets `error` or `data`. A successful action with no explicit
> reply is normal — wait for the event on the socket.

## Path Routing

The path prefix is matched against the registered controllers. A prefix only matches at a
segment boundary: `scene` matches `scene` and `scene.0` (and `scene/0` at the routing
level), but not `sceneX`.

| Prefix       | Transport | Description |
|--------------|-----------|-------------|
| `scene`      | WebSocket | Scenes, scene configuration, scene switching. |
| `provider`   | WebSocket | Data providers (time, prayer time, Hijri, location, moon phase). |
| `global`     | WebSocket | Device info, global configuration, brightness, license, reboot. |
| `audio`      | WebSocket | DFPlayer audio playback and track list. |
| `buzzer`     | WebSocket | Buzzer melody listing and playback. |
| `automation` | WebSocket | Automation rules (triggers and actions). |
| `playlist`   | WebSocket | Scene playlists. |
| `font`       | WebSocket | Read-only font catalog. |
| `/api/fs/*`  | HTTP      | Filesystem list/read/write/upload/copy/move/delete. |
| `/api/ota`   | HTTP      | Firmware upload. |

Use `.` between path segments, for example `scene.0.state`. A leading `/` reaches the
controller verbatim and is not interpreted as a separator, so use the dotted form in
requests.

## Transport-Level Errors

These are produced by the WebSocket dispatcher before a controller is reached.

| Error | Cause |
|-------|-------|
| `invalid json` | The frame is not valid JSON. |
| `missing path` | `path` is missing or empty. |
| `missing method` | `method` is missing or empty. |
| `unknown method` | `method` is not one of `get`, `set`, `cmd`, `add`, `del`. |
| `unknown path` | No controller matches the first path segment. |

## Broadcast Events

Events are sent to every connected client without an `id` or `path`:

```json
{
  "event": "global.state",
  "data": { "brightness": 128 }
}
```

| Event           | Emitted when |
|-----------------|--------------|
| `global.state`  | Active scene or playlist changed, or display brightness changed. |
| `audio.state`   | Audio playback state, volume, or equalizer changed. |
| `buzzer.state`  | Buzzer started or stopped (including natural playback end). |
| `automation`    | An automation was added, changed, or deleted. |
| `playlist`      | A playlist was added, changed, or deleted. |

See [Events](./events) for exact payloads.

> Multiple producers can emit `global.state` with different partial payloads. Merge the
> fields you care about instead of replacing your local state object wholesale.

## Schema Type Vocabulary

`*.schema` endpoints return a map of field name to a type hint. The values describe how an
editor should render or validate a field; the wire values are plain JSON numbers, strings,
and booleans.

| Type | Meaning |
|------|---------|
| `bool` | Boolean. |
| `int8`, `int16`, `int32` | Signed integer. |
| `uint8`, `uint16`, `uint32` | Unsigned integer. |
| `float` | Floating-point number. |
| `char8`, `char16`, `char32`, `char36`, `char48`, `char64` | String with a maximum length (the number is the buffer size). |
| `password16` | String up to 15 characters, rendered as a password field. |
| `color16` | 16-bit RGB565 color encoded as an integer. |
| `font` | Font identifier from the [font catalog](./font). |
| `clock` | Minute of day, `0`–`1439`. |
| `easing` | Easing selector encoded as an integer. |
| array | Enumerated allowed values, for example `[1, 2, 3]`. |

## HTTP Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/fs/list?path=/config` | List a directory. |
| `GET /api/fs/file?path=/config/global.json` | Download or view a file. |
| `POST /api/fs/file?path=/test.txt` | Overwrite a file with the raw request body. |
| `POST /api/fs/upload?path=/folder` | Upload a file as `multipart/form-data`. |
| `POST /api/fs/mkdir?path=/hello/world` | Create a directory (idempotent). |
| `POST /api/fs/create?path=/hello/world.txt` | Create an empty file (idempotent). |
| `POST /api/fs/copy` | Copy a file; body `{"src":"/a.txt","dst":"/b.txt"}`. |
| `POST /api/fs/move` | Move a file or directory; same body. |
| `POST /api/fs/rename` | Alias for `move`. |
| `DELETE /api/fs/file?path=/file.txt` | Delete a file or an empty directory. |
| `POST /api/ota` | Upload firmware as `multipart/form-data`. |

See [Filesystem API](./file) and [OTA API](./ota).

## Limits

| Limit | Value |
|-------|-------|
| HTTP port | `80` |
| WebSocket path | `/ws` |
| Small-reply stack buffer | `2048` bytes; larger replies are allocated from PSRAM/heap. |
| Scene count | `20` |
| Provider count | `5` |
| Automation rules | `8` free, `32` premium |
| Actions per automation | `16` |
| Playlist count | `2` free, `32` premium |
| Entries per playlist | `32` |
| Audio tracks | IDs `1`–`3000` |
| Buzzer file path | Up to `63` characters, must end in `.rtttl`. |
