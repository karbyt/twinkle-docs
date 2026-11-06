# Scene API

Scenes render the LED matrix. A scene has:

- **Metadata** — id, name, and nominal matrix size.
- **State** — the live configuration of the scene instance currently on screen.
- **Config** — the persisted configuration file for the scene.
- **Schema** — the field/type map used by editors.

Scene IDs are stable enum values; scene names are display strings.

## Scene IDs

| ID | Name | Width | Height |
|----|------|-------|--------|
| 0  | Test Scene | 0 | 0 |
| 1  | Gradient Scene | 0 | 0 |
| 2  | Prayer 64x32 | 64 | 32 |
| 3  | Prayer 128x32 | 128 | 32 |
| 4  | Prayer 192x32 | 192 | 32 |
| 5  | Prayer 256x32 | 256 | 32 |
| 6  | Prayer 320x32 | 320 | 32 |
| 7  | Prayer 384x32 | 384 | 32 |
| 8  | Prayer 128x64 | 128 | 64 |
| 9  | Prayer 192x64 | 192 | 64 |
| 10 | Prayer 256x64 | 256 | 64 |
| 11 | Prayer 320x64 | 320 | 64 |
| 12 | Prayer 384x64 | 384 | 64 |
| 13 | Azan | 0 | 0 |
| 14 | Financial Report | 0 | 0 |
| 15 | Big Clock | 0 | 0 |
| 16 | Iqomah Scene | 0 | 0 |
| 17 | Petugas Sholat | 0 | 0 |
| 18 | Khotbah Scene | 0 | 0 |
| 19 | QR Code Scene | 0 | 0 |

> `width`/`height` of `0` means the scene is not tied to a fixed matrix size in the
> registry. Azan inherits the Iqomah layout and configuration.

## Routes

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `scene` | List all scenes. |
| `get`  | `scene.N` | Metadata for one scene. |
| `get`  | `scene.N.state` | Live state of the active scene. |
| `set`  | `scene.N.state` | Patch the live state of the active scene (RAM only). |
| `get`  | `scene.N.config` | Persisted configuration, merged over the scene defaults. |
| `set`  | `scene.N.config` | Patch the persisted configuration. |
| `get`  | `scene.N.schema` | Field/type map for the scene configuration. |
| `cmd`  | `scene` | Switch the active scene. |

### `GET scene`

```json
{
  "id": 1,
  "path": "scene",
  "data": [
    { "id": 0, "name": "Test Scene", "width": 0, "height": 0 },
    { "id": 1, "name": "Gradient Scene", "width": 0, "height": 0 },
    { "id": 2, "name": "Prayer 64x32", "width": 64, "height": 32 }
  ]
}
```

### `GET scene.N`

```json
{
  "id": 2,
  "path": "scene.2",
  "data": { "id": 2, "name": "Prayer 64x32", "width": 64, "height": 32 }
}
```

### `GET scene.N.state`

Returns the configuration of the scene instance that is currently active. The payload
uses the same fields as the scene configuration.

```json
{
  "id": 3,
  "path": "scene.2.state",
  "data": { "duration": 5000, "mainTime": "{{time(hh:mm)}}" }
}
```

If the requested scene is not the active one, the reply is an error:

```json
{ "id": 3, "path": "scene.2.state", "error": "scene not active" }
```

### `SET scene.N.state`

Patches the live state of the **active** scene. Only the supplied keys are changed;
everything else is kept. Changes are applied immediately and are **not** written to
flash.

```json
{
  "id": 4,
  "method": "set",
  "path": "scene.2.state",
  "data": { "duration": 8000 }
}
```

```json
{ "id": 4, "path": "scene.2.state", "data": { "duration": 8000 } }
```

Errors: `missing data`, `scene not active`.

### `GET scene.N.config`

Returns the scene defaults overlaid with the stored configuration file
(`/config/scenes/<id>.json`). This guarantees that every field has a value even when the
file is missing or incomplete.

```json
{
  "id": 5,
  "path": "scene.2.config",
  "data": { "duration": 5000, "imsakText": "Imsak" }
}
```

Errors: `unknown scene`, `config not found` (no defaults and no file).

### `SET scene.N.config`

Patches the persisted configuration. The write order is:

1. Scene defaults.
2. Existing configuration file.
3. Fields from the request.

Only the fields in the request are overwritten. `duration` is clamped to a minimum of
`1000` ms. The reply echoes the submitted values.

```json
{
  "id": 6,
  "method": "set",
  "path": "scene.2.config",
  "data": { "duration": 8000, "mainTimeColor": 63488 }
}
```

Errors: `unknown scene`, `missing data`, `write failed`.

> Writing `config` does **not** apply the values to the active scene. To change what is
> currently displayed, use `set scene.N.state` or switch the scene after writing.

### `GET scene.N.schema`

Returns a map of configuration fields to editor type hints. Array values list the allowed
enum members.

```json
{
  "id": 7,
  "path": "scene.2.schema",
  "data": {
    "duration": "uint32",
    "imsakText": "char36",
    "scrollSpeed": [1, 2, 3, 4, 5, 6]
  }
}
```

Errors: `schema unavailable`.

## `CMD scene`

Switches the active scene. Use this for both persistent and temporary switches.

```json
{
  "id": 10,
  "method": "cmd",
  "path": "scene",
  "data": {
    "action": "switchScene",
    "target": 2
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | yes | `switchScene` (stays until changed) or `switchSceneOnce` (returns to the previous scene after the scene duration). |
| `target` | integer | yes | Scene ID. |
| `state` | object | no | Partial configuration override applied on top of the scene's stored config. The override is not written to flash. |

Success produces **no unicast reply**. Every client receives a `global.state` event:

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

Errors are sent only to the requester:

| Error | Cause |
|-------|-------|
| `missing data` | `data` is not an object. |
| `unknown action` | Missing or unsupported `action`. |
| `missing target` | `target` is absent. |
| `invalid target` | `target` is not an integer. |
| `unknown scene` | `target` is not a registered scene. |
| `state must be an object` | `state` was supplied but is not an object. |
| `switch failed` | The switch was rejected, for example `switchSceneOnce` with the already-active scene. |

> On the plain `scene` path, `add` and `del` are accepted as aliases for `cmd`. A `set`
> on the plain path returns `method not allowed`. On a sub-path, `cmd`/`add`/`del` return
> `unknown command path`.

## Scene Schemas

The following examples show the `data` object returned by `GET scene.N.schema`. These are
the fields the scene understands. Note that `set scene.N.config` writes keys as-is and does
not reject unknown keys.

### Scene 0 — Test Scene

```json
{
  "duration": "uint32"
}
```

### Scene 1 — Gradient Scene

```json
{
  "duration": "uint32"
}
```

### Scene 2 — Prayer 64x32

```json
{
  "duration": "uint32",
  "imsakText": "char36",
  "subuhText": "char36",
  "terbitText": "char36",
  "duhaText": "char36",
  "zuhurText": "char36",
  "asarText": "char36",
  "magribText": "char36",
  "isyaText": "char36",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "easing",
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 3 — Prayer 128x32

```json
{
  "duration": "uint32",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "easing",
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 4 — Prayer 192x32

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "uint8",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 5 — Prayer 256x32

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "uint8",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 6 — Prayer 320x32

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "uint8",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 7 — Prayer 384x32

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "uint8",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 8 — Prayer 128x64

```json
{
  "duration": "uint32",
  "imsakText": "char8",
  "subuhText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "topRightText": "char32",
  "bottomRightText": "char32",
  "topRightTextColor": "color16",
  "bottomRightTextColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "easing",
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 9 — Prayer 192x64

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzColor": "color16",
  "lineColor": "color16",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "topRightText": "char48",
  "bottomRightText": "char48",
  "topRightTextColor": "color16",
  "bottomRightTextColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "easingType": "uint8",
  "lafadzKind": [1, 2],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 10 — Prayer 256x64

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "imsakText": "char8",
  "subuhText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "topRightText": "char32",
  "bottomRightText": "char32",
  "topRightTextColor": "color16",
  "bottomRightTextColor": "color16",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 11 — Prayer 320x64

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "imsakText": "char8",
  "subuhText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "topLeftText": "char32",
  "bottomLeftText": "char32",
  "topRightText": "char32",
  "bottomRightText": "char32",
  "topLeftTextColor": "color16",
  "bottomLeftTextColor": "color16",
  "topRightTextColor": "color16",
  "bottomRightTextColor": "color16",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 12 — Prayer 384x64

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "imsakText": "char8",
  "subuhText": "char8",
  "terbitText": "char8",
  "duhaText": "char8",
  "zuhurText": "char8",
  "asarText": "char8",
  "magribText": "char8",
  "isyaText": "char8",
  "imsakTextColor": "color16",
  "subuhTextColor": "color16",
  "terbitTextColor": "color16",
  "duhaTextColor": "color16",
  "zuhurTextColor": "color16",
  "asarTextColor": "color16",
  "magribTextColor": "color16",
  "isyaTextColor": "color16",
  "imsakTimeColor": "color16",
  "subuhTimeColor": "color16",
  "terbitTimeColor": "color16",
  "duhaTimeColor": "color16",
  "zuhurTimeColor": "color16",
  "asarTimeColor": "color16",
  "magribTimeColor": "color16",
  "isyaTimeColor": "color16",
  "mainTime": "char32",
  "mainTimeColor": "color16",
  "topLeftText": "char32",
  "bottomLeftText": "char32",
  "topRightText": "char32",
  "bottomRightText": "char32",
  "topLeftTextColor": "color16",
  "bottomLeftTextColor": "color16",
  "topRightTextColor": "color16",
  "bottomRightTextColor": "color16",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "scrollingText1": "char64",
  "scrollingText2": "char64",
  "scrollingText3": "char64",
  "scrollingText4": "char64",
  "scrollingText1Color": "color16",
  "scrollingText2Color": "color16",
  "scrollingText3Color": "color16",
  "scrollingText4Color": "color16",
  "scrollGap": "uint16",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8],
  "scrollSpeed": [1, 2, 3, 4, 5, 6]
}
```

### Scene 13 — Azan

Azan uses the Iqomah schema (scene 16). The only behavioural difference is that the
progress bar fills from `0` to full as the duration elapses instead of draining.

### Scene 14 — Financial Report

```json
{
  "titleText": "char64",
  "label1": "char64",
  "label2": "char64",
  "label3": "char64",
  "label4": "char64",
  "value1": "char64",
  "value2": "char64",
  "value3": "char64",
  "value4": "char64",
  "leftOffset": "uint16",
  "rightOffset": "uint16",
  "labelSpacing": "uint16",
  "labelFont": "font",
  "valueFont": "font",
  "label1Color": "color16",
  "value1Color": "color16",
  "label2Color": "color16",
  "value2Color": "color16",
  "label3Color": "color16",
  "value3Color": "color16",
  "label4Color": "color16",
  "value4Color": "color16",
  "titleFont": "font",
  "titleColor": "color16",
  "titleY": "uint16",
  "topOffset": "uint16",
  "scrollGap": "uint16",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "scrollSpeed": [1, 2, 3, 4, 5, 6],
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

### Scene 15 — Big Clock

```json
{
  "text": "char64",
  "color": "color16",
  "font": "font",
  "xPosition": "int16",
  "yPosition": "int16",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

### Scene 16 — Iqomah Scene

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "titleText": "char64",
  "titleColor": "color16",
  "titleFont": "font",
  "titleYPosition": "int16",
  "subtitleColor": "color16",
  "subtitleFont": "font",
  "subtitleYPosition": "int16",
  "showProgressBar": "bool",
  "progressBarYPosition": "int16",
  "progressBarFgColor": "color16",
  "progressBarBgColor": "color16",
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

### Scene 17 — Petugas Sholat

```json
{
  "titleText": "char64",
  "label1": "char64",
  "label2": "char64",
  "label3": "char64",
  "label4": "char64",
  "value1": "char64",
  "value2": "char64",
  "value3": "char64",
  "value4": "char64",
  "leftOffset": "uint16",
  "rightOffset": "uint16",
  "labelSpacing": "uint16",
  "labelFont": "font",
  "valueFont": "font",
  "label1Color": "color16",
  "value1Color": "color16",
  "label2Color": "color16",
  "value2Color": "color16",
  "label3Color": "color16",
  "value3Color": "color16",
  "label4Color": "color16",
  "value4Color": "color16",
  "titleFont": "font",
  "titleColor": "color16",
  "titleY": "uint16",
  "topOffset": "uint16",
  "scrollGap": "uint16",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "scrollSpeed": [1, 2, 3, 4, 5, 6],
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

### Scene 18 — Khotbah Scene

```json
{
  "duration": "uint32",
  "showLafadz": "bool",
  "lafadzPrimaryColor": "color16",
  "lafadzSecondaryColor": "color16",
  "lafadzTertiaryColor": "color16",
  "lafadzAccentColor": "color16",
  "titleText": "char64",
  "titleColor": "color16",
  "titleYPosition": "int16",
  "titleFont": "font",
  "topicText": "char64",
  "topicColor": "color16",
  "topicYPosition": "int16",
  "topicFont": "font",
  "scrollSpeed": [1, 2, 3, 4, 5, 6],
  "lafadzKind": [1, 2, 3, 4, 5, 6, 7, 8]
}
```

### Scene 19 — QR Code Scene

```json
{
  "duration": "uint32",
  "scrollSpeed": [1, 2, 3, 4, 5, 6],
  "qrText": "char64",
  "qrXPosition": "int16",
  "qrYPosition": "int16",
  "qrBgColor": "color16",
  "qrFgColor": "color16",
  "qrEcc": [1, 2, 3, 4],
  "qrLevel": "uint8",
  "qrScale": "uint8",
  "titleText": "char64",
  "titleColor": "color16",
  "titleYPosition": "int16",
  "titleFont": "font",
  "subtitleText": "char64",
  "subtitleColor": "color16",
  "subtitleYPosition": "int16",
  "subtitleFont": "font"
}
```
