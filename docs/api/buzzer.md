# Buzzer API

The `buzzer` controller lists available RTTTL melodies and controls playback.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `buzzer` | List melody names. |
| `cmd`  | `buzzer` | Play a melody or stop playback. |

`get` with a sub-path returns `unknown path`. `set` returns `method not allowed`. On the
plain path, `add` and `del` are treated as `cmd`.

## `GET buzzer`

Returns melody names **without** the `.rtttl` extension. The list contains the built-in
melody table plus any extra `.rtttl` files found in `/buzzer`.

```json
{
  "id": 1,
  "path": "buzzer",
  "data": ["assembly", "call_todo", "tarhim", "my_custom"]
}
```

Error: `not ready` when the filesystem is not initialized.

## `CMD buzzer`

### Play a file

```json
{
  "id": 2,
  "method": "cmd",
  "path": "buzzer",
  "data": { "action": "play", "file": "/buzzer/assembly.rtttl" }
}
```

`file` must:

- Start with `/`.
- End with `.rtttl`.
- Be at least 8 characters long.
- Be shorter than 64 characters.

### Play an inline melody

```json
{
  "id": 3,
  "method": "cmd",
  "path": "buzzer",
  "data": {
    "action": "play",
    "melody": "Beep:d=4,o=5,b=120:c,e,g"
  }
}
```

Supply exactly one of `file` or `melody`. The inline melody must be shorter than 2048
bytes and must be valid RTTTL.

### Stop

```json
{ "id": 4, "method": "cmd", "path": "buzzer", "data": { "action": "stop" } }
```

Success produces **no unicast reply**. The device broadcasts `buzzer.state` to all clients,
including when playback finishes on its own.

Errors:

| Error | Cause |
|-------|-------|
| `missing data` | `data` is not an object. |
| `missing action` | `action` is missing. |
| `ambiguous` | Both `file` and `melody` were supplied. |
| `missing file or melody` | Neither `file` nor `melody` was supplied. |
| `invalid file path` | `file` failed the path rules above. |
| `play failed` | File read, allocation, or RTTTL parsing failed. |
| `unknown action` | Unsupported `action`. |
| `already stopped` | `stop` while already stopped. |
| `unknown command path` | `cmd` used with a sub-path. |

## Events

See [`buzzer.state`](./events#buzzer-state).

```json
{ "event": "buzzer.state", "data": { "state": 1, "file": "/buzzer/assembly.rtttl" } }
{ "event": "buzzer.state", "data": { "state": 0, "file": "" } }
```

`state` is `0` stopped or `1` playing. For an inline melody, `file` contains the melody
name (the text before the first `:`).
