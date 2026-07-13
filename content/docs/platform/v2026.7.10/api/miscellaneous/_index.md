---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-miscellaneous
    name: Miscellaneous
    parent: api
    weight: 180
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Miscellaneous

Small utility and infrastructure endpoints exposed by the `b3` backend: the server
version, a markdown-to-HTML renderer, the Swagger UI page, a health check, and the
OpenID Connect discovery document. These are all public (no authentication) and back
various parts of the ACE web console and its OIDC provider.

Most of these routes live under the `/api/v1` prefix like the rest of the API. Two of
them — the health check and the OIDC discovery document — are served at the **host
root**, not under `/api/v1`; their full paths are documented as-is.

## Pages

- [Miscellaneous Endpoints](../miscellaneous.md) — server version
  (`/api/v1/version`), markdown rendering (`/api/v1/markdown`, `/api/v1/markdown/raw`),
  the Swagger UI (`/api/v1/swagger`), the health check (`/healthz`), and OIDC discovery
  (`/.well-known/openid-configuration`).
