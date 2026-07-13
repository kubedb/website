---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-users-settings-public-user-apis
    name: Public & Basic-auth User APIs
    parent: api-users-settings
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Public & Basic-auth User APIs

Endpoints for looking up users, a user's organizations, social follow relationships,
managing a user's access tokens over HTTP Basic auth, and public sign-in. All paths
on this page are relative to the API root `/api/v1` (for example, `/users/search` is
`https://<ace-host>/api/v1/users/search`).

Authentication varies per endpoint:

- **Public** — no credentials required.
- **Basic auth** — HTTP Basic authentication (username + password), used by the
  token-management endpoints. A 2FA one-time-password header may also be required.
- **Token** — a personal access token (`Authorization: token <YOUR_TOKEN>`), used by
  the follow-relationship endpoints.

---

## User lookup

### GET /users/search

Search for users by keyword or user ID.

- **Auth:** Public.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `q` | string | no | Keyword to search for. |
| `uid` | integer (int64) | no | ID of a specific user to search for. |
| `limit` | integer | no | Maximum number of users to return. |

**Response:** `200 OK` — a wrapper with an `ok` flag and a `data` array of users.

```json
{
  "ok": true,
  "data": [
    {
      "id": 4,
      "login": "someuser",
      "username": "someuser",
      "full_name": "Some User",
      "email": "user@example.com",
      "avatar_url": "https://secure.gravatar.com/avatar/<hash>?d=identicon",
      "type": 0,
      "active": true,
      "is_admin": false
    }
  ]
}
```

> **Verified:** `GET /users/search?q=a&limit=2` returned `200` against `appscode` on 2026-07-14.

Example:

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/users/search?q=alice&limit=10"
```

(The token is optional here since the endpoint is public.)

### GET /users/{username}

Get the public profile of a single user by username.

- **Auth:** Public.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username. |

**Response:** `200 OK` — a [`User`](#user-object) object; `404` if no such user.

```json
{
  "id": 2,
  "login": "someuser",
  "username": "someuser",
  "full_name": "Some User",
  "email": "user@example.com",
  "avatar_url": "https://secure.gravatar.com/avatar/<hash>?d=identicon",
  "language": "en-US",
  "is_admin": false,
  "type": 0,
  "active": true
}
```

> **Verified:** `GET /users/appscode` returned `200` against `appscode` on 2026-07-14.

### GET /users/{username}/orgs

List the organizations a user belongs to.

- **Auth:** Public.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username. |

**Response:** `200 OK` — an array of [`Organization`](#organization-object) objects.

```json
[
  {
    "id": 1,
    "username": "appscode",
    "full_name": "AppsCode Inc.",
    "avatar_url": "https://secure.gravatar.com/avatar/<hash>?d=identicon",
    "description": "",
    "website": "",
    "location": "",
    "visibility": "public",
    "orgType": 1
  }
]
```

> **Verified:** `GET /users/appscode/orgs` returned `200` against `appscode` on 2026-07-14.

---

## Social follow (public/token)

### GET /users/{username}/followers

List a user's followers.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username. |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | integer | no | Page number of results (1-based). |

**Response:** `200 OK` — an array of [`User`](#user-object) objects.

> **Verified:** `GET /users/appscode/followers` returned `200` against `appscode` on 2026-07-14.

### GET /users/{username}/following

List the users a given user follows.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username. |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | integer | no | Page number of results (1-based). |

**Response:** `200 OK` — an array of [`User`](#user-object) objects.

> **Verified:** `GET /users/appscode/following` returned `200` against `appscode` on 2026-07-14.

### GET /users/{username}/following/{target}

Check whether one user follows another.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | The (possibly) following user. |
| `target` | string | Username of the possibly-followed user. |

**Response:** `204 No Content` if `username` follows `target`; `404` otherwise.

---

## Access tokens over HTTP Basic auth

These endpoints manage a user's personal access tokens using HTTP Basic
authentication. Tokens always belong to the authenticated user.

### GET /users/{username}/tokens

List a user's access tokens.

- **Auth:** Basic auth. A 2FA OTP header may also be required if the account has 2FA
  enabled.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username (must be the authenticated user). |

**Response:** `200 OK` — an array of [`AccessToken`](#accesstoken-object) objects.
Note that `sha1` (the plaintext token) is only ever populated on creation.

```json
[
  {
    "id": 12,
    "name": "ci-token",
    "token_last_eight": "1a2b3c4d"
  }
]
```

### POST /users/{username}/tokens

Create an access token for the authenticated user.

- **Auth:** Basic auth.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username (must be the authenticated user). |

**Request body:** `CreateAccessTokenOption`.

```json
{
  "name": "ci-token"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Human-readable name for the token. |

**Response:** `201 Created` — the created [`AccessToken`](#accesstoken-object). The
plaintext token is returned in `sha1` **only on this response** — store it now, it
cannot be retrieved later.

```json
{
  "id": 13,
  "name": "ci-token",
  "sha1": "<plaintext-token>",
  "token_last_eight": "9f8e7d6c"
}
```

### DELETE /users/{username}/tokens/{id}

Delete one of the authenticated user's access tokens.

- **Auth:** Basic auth.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Account username (must be the authenticated user). |
| `id` | integer (int64) | ID of the access token to delete. |

**Response:** `204 No Content`.

---

## Sign in

### POST /user/signin

Public sign-in with username and password.

- **Auth:** Public. On success, session/CSRF/NATS cookies are set. Accounts enrolled
  in 2FA **cannot** sign in through this endpoint (returns `405`).

**Request body:** `SignInParams`.

```json
{
  "username": "someuser",
  "password": "<password>",
  "remember": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | yes | Account username. |
| `password` | string | yes | Account password. |
| `remember` | boolean | no | Persist the session across browser restarts. |

**Response:** `200 OK` with no body (session cookies set). Other statuses: `404` user
does not exist, `405` login prohibited / user inactive / 2FA enabled, `409` email
already in use, `422` validation error.

---

## Object reference

<a name="user-object"></a>

### User object

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | User ID. |
| `login` | string | The user's username. |
| `username` | string | Backward-compatibility alias of `login`. |
| `full_name` | string | Display name. |
| `email` | string | Primary email. |
| `avatar_url` | string | Avatar image URL. |
| `language` | string | Preferred UI language. |
| `is_admin` | boolean | Whether the user is a site admin. |
| `last_login` | string (date-time) | Last login time. |
| `created` | string (date-time) | Account creation time. |
| `type` | integer | Account type (0 = individual). |
| `active` | boolean | Whether the account is active. |
| `prohibit_login` | boolean | Whether login is disabled. |
| `location` | string | Free-form location. |
| `website` | string | Website URL. |
| `description` | string | Free-form bio. |
| `orgAdmin` | boolean | Whether the user administers the org context. |
| `orgType` | integer | Organization type (for org accounts). |
| `clientOrgUser` | boolean | Whether the user is a client-org user. |

<a name="organization-object"></a>

### Organization object

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Organization ID. |
| `username` | string | Organization slug. |
| `full_name` | string | Display name. |
| `avatar_url` | string | Avatar image URL. |
| `description` | string | Free-form description. |
| `website` | string | Website URL. |
| `location` | string | Free-form location. |
| `rancherManagementClusterEndPoint` | string | Rancher management endpoint, if any. |
| `visibility` | string | `public`, `limited`, or `private`. |
| `orgType` | integer | Organization type. |

<a name="accesstoken-object"></a>

### AccessToken object

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Token ID. |
| `name` | string | Token name. |
| `sha1` | string | Plaintext token value — **returned only on creation**. |
| `token_last_eight` | string | Last eight characters, for identification. |
