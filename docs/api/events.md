# Events

The device pushes unsolicited messages to every connected WebSocket client. Event frames
carry **no `id` or `path`** and have the shape:

```json
{ "event": "<name>", "data": { } }
```

Events are queued and broadcast from the main loop, so they may arrive a few milliseconds
after the request that caused them. Unsolicited events also arrive when the device changes
state on its own, for example when a playlist advances, a `sceneOnce` expires, or a melody
finishes.

## Event Summary

| Event | Trigger | Data |
|-------|---------|------|
| [`global.state`](#global-state) | Scene change, brightness change, playlist switch | Scene, playlist, or `brightness` |
| [`audio.state`](#audio-state) | Audio command or playback state change | `state`, `vol`, or `eq` |
| [`buzzer.state`](#buzzer-state) | Buzzer command or melody finished | `state`, `file` |
| [`automation`](#automation) | Automation created, updated, or deleted | A row or the full list |
| [`playlist`](#playlist) | Playlist created, updated, or deleted | A row or the full list |

## `global.state`

Emitted when the active scene changes, when a playlist advances, or when brightness
changes. Scene changes send scene and playlist fields; brightness changes send only
`brightness`.

Scene change:

```json
{
  "event": "global.state",
  "data": {
    "activeScene": 2,
    "activePlaylist": -1,
    "playlistIndex": 0,
    "playlistOnce": false
  }
}
```

Playlist switch or advance:

```json
{
  "event": "global.state",
  "data": {
    "activeScene": 16,
    "activePlaylist": 1,
    "playlistIndex": 2,
    "playlistOnce": false
  }
}
```

Brightness change (`set global.state`):

```json
{ "event": "global.state", "data": { "brightness": 200 } }
```

| Field | Type | Description |
|-------|------|-------------|
| `activeScene` | integer | Active scene ID. |
| `activePlaylist` | integer | Active playlist ID, or `-1`. |
| `playlistIndex` | integer | Current playlist entry. |
| `playlistOnce` | boolean | Whether the playlist runs once. |
| `brightness` | integer | Brightness `0`–`255`; only on brightness changes. |

A scene-change event is also emitted when the device automatically returns from a
`sceneOnce` or when a playlist advances on its own.

## `audio.state`

Partial payloads, depending on what changed.

State change:

```json
{ "event": "audio.state", "data": { "state": 1, "file": 2 } }
```

`file` is present only when `state` is `1` (playing).

Volume change:

```json
{ "event": "audio.state", "data": { "vol": 20 } }
```

Equalizer change:

```json
{ "event": "audio.state", "data": { "eq": 3 } }
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | integer | `0` stopped, `1` playing, `2` paused. |
| `file` | integer | Current track ID. |
| `vol` | integer | Volume `0`–`30`. |
| `eq` | integer | Equalizer preset `0`–`5`. |

## `buzzer.state`

Emitted on every playback state change, including natural completion.

```json
{ "event": "buzzer.state", "data": { "state": 1, "file": "/buzzer/assembly.rtttl" } }
```

```json
{ "event": "buzzer.state", "data": { "state": 0, "file": "" } }
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | integer | `0` stopped, `1` playing. |
| `file` | string | Playing file path, melody name, or `""` when stopped. |

## `automation`

After `set` or `add`, `data` is an array containing the single changed row. After `del`,
`data` is the full list.

```json
{
  "event": "automation",
  "data": [[1, "Morning", 1, 127, 300, "time", ["scene", "brightness"]]]
}
```

See [Automation API](./automation#list-row-format) for the row format.

## `playlist`

After `set` or `add`, `data` is an array containing the single changed row. After `del`,
`data` is the full list.

```json
{ "event": "playlist", "data": [[1, "Pagi", 3]] }
```

See [Playlist API](./playlist#list-row-format) for the row format.
