---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-administration-overview
    name: Overview
    parent: api-administration
    weight: 1
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
  KubeDB Platform site-administration UI: usage analytics, users, organizations, clusters, and
  authentication-source management.
- **Site settings** (`/allowed-domains`, `/disable-registration`, `/branding`) — a
  small set of global settings whose read endpoints are **public** and whose write
  endpoints require site-admin (or org-admin, for branding) authorization.

Almost every write endpoint (and every admin read endpoint) requires **org context**,
supplied via the `?org=<slug>` query parameter, plus a relationship-based
authorization check. The tables on each page state the exact authorization relation
required.

Two admin surfaces: the legacy `/admin` group (administrative-org admins) and `/accounts/admin`
(site-admin console powering the KubeDB Platform admin UI). Both admin groups require Token + org context + authz checks.
(The site-settings routes below are a separate surface whose read endpoints are public — see that table.)

## `/api/v1/admin` (administrative-org admins)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/orgs` | List all organizations |
| GET/POST | `/users` | List / create users |
| PATCH/DELETE | `/users/:username` | Edit / delete a user |
| POST | `/users/:username/update`, `/users/:username/change-password` | Update profile / change password |
| GET/POST | `/users/:username/orgs` | List / create orgs for a user |
| GET | `/users/:uid` | Get user info by ID |

## `/api/v1/accounts/admin` (site admin console)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Usage analytics dashboard |
| GET | `/config` | Site configuration |
| POST | `/config/test_mail` | Send a test email |
| GET | `/monitor` | Site monitor info |
| DELETE | `/delete/inactive-users` | Purge inactive users |
| GET | `/users` | List users |
| GET | `/users/deleted_accounts` | List deleted accounts |
| POST | `/users/deleted_accounts/:id/reactivate` | Reactivate a deleted user |
| POST | `/users/new` | Create a user |
| POST | `/users/:userid` | Edit a user |
| POST | `/users/:userid/delete` | Deactivate a user |
| GET | `/orgs` | List organizations |
| GET | `/orgs/orphaned/` | List orphaned organizations |
| DELETE | `/orgs/orphaned/delete/:id` | Delete an orphaned org |
| GET | `/clusters` | List all clusters |
| GET | `/auths`, `/auths/auth-types` | List authentication sources / types |
| POST | `/auths/new` | Create an authentication source |
| GET/POST | `/auths/:authid`, POST `/auths/:authid/delete` | Manage an auth source |
| GET | `/external_oauth` | List external OAuth2 sources |
| POST | `/external_oauth/new`, `/external_oauth/:provider`, `/external_oauth/:provider/delete` | Manage external OAuth2 sources |

## Site settings (misc, `/api/v1`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/allowed-domains` | Public | List whitelisted email domains |
| POST/PATCH | `/allowed-domains` | Site admin authz | Add / remove a whitelisted domain |
| GET | `/disable-registration` | Public | Get registration enabled/disabled status |
| POST | `/disable-registration` | Site admin authz | Enable/disable new user registration |
| GET | `/branding` | Public | Get branding (logo, app name, colors) |
| POST | `/branding` | Org + authzCheck(edit_branding_options) | Update branding |

## Pages

- [Administrative-Org Admin](../admin-org) — `/api/v1/admin/*`: manage users and their organizations.
- [Site Admin Console](../site-admin-console) — `/api/v1/accounts/admin/*`: dashboard, users, orgs, clusters, auth sources.
- [Site Settings](../site-settings) — `/allowed-domains`, `/disable-registration`, `/branding`.
