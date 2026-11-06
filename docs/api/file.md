# File API

Filesystem operations use HTTP under `/api/fs`, not WebSocket. All endpoints share the
same origin as the device UI.

```text
http://<device-ip>/api/fs/...
```

- Paths are normalized: they must start with `/`; `..`, duplicate `//`, and overlong
  paths are rejected with `invalid path`.
- Only one write request (raw write or upload) can run at a time.
- Every response includes `Access-Control-Allow-Origin: *`.
- There is no authentication.

## Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/fs/list` | List a folder. |
| `GET` | `/api/fs/file` | Read a file. |
| `POST` | `/api/fs/file` | Write a file from the raw body. |
| `POST` | `/api/fs/upload` | Upload a file with `multipart/form-data`. |
| `POST` | `/api/fs/mkdir` | Create a folder. |
| `POST` | `/api/fs/create` | Create an empty file. |
| `POST` | `/api/fs/copy` | Copy a file. |
| `POST` | `/api/fs/move` | Move a file or folder. |
| `POST` | `/api/fs/rename` | Alias for `move`. |
| `DELETE` | `/api/fs/file` | Delete a file or empty folder. |

## `GET /api/fs/list`

Lists the direct contents of a folder (not recursive). Query `path` defaults to `/`.

```http
GET /api/fs/list?path=/config
```

```json
{
  "path": "/config",
  "files": [
    { "name": "global.json", "type": "file", "size": 1234 },
    { "name": "scenes", "type": "directory", "size": 0 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Normalized folder path. |
| `files[].name` | string | Basename only. |
| `files[].type` | string | `file` or `directory`. |
| `files[].size` | integer | File size in bytes; `0` for directories. |
| `truncated` | boolean | Present and `true` when the response exceeded the list budget. |

Ordering follows filesystem traversal; sort on the client. If `truncated` is `true`, the
last entry was dropped and traversal stopped.

Errors: `invalid path` 400, `not found` 404, `not a folder` 400,
`filesystem not ready` 503.

## `GET /api/fs/file`

Returns the raw file bytes. `Content-Type` is derived from the extension
(`application/octet-stream` when unknown).

```http
GET /api/fs/file?path=/config/global.json
```

Add `&download=1` to send `Content-Disposition: attachment` with the filename. The body is
identical either way.

```http
GET /api/fs/file?path=/config/global.json&download=1
```

Errors: `invalid path` 400, `not found` 404, `not a file` 400,
`filesystem not ready` 503.

## `POST /api/fs/file`

Writes the raw request body to `path`, creating the file if needed and overwriting it if it
exists. An empty body creates an empty file.

```http
POST /api/fs/file?path=/test.txt
Content-Type: application/octet-stream

hello world
```

```json
{ "ok": true, "path": "/test.txt" }
```

> Use `application/octet-stream`. Bodies that look like HTML forms
> (`application/x-www-form-urlencoded`, or `text/plain` starting with `key=value`) are
> consumed as form parameters by the web server and cannot be saved; they are rejected
> with 415.

Errors: `missing path` 400, `invalid path` 400, `not a file` 400, `write failed` 500,
`unsupported content-type for raw body` 415, `filesystem not ready` 503.

## `POST /api/fs/upload`

Uploads one file as `multipart/form-data`. `path` is the destination folder (default `/`).
The stored filename is the multipart `filename` basename, not a query value.

```http
POST /api/fs/upload?path=/images
Content-Type: multipart/form-data; boundary=...

--...
Content-Disposition: form-data; name="file"; filename="logo.png"
Content-Type: image/png

<binary>
--...--
```

```json
{ "ok": true, "path": "/images/logo.png" }
```

Errors: `missing file` 400, `invalid filename` 500, `invalid path` 500,
`write failed` 500, `filesystem not ready` 503.

## `POST /api/fs/mkdir`

Creates a folder, including parents. Idempotent: an existing folder returns success.

```http
POST /api/fs/mkdir?path=/hello/world
```

```json
{ "ok": true, "path": "/hello/world" }
```

Errors: `missing path` 400, `invalid path` 400, `mkdir failed` 500,
`filesystem not ready` 503.

## `POST /api/fs/create`

Creates an empty file. Idempotent: an existing file is left untouched.

```http
POST /api/fs/create?path=/hello/world.txt
```

```json
{ "ok": true, "path": "/hello/world.txt" }
```

Errors: `missing path` 400, `invalid path` 400, `create failed` 500,
`filesystem not ready` 503.

## `POST /api/fs/copy` / `move` / `rename`

JSON body with `src` and `dst`.

```http
POST /api/fs/move
Content-Type: application/json

{ "src": "/a.txt", "dst": "/b.txt" }
```

```json
{ "ok": true, "path": "/b.txt" }
```

`copy` accepts files only. `move` and its alias `rename` accept files or folders (rename
is a move).

Errors: `missing src` 400, `missing dst` 400, `invalid path` 400, `not found` 404,
`not a file` 400 (folder with `copy`), `copy failed` 500, `move failed` 500,
`filesystem not ready` 503.

## `DELETE /api/fs/file`

Deletes a file or an empty folder.

```http
DELETE /api/fs/file?path=/test.txt
```

```json
{ "ok": true, "path": "/test.txt" }
```

Errors: `missing path` 400, `invalid path` 400, `not found` 404, `not empty` 409,
`delete failed` 500, `filesystem not ready` 503.
