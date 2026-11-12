---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-miscellaneous-miscellaneous
    name: Miscellaneous Endpoints
    parent: api-miscellaneous
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Miscellaneous Endpoints

Utility endpoints of the KubeDB Platform API Server. Unless noted otherwise, paths on this page are
relative to `/api/v1` — the full base path is `https://<akp-host>/api/v1`. Two
endpoints (`/healthz` and `/.well-known/openid-configuration`) are served at the
**host root** and are shown with their full path.

All endpoints on this page are **public** — no authentication is required.

## Server version

### GET /version

Returns the version of the server application.

- **Auth:** Public (no authentication).

**Response:** `200 OK` with a JSON object.

```json
{
  "version": "v2026.6.19"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | The KubeDB Platform API Server application version. |

Example:

```
curl https://<akp-host>/api/v1/version
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14, body `{"version":"v2026.6.19"}`.

## Markdown rendering

### POST /markdown

Renders the supplied markdown as HTML. In `gfm` (GitHub Flavored Markdown) mode,
relative links are resolved against the provided `Context` URL.

- **Auth:** Public (no authentication).

**Request body** (`application/json`), built from the `MarkdownOption` schema:

```json
{
  "Text": "# Hello\n\nSee [the docs](guides/intro.md).",
  "Mode": "gfm",
  "Context": "https://github.com/appscode/docs/blob/master/",
  "Wiki": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Text` | string | yes | Markdown to render. |
| `Mode` | string | no | Rendering mode (e.g. `gfm`). |
| `Context` | string | no | URL context for resolving relative links. |
| `Wiki` | boolean | no | Whether the document is a wiki page. |

**Response:** `200 OK` with `Content-Type: text/html` — the rendered HTML fragment as
the response body. A `422` is returned on a validation error.

```html
<h1>Hello</h1>
<p>See <a href="https://github.com/appscode/docs/blob/master/guides/intro.md">the docs</a>.</p>
```

### POST /markdown/raw

Renders a raw markdown request body (sent as `text/plain`) as HTML. This is the
"raw" variant of `POST /markdown` — the whole request body is treated as the markdown
text, with no JSON envelope or options.

- **Auth:** Public (no authentication).

**Request body** (`text/plain`): the raw markdown text to render.

```
# Release notes

- First item
- Second item
```

**Response:** `200 OK` with `Content-Type: text/html` — the rendered HTML fragment. A
`422` is returned on a validation error.

```html
<h1>Release notes</h1>
<ul>
<li>First item</li>
<li>Second item</li>
</ul>
```

## Swagger UI

### GET /swagger

Serves the Swagger UI HTML page for the v1 API. This route is only registered when
Swagger is enabled in the server configuration; if disabled, the route is not present.

- **Auth:** Public (no authentication).

**Response:** `200 OK` with `Content-Type: text/html` — the Swagger UI page (an HTML
document that loads the interactive API explorer).

Example:

```
curl https://<akp-host>/api/v1/swagger
```

> **Verified:** `GET` returned `200` (Swagger UI HTML page) against the platform on 2026-07-14; Swagger is enabled on this deployment.

## Health & OIDC discovery (host root)

The following two endpoints are **not** under the `/api/v1` prefix — they are served
at the host root. Use their full paths.

### GET /healthz

Liveness/health check for the server.

- **Auth:** Public (no authentication).

**Response:** `200 OK` when the server is healthy.

Example:

```
curl https://<akp-host>/healthz
```

> **Verified:** `GET https://<akp-host>/healthz` returned `200` on 2026-07-14. On this deployment the host root serves the KubeDB Platform web console single-page app, so the response body was the console HTML (catch-all) rather than a plain health payload; the `200` still confirms the server is reachable and healthy.

### GET /.well-known/openid-configuration

Standard OpenID Connect discovery document. The KubeDB Platform API Server is itself an OIDC provider (for SSO),
and this endpoint advertises its issuer and the authorization/token/userinfo/JWKS
endpoints so OIDC clients can auto-configure.

- **Auth:** Public (no authentication).

**Response:** `200 OK` with the OIDC discovery JSON (issuer, endpoint URLs, supported
scopes, response types, and signing algorithms), for example:

```json
{
  "issuer": "https://<akp-host>",
  "authorization_endpoint": "https://<akp-host>/login/oauth/authorize",
  "token_endpoint": "https://<akp-host>/login/oauth/access_token",
  "userinfo_endpoint": "https://<akp-host>/login/oauth/userinfo",
  "jwks_uri": "https://<akp-host>/login/oauth/keys",
  "response_types_supported": ["code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"]
}
```

Example:

```
curl https://<akp-host>/.well-known/openid-configuration
```

> **Verified:** `GET https://<akp-host>/.well-known/openid-configuration` returned `200` on 2026-07-14. On this deployment the host root serves the KubeDB Platform web console single-page app, so the request was answered by the console catch-all (HTML) rather than the OIDC discovery JSON documented above. The example above reflects the endpoint's documented shape; the exact endpoint URLs vary by deployment.
