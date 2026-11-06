# Playlist API

A playlist is an ordered list of scene IDs. Playlists are stored in
`/config/playlists.json` as an array.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `playlist` | List playlists as compact rows. |
| `get`  | `playlist.N` | Full playlist object. |
| `set`  | `playlist` | Patch a playlist (requires `id`). |
| `add`  | `playlist` | Create a playlist. |
| `del`  | `playlist` | Delete a playlist. |
| `cmd`  | `playlist` | Start a playlist. |

Any method other than `get` on `playlist.N` returns `method not allowed`; a non-numeric ID
returns `invalid id`.

## Limits

| Limit | Free | Premium |
|-------|------|---------|
| Playlists | 2 | 32 |
| Entries per playlist | 32 | 32 |

Adding beyond the limit returns `too many`.

## List Row Format

```json
{
  "id": 1,
  "path": "playlist",
  "data": [
    [1, "Pagi", 3],
    [2, "", 1]
  ]
}
```

| Index | Field | Description |
|-------|-------|-------------|
| 0 | `id` | Playlist ID. |
| 1 | `name` | Name, or `""` when unset. |
| 2 | `count` | Number of entries. |

## `GET playlist.N`

```json
{
  "id": 2,
  "path": "playlist.1",
  "data": {
    "id": 1,
    "name": "Pagi",
    "entries": [2, 15, 1]
  }
}
```

`entries` contains scene IDs played in order. Error: `unknown id`.

## `SET playlist`

```json
{
  "id": 3,
  "method": "set",
  "path": "playlist",
  "data": { "id": 1, "name": "Pagi", "entries": [2, 15, 1] }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | yes | Playlist to update. Cannot be changed. |
| `name` | string | no | Playlist name. |
| `entries` | integer[] | no | Scene IDs, `1`–`32` items. Every ID must be valid. |

The reply echoes the submitted patch.

```json
{ "id": 3, "path": "playlist", "data": { "id": 1, "name": "Pagi", "entries": [2, 15, 1] } }
```

Errors: `missing data`, `missing id`, `cannot change id`, `invalid name`,
`invalid entries`, `unknown field`, `not ready`, `unknown id`, `write failed`.

## `ADD playlist`

`entries` is required; `name` defaults to `""`. The server assigns
`id = max(existing ids) + 1`; a supplied `id` is ignored. Success produces **no unicast
reply**.

```json
{
  "id": 4,
  "method": "add",
  "path": "playlist",
  "data": { "name": "Malam", "entries": [16, 13, 1] }
}
```

Errors: `missing data`, `missing entries`, `invalid entries`, `invalid name`,
`unknown field`, `not ready`, `too many`, `write failed`.

## `DEL playlist`

```json
{ "id": 5, "method": "del", "path": "playlist", "data": { "id": 2 } }
```

Success produces **no unicast reply**.

Errors: `missing data`, `missing id`, `not ready`, `unknown id`, `write failed`.

## `CMD playlist`

```json
{
  "id": 6,
  "method": "cmd",
  "path": "playlist",
  "data": { "action": "switchPlaylist", "target": 1 }
}
```

| Action | Description |
|--------|-------------|
| `switchPlaylist` | Start the playlist and loop entries. |
| `switchPlaylistOnce` | Play the playlist once, then stop. |

`target` is the playlist ID, `0`–`255`.

Success produces **no unicast reply**. Switching a playlist is a scene change, so all
clients receive a `global.state` event:

```json
{
  "event": "global.state",
  "data": {
    "activeScene": 2,
    "activePlaylist": 1,
    "playlistIndex": 0,
    "playlistOnce": false
  }
}
```

Errors: `missing data`, `unknown action`, `missing target`, `invalid target`,
`unknown playlist`, `switch failed`, `unknown command path` (non-empty path).

## Events

See [`playlist`](./events#playlist).

After `set` or `add`, all clients receive the changed row:

```json
{ "event": "playlist", "data": [[1, "Pagi", 3]] }
```

After `del`, all clients receive the complete list:

```json
{ "event": "playlist", "data": [[1, "Pagi", 3], [2, "", 1]] }
```
