# Automation API

Automations run actions when a trigger fires. They are stored in
`/config/automation.json` as an array.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `automation` | List automations as compact rows. |
| `get`  | `automation.N` | Full automation object. |
| `set`  | `automation` | Patch an automation (requires `id`). |
| `add`  | `automation` | Create an automation. |
| `del`  | `automation` | Delete an automation. |

`cmd` returns `method not allowed`. Any method other than `get` on `automation.N` returns
`method not allowed`; a non-numeric ID returns `invalid id`.

## Limits

| Limit | Free | Premium |
|-------|------|---------|
| Automations | 8 | 32 |
| Actions executed per automation | 16 | 16 |

Adding beyond the automation limit returns `too many`. When loading, entries beyond the
limit are ignored. An automation may store more than 16 actions, but only the first 16 are
executed.

## List Row Format

```json
{
  "id": 1,
  "path": "automation",
  "data": [
    [1, "Morning", 1, 127, 300, "time", ["scene", "brightness"]],
    [2, "", 0, 95, 270, "prayer", ["playlistOnce"]]
  ]
}
```

| Index | Field | Description |
|-------|-------|-------------|
| 0 | `id` | Automation ID. |
| 1 | `name` | Name, or `""` when unset. |
| 2 | `enabled` | `1` enabled, `0` disabled. |
| 3 | `days` | Day bitmask. |
| 4 | `val` | Trigger value: minute of day for `time`, resolved prayer minute for `prayer`, `0` for `boot`. |
| 5 | `triggerType` | `boot`, `time`, or `prayer`. |
| 6 | `actionTypes` | Array of action `type` strings. |

> `val` for a prayer trigger is computed from the current PrayerTime data, so it can change
> between requests.

## `GET automation.N`

Returns the full stored object.

```json
{
  "id": 2,
  "path": "automation.1",
  "data": {
    "id": 1,
    "name": "Morning",
    "enabled": true,
    "trigger": { "type": "time", "val": 300, "days": 127 },
    "actions": [
      { "type": "scene", "val": 2 },
      { "type": "brightness", "val": 180 }
    ]
  }
}
```

Error: `unknown id`.

## Triggers

```json
{ "type": "boot" }
```

```json
{ "type": "time", "val": 300, "offset": -5, "days": 127 }
```

```json
{ "type": "prayer", "val": "subuh", "offset": 0, "days": 127 }
```

| Field | Type | Applies to | Description |
|-------|------|------------|-------------|
| `type` | string | all | `boot`, `time`, or `prayer`. |
| `val` | integer / string | `time` / `prayer` | Minute of day `0`–`1440` (1440 wraps to 0) or prayer name. |
| `offset` | integer | `time`, `prayer` | Minute offset, `-128`–`127`. Default `0`. |
| `days` | integer | `time`, `prayer` | Day bitmask `0`–`255`. Default `127`. |

Prayer names: `imsak`, `subuh`, `terbit`, `duha`, `zuhur`, `asar`, `magrib`, `isya`.

Day bitmask: bit `0` = Sunday through bit `6` = Saturday. `127` = every day. For example,
`95` (`127 & ~32`) = every day except Friday.

## Actions

Each action is an object with `type` and `val`; some accept extra fields.

| `type` | `val` | Description |
|--------|-------|-------------|
| `scene` | scene ID `0`–`255` | Switch scene. Optional `state` object applied as overrides. |
| `sceneOnce` | scene ID `0`–`255` | Switch scene for one cycle. Optional `state`. |
| `playlist` | playlist ID | Start a playlist. |
| `playlistOnce` | playlist ID | Run a playlist once. |
| `buzzer.play` | string | Play a `.rtttl` path (starts with `/`) or an inline RTTTL melody. |
| `buzzer.stop` | — | Stop the buzzer. |
| `audio.play` | track ID `1`–`3000` | Play a track. |
| `audio.pause` | — | Pause playback. |
| `audio.resume` | — | Resume playback. |
| `audio.stop` | — | Stop playback. |
| `audio.vol` | `0`–`30` | Set volume. |
| `audio.eq` | `0`–`5` | Set equalizer preset. |
| `brightness` | `0`–`255` | Set display brightness. |

Individual action objects are **not validated** on create or update. Invalid actions are
skipped at execution time.

```json
{
  "id": 3,
  "method": "add",
  "path": "automation",
  "data": {
    "name": "Subuh",
    "enabled": true,
    "trigger": { "type": "prayer", "val": "subuh", "days": 127 },
    "actions": [
      { "type": "playlistOnce", "val": 1 },
      { "type": "brightness", "val": 200 },
      { "type": "audio.play", "val": 1 }
    ]
  }
}
```

## `SET automation`

Patch semantics. `id` is required and must match the automation being changed. The reply
echoes the submitted patch.

```json
{
  "id": 4,
  "method": "set",
  "path": "automation",
  "data": { "id": 1, "enabled": false }
}
```

```json
{ "id": 4, "path": "automation", "data": { "id": 1, "enabled": false } }
```

Errors: `missing data`, `missing id`, `cannot change id`, `invalid name`, `invalid enabled`,
`invalid trigger`, `invalid actions`, `unknown field`, `not ready`, `unknown id`,
`write failed`.

## `ADD automation`

`trigger` and `actions` are required. `name` defaults to `""` and `enabled` defaults to
`true`. The server assigns `id = max(existing ids) + 1`; a supplied `id` is ignored.

Success produces **no unicast reply**.

Errors: `missing data`, `missing trigger`, `invalid trigger`, `invalid actions`,
`invalid name`, `invalid enabled`, `unknown field`, `not ready`, `too many`, `write failed`.

## `DEL automation`

```json
{ "id": 5, "method": "del", "path": "automation", "data": { "id": 2 } }
```

Success produces **no unicast reply**.

Errors: `missing data`, `missing id`, `not ready`, `unknown id`, `write failed`.

## Events

See [`automation`](./events#automation).

After `set` or `add`, all clients receive the changed row:

```json
{
  "event": "automation",
  "data": [[1, "Morning", 1, 127, 300, "time", ["scene", "brightness"]]]
}
```

After `del`, all clients receive the complete list:

```json
{
  "event": "automation",
  "data": [
    [1, "Morning", 1, 127, 300, "time", ["scene"]],
    [2, "", 0, 95, 270, "prayer", ["playlistOnce"]]
  ]
}
```
