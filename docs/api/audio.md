# Audio API

The `audio` controller manages DFPlayer playback and the track metadata stored in
`/assets/audio.json`.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `audio` | List tracks. |
| `get`  | `audio.state` | Playback state, volume, and equalizer. |
| `set`  | `audio` | Update a track. |
| `add`  | `audio` | Append a track. |
| `del`  | `audio` | Delete a track. |
| `cmd`  | `audio` | Playback action. |

> The `set`/`add`/`del` handlers do not inspect the sub-path. Only the plain `audio` path
> is intended; use `audio.state` for reads.

## Track List

`GET audio` returns the contents of `/assets/audio.json`.

```json
{
  "id": 1,
  "path": "audio",
  "data": [
    { "id": 1, "title": "Adzan Magrib", "dur": 180 },
    { "id": 2, "title": "Tarhim", "dur": 300 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Track ID, `1`–`3000`. |
| `title` | string | Display title. |
| `dur` | integer | Duration metadata in seconds. |

Error: `no audio config` when the file cannot be read.

## `GET audio.state`

```json
{
  "id": 2,
  "path": "audio.state",
  "data": {
    "vol": 15,
    "eq": 0,
    "state": 1,
    "file": 2
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `vol` | integer | Volume, `0`–`30`. |
| `eq` | integer | Equalizer preset, `0`–`5`. |
| `state` | integer | `0` stopped, `1` playing, `2` paused. |
| `file` | integer | Current track ID. Present only while playing. |

Errors: `audio not ready`, `unknown path` for any other read path.

## `SET audio` — update a track

```json
{
  "id": 3,
  "method": "set",
  "path": "audio",
  "data": { "id": 2, "title": "Tarhim Subuh", "dur": 320 }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | yes | Track to update. |
| `title` | string | no | New title. |
| `dur` | integer | no | New duration metadata. |

A successful update produces **no reply**. Read `audio` again to refresh the list.

Errors: `missing data`, `missing id`, `no audio config`, `track not found`.

## `ADD audio` — append a track

```json
{
  "id": 4,
  "method": "add",
  "path": "audio",
  "data": { "title": "New Track", "dur": 240 }
}
```

The server assigns `id = max(existing ids) + 1`. Defaults are `title = "lagu"` and
`dur = 300`. Success produces **no reply**.

Errors: `missing data`, `no audio config`.

## `DEL audio` — delete a track

```json
{
  "id": 5,
  "method": "del",
  "path": "audio",
  "data": { "id": 2 }
}
```

Success produces **no reply**. Errors: `missing data`, `missing id`, `no audio config`,
`track not found` (only when duplicate IDs remain after the first match is removed).

> Deleting an unknown ID currently returns success without changing the list.

## `CMD audio`

```json
{
  "id": 6,
  "method": "cmd",
  "path": "audio",
  "data": { "action": "play", "target": 1 }
}
```

| Action | Payload | Description |
|--------|---------|-------------|
| `play` | `target` | Play track ID, `1`–`3000`. |
| `pause` | — | Pause the current track. |
| `resume` | — | Resume a paused track. |
| `stop` | — | Stop playback. |
| `vol` | `val` | Set volume, `0`–`30`. |
| `eq` | `val` | Set equalizer preset, `0`–`5`. |

Success produces **no unicast reply**. The device broadcasts `audio.state` to all clients.

Errors:

| Error | Cause |
|-------|-------|
| `missing data` | `data` is not an object. |
| `missing action` | `action` is missing. |
| `audio not ready` | The DFPlayer is not initialized. |
| `unknown action` | Unsupported `action`. |
| `missing target` | `play` without `target`. |
| `invalid target` | `target` is not an integer or is outside `1`–`3000`. |
| `not playing` | `pause` while not playing. |
| `not paused` | `resume` while not paused. |
| `already stopped` | `stop` while already stopped. |
| `missing val` / `invalid val` | `vol` or `eq` without a valid value. |
| `command failed` | The manager rejected the command. |
| `unknown command path` | `cmd` used with a sub-path. |

## Events

See [`audio.state`](./events#audio-state).

```json
{ "event": "audio.state", "data": { "state": 1, "file": 2 } }
{ "event": "audio.state", "data": { "vol": 20 } }
{ "event": "audio.state", "data": { "eq": 3 } }
```
