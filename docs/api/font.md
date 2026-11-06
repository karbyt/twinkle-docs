# Font API

The `font` controller exposes the built-in font catalog used by text templates and scenes.

## Route

| Method | Path | Description |
|--------|------|-------------|
| `get`  | `font` | List available fonts. |

Any other method returns `method not allowed`. A non-empty path returns `unknown path`.

## `GET font`

```json
{
  "id": 1,
  "path": "font",
  "data": [
    { "id": 0, "label": "Classic (Num Only)", "value": "Angka6x16" },
    { "id": 1, "label": "Arial 14", "value": "Arial14" }
  ]
}
```

Use `value` in configuration; `label` is intended for UI display.

## Font Catalog

| ID | Label | Value |
|----|-------|-------|
| 0 | Classic (Num Only) | `Angka6x16` |
| 1 | Arial 14 | `Arial14` |
| 2 | Arial Black 16 | `ArialBlack16` |
| 3 | Bauhaus | `Bauhaus` |
| 4 | Beanstalk | `Beanstalk` |
| 5 | Big Clock | `BigClock` |
| 6 | Born to be Sporty | `Born2bSporty` |
| 7 | Better Pixels | `BetterPixels` |
| 8 | Corsiva 12 | `Corsiva12` |
| 9 | DejaVu Sans 9 | `DejaVuSans9` |
| 10 | DejaVu Sans Bold 9 | `DejaVuSansBold9` |
| 11 | Droid Sans 12 | `DroidSans12` |
| 12 | Droid Sans 24 | `DroidSans24` |
| 13 | Electronmart | `ElectronMart` |
| 14 | Electronmart 6x12 | `ElectronMart6x12` |
| 15 | Electronmart 6x16 (Num only) | `ElectronMart6x16` |
| 16 | Extrude | `Extrude` |
| 17 | Free Sans Bold 9 | `FreeSansBold9` |
| 18 | Free Sans Bold 24 | `FreeSansBold24` |
| 19 | FSans Bold Oblique 18 | `FSansBO18` |
| 20 | FSans Bold Oblique 24 | `FSansBO24` |
| 21 | Icon Quad Pix | `IconQuadPix` |
| 22 | Clock (Num Only) | `11x21` |
| 23 | Mono 5x7 | `Mono5x7` |
| 24 | Org 01 | `Org01` |
| 25 | Pixel Times New Roman | `PixelTimesNewRoman` |
| 26 | Pico Pixel | `PicoPixel` |
| 27 | Px Art | `PxArt` |
| 28 | Seven Segment 27x64 (Num Only) | `SevenSegment` |
| 29 | Sticker | `Sticker` |
| 30 | Tom Thumb | `TomThumb` |
| 31 | Verdana 24 | `Verdana24` |

Entries marked "Num Only" only contain digits and may not render alphabetic characters.
