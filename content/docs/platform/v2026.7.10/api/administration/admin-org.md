---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-administration-admin-org
    name: Administrative-Org Admin
    parent: api-administration
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Administrative-Org Admin

User and organization management performed by admins of the platform's
**administrative organization**. All paths below are relative to `/api/v1`.

**Auth:** every endpoint requires a valid token, an organization supplied via the
`?org=<slug>` query parameter, and the `admin_of_administrative_org` authorization
relation. Send the token as a header:

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/admin/orgs?org=appscode"
```

All endpoints accept the common **query parameter**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug providing org context (resolved from `?org=`). |

---

## Organizations

### GET /admin/orgs

List all organizations on the platform.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Response:** `200` — an array of `Organization` objects.

```json
[
  {
    "id": 3,
    "username": "appscode",
    "full_name": "",
    "avatar_url": "https://<ace-host>/accounts/avatars?obj=avatars/3-<hash>",
    "description": "",
    "website": "",
    "location": "",
    "rancherManagementClusterEndPoint": "",
    "visibility": "public",
    "orgType": 6
  }
]
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

---

## Users

### GET /admin/users

List all users on the platform.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Response:** `200` — an array of `User` objects.

```json
[
  {
    "id": 5,
    "login": "example-user",
    "username": "example-user",
    "full_name": "Example User",
    "email": "user@example.com",
    "avatar_url": "https://<ace-host>/accounts/avatars?obj=avatars/5-<hash>",
    "is_admin": false,
    "active": true,
    "type": 0,
    "created": "2026-01-01T00:00:00Z",
    "last_login": "2026-07-01T00:00:00Z"
  }
]
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### POST /admin/users

Create a user.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Request body:** `CreateUserOption`.

```json
{
  "username": "example-user",
  "email": "user@example.com",
  "password": "<password>",
  "full_name": "Example User",
  "login_name": "example-user",
  "source_id": 0,
  "must_change_password": true,
  "send_notify": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | yes | The new user's username. |
| `email` | string | yes | Primary email address. |
| `password` | string | yes | Initial password. |
| `full_name` | string | no | Display name. |
| `login_name` | string | no | External login name (for non-local auth sources). |
| `source_id` | int64 | no | Authentication source ID (0 = built-in). |
| `must_change_password` | boolean | no | Force a password change on first login. |
| `send_notify` | boolean | no | Send a registration notification email. |

- **Response:** `201` — the created `User`.

### PATCH /admin/users/{username}

Edit an existing user.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username of the user to edit. |

- **Request body:** `EditUserOption`.

```json
{
  "email": "user@example.com",
  "full_name": "Example User",
  "active": true,
  "admin": false,
  "prohibit_login": false,
  "allow_create_organization": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | yes | Primary email address. |
| `source_id` | int64 | no | Authentication source ID. |
| `login_name` | string | no | External login name. |
| `full_name` | string | no | Display name. |
| `password` | string | no | New password (if changing). |
| `must_change_password` | boolean | no | Force a password change on next login. |
| `website` | string | no | Website URL. |
| `location` | string | no | Location. |
| `active` | boolean | no | Whether the account is active. |
| `admin` | boolean | no | Grant platform-admin. |
| `allow_git_hook` | boolean | no | Allow git hooks. |
| `allow_import_local` | boolean | no | Allow importing local repositories. |
| `prohibit_login` | boolean | no | Prevent the user from signing in. |
| `allow_create_organization` | boolean | no | Allow the user to create organizations. |

- **Response:** `200` — the updated `User`.

### DELETE /admin/users/{username}

Delete a user.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username of the user to delete. |

- **Response:** `204` — no content.

### POST /admin/users/{username}/update

Update a user's profile as admin.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username of the user to update. |

- **Request body:** `Profile`.

```json
{
  "name": "example-user",
  "full_name": "Example User",
  "email": "user@example.com",
  "keep_email_private": false,
  "website": "https://example.com",
  "location": "Earth",
  "language": "en-US",
  "description": "Platform user"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | no | Username. |
| `full_name` | string | no | Display name. |
| `email` | string | no | Primary email. |
| `keep_email_private` | boolean | no | Hide the email from public profile. |
| `website` | string | no | Website URL. |
| `location` | string | no | Location. |
| `language` | string | no | Preferred language/locale. |
| `description` | string | no | Profile description. |

- **Response:** `200` — the updated `Profile`.

### POST /admin/users/{username}/change-password

Change a user's password as admin.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username of the user. |

- **Request body:** `UpdatePasswordParams`.

```json
{
  "old_password": "<old-password>",
  "password": "<new-password>",
  "retype": "<new-password>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `old_password` | string | no | Current password. |
| `password` | string | no | New password. |
| `retype` | string | no | New password, confirmed. |

- **Response:** `200` — password updated.

### GET /admin/users/{username}/orgs

List the organizations a user belongs to.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username of the user. |

- **Response:** `200` — a list of organizations (the response shape is delegated to
  the org listing handler; it is returned as an untyped JSON object/array).

> **Verified:** `GET` returned `200` against `appscode` (user `appscode`) on 2026-07-14.

### POST /admin/users/{username}/orgs

Create an organization owned by the given user.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username that will own the new organization. |

- **Request body:** `CreateOrgOption`.

```json
{
  "username": "new-org",
  "full_name": "New Org",
  "description": "Example organization",
  "website": "https://example.com",
  "location": "Earth",
  "orgType": "public",
  "visibility": "public"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | yes | Organization slug. |
| `full_name` | string | no | Display name. |
| `description` | string | no | Description. |
| `website` | string | no | Website URL. |
| `location` | string | no | Location. |
| `orgType` | string | no | One of `public` (default), `limited`, `private`. |
| `rancherManagementClusterEndPoint` | string | no | Rancher management cluster endpoint. |
| `visibility` | string | no | One of ``, `public`, `limited`, `private`. |

- **Response:** `201` — the created `Organization`.

### GET /admin/users/{uid}

Get user information by numeric user ID.

- **Auth:** token + `?org=` + `admin_of_administrative_org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `uid` | int64 | Numeric user ID. |

> Note: this shares the `/admin/users/{...}` path with the username-based routes
> above; supply a numeric ID here to look a user up by ID.

- **Response:** `200` — a `User` object.

> **Verified:** returned `404` against `appscode` (uid `1`) on 2026-07-14 — no user with that ID exists; the endpoint is reachable and authorized.
