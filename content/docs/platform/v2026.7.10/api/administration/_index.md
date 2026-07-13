---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-administration
    name: Administration
    parent: api
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Administration

The Administration APIs cover two admin surfaces plus the platform's site-settings
routes. All paths are served under the `/api/v1` prefix.

- **Administrative-org admin** (`/api/v1/admin/*`) — user and organization management
  performed by admins of the platform's administrative organization.
- **Site admin console** (`/api/v1/accounts/admin/*`) — the endpoints powering the
  ACE site-administration UI: usage analytics, users, organizations, clusters, and
  authentication-source management.
- **Site settings** (`/allowed-domains`, `/disable-registration`, `/branding`) — a
  small set of global settings whose read endpoints are **public** and whose write
  endpoints require site-admin (or org-admin, for branding) authorization.

Almost every write endpoint (and every admin read endpoint) requires **org context**,
supplied via the `?org=<slug>` query parameter, plus a relationship-based
authorization check. The tables on each page state the exact authorization relation
required.

## Pages

- [Administrative-Org Admin](../admin-org.md) — `/api/v1/admin/*`: manage users and their organizations.
- [Site Admin Console](../site-admin-console.md) — `/api/v1/accounts/admin/*`: dashboard, users, orgs, clusters, auth sources.
- [Site Settings](../site-settings.md) — `/allowed-domains`, `/disable-registration`, `/branding`.
