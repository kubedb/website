---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-miscellaneous-overview
    name: Overview
    parent: api-miscellaneous
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Miscellaneous

Small utility and infrastructure endpoints exposed by the KubeDB Platform API Server: the server
version, a markdown-to-HTML renderer, the Swagger UI page, a health check, and the
OpenID Connect discovery document. These are all public (no authentication) and back
various parts of the KubeDB Platform web console and its OIDC provider.

Most of these routes live under the `/api/v1` prefix like the rest of the API. Two of
them — the health check and the OIDC discovery document — are served at the **host
root**, not under `/api/v1`; their full paths are documented as-is.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/version` | Public | Server version |
| GET | `/api/v1/swagger` | Public (if enabled) | Swagger UI |
| POST | `/api/v1/markdown`, `/api/v1/markdown/raw` | Public | Render markdown to HTML |
| GET | `/healthz` | Public | Health check (non-API root) |
| GET | `/.well-known/openid-configuration` | Public | OIDC discovery (non-API root) |

Web (non-API) routes also exist for the sign-in/sign-up UI, OAuth2 authorize/token/userinfo endpoints,
account activation & recovery, 2FA/WebAuthn login, and static assets.

## Pages

- [Miscellaneous Endpoints](../miscellaneous) — server version
  (`/api/v1/version`), markdown rendering (`/api/v1/markdown`, `/api/v1/markdown/raw`),
  the Swagger UI (`/api/v1/swagger`), the health check (`/healthz`), and OIDC discovery
  (`/.well-known/openid-configuration`).
