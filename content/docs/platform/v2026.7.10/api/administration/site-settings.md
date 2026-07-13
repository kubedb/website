---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-administration-site-settings
    name: Site Settings
    parent: api-administration
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Site Settings

Global platform settings: branding, the email-domain whitelist, and the
new-user-registration toggle. All paths below are relative to `/api/v1`.

**Auth:** each of these settings has a **public** read endpoint (no authentication)
and a write endpoint gated by a site-admin (or, for branding, org-admin)
authorization relation. Write endpoints require org context via `?org=<slug>`.

```
curl https://<ace-host>/api/v1/branding
```

---

## Branding

### GET /branding

Get the current branding configuration (logo, favicons, app name, colors).

- **Auth:** public.
- **Response:** `200` — a `BrandingResponse` object; `304` if not modified.

```json
{
  "logo": "data:image/png;base64,<base64-image>",
  "favicons": { "16x16": "data:image/png;base64,<base64-image>" },
  "primaryColor": "#326ce5",
  "runMode": "prod",
  "deploymentType": "Hosted",
  "isOfflineInstaller": false,
  "showAppTag": true,
  "appName": "ACE"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `logo` | string | Base64-encoded logo image (`data:` URI). |
| `favicons` | object | Map of favicon sizes to base64-encoded images. |
| `primaryColor` | string | Primary UI color (hex). |
| `runMode` | string | Server run mode. |
| `deploymentType` | string | Deployment type (e.g. `Hosted`). |
| `isOfflineInstaller` | boolean | Whether this is an offline-installer deployment. |
| `showAppTag` | boolean | Whether to show the app tag/badge. |
| `appName` | string | Application display name. |

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (logo returned as a base64 `data:image/png` URI).

### POST /branding

Update the branding options.

- **Auth:** token + membership of the organization + `edit_branding_options:org`.
- **Request body:** `BrandingOptions`.

```json
{
  "logo": "data:image/png;base64,<base64-image>",
  "favicon": "data:image/png;base64,<base64-image>",
  "primaryColor": "#326ce5",
  "showAppTag": true,
  "appName": "ACE"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `logo` | string | no | Base64-encoded logo image. |
| `favicon` | string | no | Base64-encoded favicon image. |
| `primaryColor` | string | no | Primary UI color (hex). |
| `showAppTag` | boolean | no | Whether to show the app tag/badge. |
| `appName` | string | no | Application display name. |

- **Response:** `200` — branding options updated. `400` for an invalid branding option.

---

## Allowed email domains

The whitelist of email domains permitted to register on the platform.

### GET /allowed-domains

List the configured email-domain whitelist.

- **Auth:** public.
- **Response:** `200` — an array of domain strings (empty when no whitelist is set).

```json
["example.com", "acme.io"]
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (empty list `[]` — no whitelist configured).

### POST /allowed-domains

Add an email domain to the whitelist.

- **Auth:** token + `?org=` + `edit_allowed_domains:site_admin`.
- **Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug providing org context. |

- **Request body:** `DomainOpts`.

```json
{ "name": "example.com" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | no | The email domain to add. |

- **Response:** `200` — domain added. `400` for an invalid domain name; `409` if the
  domain already exists.

### PATCH /allowed-domains

Remove an email domain from the whitelist.

- **Auth:** token + `?org=` + `edit_allowed_domains:site_admin`.
- **Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug providing org context. |

- **Request body:** `DomainOpts`.

```json
{ "name": "example.com" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | no | The email domain to remove. |

- **Response:** `200` — domain removed. `400` if the domain is not in the whitelist.

---

## User registration

### GET /disable-registration

Get whether new-user registration is disabled.

- **Auth:** public.
- **Response:** `200` — a `RegistrationOpts` object.

```json
{ "disableRegistration": false }
```

| Field | Type | Description |
|-------|------|-------------|
| `disableRegistration` | boolean | `true` if new-user registration is disabled. |

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (`{"disableRegistration":false}`).

### POST /disable-registration

Enable or disable new-user registration.

- **Auth:** token + `?org=` + `update_user_registration:site_admin`.
- **Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug providing org context. |

- **Request body:** `RegistrationOpts`.

```json
{ "disableRegistration": true }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `disableRegistration` | boolean | no | Set to `true` to disable new-user registration. |

- **Response:** `200` — registration status updated.
