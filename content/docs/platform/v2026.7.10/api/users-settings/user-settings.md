---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-users-settings-user-settings
    name: User Settings
    parent: api-users-settings
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# User Settings

The `/api/v1/user/settings/*` endpoints back the account-settings screens: profile
and avatar, password and account emails, two-factor and WebAuthn security, active
sessions, personal access and NATS tokens, and OAuth2 applications. All paths on this
page are relative to the API root `/api/v1` (for example, `/user/settings/profile`
is `https://<akp-host>/api/v1/user/settings/profile`).

Unless noted otherwise:

- **Auth:** Token — send `Authorization: token <YOUR_TOKEN>`.

---

## Profile & avatar

### GET /user/settings/profile

Get the authenticated user's editable profile.

- **Auth:** Token.

**Response:** `200 OK` — a `Profile` object.

```json
{
  "name": "someuser",
  "full_name": "Some User",
  "email": "user@example.com",
  "keep_email_private": false,
  "website": "",
  "location": "",
  "language": "en-US",
  "description": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Username. |
| `full_name` | string | Display name. |
| `email` | string | Primary email. |
| `keep_email_private` | boolean | Hide email from public profile. |
| `website` | string | Website URL. |
| `location` | string | Free-form location. |
| `language` | string | Preferred UI language. |
| `description` | string | Free-form bio. |

> **Verified:** `GET /user/settings/profile` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/profile

Update the authenticated user's profile.

- **Auth:** Token.

**Request body:** a `Profile` object (same fields as above).

**Response:** `200 OK` — the updated `Profile` object.

### GET /user/settings/avatar

Get the authenticated user's avatar settings.

- **Auth:** Token.

**Response:** `200 OK` — an `AvatarParams` object.

```json
{
  "source": "gravatar",
  "gravatar": "user@example.com",
  "federavatar": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `source` | string | Avatar source (e.g. `gravatar`, `local`). |
| `gravatar` | string | Gravatar email/hash. |
| `federavatar` | boolean | Whether federated (libravatar) is enabled. |

> **Verified:** `GET /user/settings/avatar` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/avatar

Update the authenticated user's avatar.

- **Auth:** Token.
- **Content type:** `multipart/form-data` (`AvatarParams`), with an `avatar` file
  field for uploads plus the `source`, `gravatar`, and `federavatar` fields.

**Response:** `200 OK` with no body.

### POST /user/settings/avatar/delete

Delete the authenticated user's avatar.

- **Auth:** Token.

**Response:** `200 OK` with no body.

---

## Account: password, email, deletion

### POST /user/settings/account/password

Update the authenticated user's password.

- **Auth:** Token.

**Request body:** `UpdatePasswordParams`.

```json
{
  "old_password": "<current-password>",
  "password": "<new-password>",
  "retype": "<new-password>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `old_password` | string | yes | Current password. |
| `password` | string | yes | New password. |
| `retype` | string | yes | New password, repeated for confirmation. |

**Response:** `200 OK` with no body.

### GET /user/settings/account/email

Get the authenticated user's email-address records. Returns the raw
`models.EmailAddress` records, modeled as an array of opaque objects.

- **Auth:** Token.

**Response:** `200 OK` — an array of opaque email-address records.

> **Verified:** the sibling [`GET /user/emails`](../authenticated-user.md#get-useremails) returned `200`; this settings variant returns the same underlying records in raw form.

### POST /user/settings/account/email

Add an email address, or make an existing one primary.

- **Auth:** Token.

With `?_method=PRIMARY&id=<id>`, marks the existing email with that ID as primary.
Otherwise, adds the email supplied in the body.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `_method` | string | no | Set to `PRIMARY` to mark an existing email as primary. |
| `id` | integer (int64) | no | Email address ID (used with `_method=PRIMARY`). |

**Request body:** `AddEmailParams`.

```json
{ "email": "user@example.com" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | yes (when adding) | Email address to add. |

**Response:** `200 OK` (with or without a string body).

### POST /user/settings/account/email/delete

Delete an email address.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `id` | integer (int64) | no | ID of the email address to delete. |

**Response:** `200 OK` with no body.

### POST /user/settings/account/delete

Delete the authenticated user's account. Requires the current password and signs the
user out on success.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `password` | string | no | Current password, for confirmation. |

**Response:** `200 OK` — account deleted and user signed out.

---

## Pagination preferences

### GET /user/settings/pagination

Get the authenticated user's per-UI pagination page-size settings.

- **Auth:** Token.

**Response:** `200 OK` — a `Pagination` object.

```json
{
  "kubeDBUI": 0,
  "consoleUI": 0,
  "platformUI": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `kubeDBUI` | integer (int64) | Page size for the KubeDB UI. |
| `consoleUI` | integer (int64) | Page size for the console UI. |
| `platformUI` | integer (int64) | Page size for the platform UI. |

> **Verified:** `GET /user/settings/pagination` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/pagination

Update the authenticated user's pagination settings.

- **Auth:** Token.

**Request body:** a `Pagination` object (fields as above).

**Response:** `200 OK` — the updated `Pagination` object.

---

## Security: two-factor authentication

### GET /user/settings/security/

Get the two-factor enrollment status.

- **Auth:** Token.

**Response:** `200 OK` — a `TwoFAStatus` object.

```json
{ "twoFAEnrolled": false }
```

> **Verified:** `GET /user/settings/security/` returned `200` against `appscode` on 2026-07-14.

### GET /user/settings/security/twofa/enroll

Begin two-factor enrollment: generate a TOTP secret and QR image.

- **Auth:** Token.

**Response:** `200 OK` — a `Security` object.

```json
{
  "twoFASecret": "<totp-secret>",
  "twoFAImageURL": "data:image/png;base64,<...>"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `twoFASecret` | string | TOTP secret to add to an authenticator app. |
| `twoFAImageURL` | string | `data:image/png;base64` encoded QR code. |

> **Verified:** `GET /user/settings/security/twofa/enroll` returned `200` against `appscode` on 2026-07-14. (Secret redacted above.)

### POST /user/settings/security/twofa/enroll

Complete two-factor enrollment by submitting a TOTP passcode.

- **Auth:** Token.

**Request body:** `TwoFactorAuthParams`.

```json
{ "passCode": "123456" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `passCode` | string | yes | TOTP passcode from the authenticator app. |

**Response:** `200 OK` — a scratch token string (store it safely for account recovery).

### POST /user/settings/security/twofa/regenerate_scratch

Regenerate the two-factor scratch (recovery) token.

- **Auth:** Token.

**Response:** `200 OK` — a new scratch token string.

### POST /user/settings/security/twofa/disable

Disable two-factor authentication.

- **Auth:** Token.

**Response:** `200 OK` with no body.

---

## Security: WebAuthn keys

### GET /user/settings/security/webauthn/keys

List the authenticated user's registered WebAuthn security keys.

- **Auth:** Token.

**Response:** `200 OK` — an array of `WebAuthnSecurityKeys` objects.

```json
[
  { "ID": 1, "Name": "yubikey-5", "UID": 2 }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `ID` | integer (int64) | Key ID. |
| `Name` | string | User-assigned key name. |
| `UID` | integer (int64) | Owning user ID. |

> **Verified:** `GET /user/settings/security/webauthn/keys` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/security/webauthn/request_register

Begin WebAuthn registration; reserves a credential name and returns the WebAuthn
credential-creation options.

- **Auth:** Token.

**Request body:** `WebauthnRegistrationOptions`.

```json
{ "name": "yubikey-5" }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Name for the new security key. |

**Response:** `200 OK` — the WebAuthn credential-creation options (an opaque,
protocol-defined object passed to the browser's WebAuthn API).

### POST /user/settings/security/webauthn/register

Complete WebAuthn registration. Reads the security-key response (the authenticator's
attestation) from the request body.

- **Auth:** Token.

**Response:** `201 Created` — the created credential (an opaque, protocol-defined
object).

### DELETE /user/settings/security/webauthn/keys/{id}

Delete a WebAuthn security key.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | ID of the WebAuthn security key. |

**Response:** `200 OK` with no body; `404` if not found.

---

## Security: sessions

### GET /user/settings/security/sessions/

List the authenticated user's active sessions.

- **Auth:** Token.

**Response:** `200 OK` — an array of `SessionInfoAPIForm` objects. Each embeds an
opaque go-macaron session record plus the fields below.

```json
[
  {
    "isActiveSession": true,
    "lastAccessedZonedTime": "2026-07-13T18:23:53Z",
    "lastAccessed": 1768329833
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `isActiveSession` | boolean | Whether this is the current session. |
| `lastAccessedZonedTime` | string | Last access time (formatted). |
| `lastAccessed` | integer (int64) | Last access time (Unix). |

> **Verified:** `GET /user/settings/security/sessions/` returned `302` against `appscode` on 2026-07-14 — this endpoint relies on the web-console session cookie and redirects when called with a bare token.

### DELETE /user/settings/security/sessions/{sid}/revoke

Revoke a session.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `sid` | string | Session ID to revoke. |

**Response:** `200 OK` — the remaining array of `SessionInfoAPIForm` objects;
`404` if the session is not found.

---

## Security: linked accounts

### GET /user/settings/security/account_link

List linked external (OAuth2/login-source) accounts.

- **Auth:** Token.

**Response:** `200 OK` — an array of `AccountLink` objects.

```json
[
  {
    "loginSourceID": 3,
    "externalID": "<external-id>",
    "type": 6,
    "providerDisplayName": "GitHub",
    "isActived": true,
    "isSyncEnabled": false
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `loginSourceID` | integer (int64) | Login-source ID. |
| `externalID` | string | External account identifier. |
| `type` | integer | Login-source type. |
| `providerDisplayName` | string | Human-readable provider name. |
| `isActived` | boolean | Whether the link is active. |
| `isSyncEnabled` | boolean | Whether group/attribute sync is enabled. |

> **Verified:** `GET /user/settings/security/account_link` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/security/account_link

Remove a linked external account. (Despite the `POST` verb, this deletes the link.)

- **Auth:** Token.

**Request body:** `AccountLinkParams`.

```json
{
  "loginSourceID": 3,
  "externalID": "<external-id>"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `loginSourceID` | integer (int64) | yes | Login-source ID of the link. |
| `externalID` | string | yes | External account identifier. |

**Response:** `200 OK` with no body.

---

## Organizations

<a name="get-usersettingsorganizations"></a>

### GET /user/settings/organizations

List the authenticated user's organizations.

- **Auth:** Token.

**Response:** `200 OK` — an array of `Organization` objects (fields documented on the
[Public & Basic-auth User APIs](../public-user-apis.md#organization-object)
page).

> **Verified:** `GET /user/settings/organizations` returned `200` against `appscode` on 2026-07-14.

### GET /user/settings/organizations/create

Check whether the authenticated user is allowed to create organizations.

- **Auth:** Token.

**Response:** `200 OK` if allowed; `403` if not.

> **Verified:** `GET /user/settings/organizations/create` returned `200` against `appscode` on 2026-07-14 (this user may create organizations).

### POST /user/settings/organizations/create

Create an organization.

- **Auth:** Token.
- **Content type:** `multipart/form-data` (`CreateOrgParams`).

**Request body fields (`CreateOrgParams`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orgName` | string | yes | Organization slug. |
| `orgFullName` | string | no | Display name. |
| `description` | string | no | Free-form description. |
| `website` | string | no | Website URL. |
| `location` | string | no | Free-form location. |
| `orgType` | string | no | Organization type. |
| `rancherManagementClusterEndPoint` | string | no | Rancher management endpoint. |
| `provideSyncToken` | boolean | no | Whether a Rancher sync token is supplied. |
| `rancherSyncToken` | object | no | Rancher access key pair. |
| `visibility` | string | no | `public`, `limited`, or `private`. |
| `source` / `avatar` / `gravatar` / `federavatar` | mixed | no | Avatar settings (with `avatar` as a file upload). |

**Response:** `200 OK` — an `ApiResponseMessage` (`{ "message": "..." }`), which may
carry a note about Rancher sync.

---

## Personal access tokens (settings)

### GET /user/settings/tokens/access-tokens/

List the authenticated user's personal access tokens.

- **Auth:** Token.

**Response:** `200 OK` — an array of `SettingsAccessToken` objects.

```json
[
  {
    "id": 1,
    "uid": 2,
    "name": "ci-token",
    "tokenLastEight": "1a2b3c4d",
    "createdAt": 1768329833,
    "updatedAt": 1768329833,
    "hasRecentActivity": true,
    "hasUsed": true,
    "expDate": 0
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Token ID. |
| `uid` | integer (int64) | Owning user ID. |
| `name` | string | Token name. |
| `token` | string | Plaintext token — **returned only on creation**. |
| `tokenLastEight` | string | Last eight characters, for identification. |
| `createdAt` / `updatedAt` | integer (int64) | Unix timestamps. |
| `hasRecentActivity` | boolean | Whether the token was used recently. |
| `hasUsed` | boolean | Whether the token has ever been used. |
| `expDate` | integer (int64) | Expiry (Unix seconds); `0` means no expiry. |

> **Verified:** `GET /user/settings/tokens/access-tokens/` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/tokens/access-tokens/

Create a new personal access token.

- **Auth:** Token.

**Request body:** `NewAccessTokenParam`.

```json
{
  "name": "ci-token",
  "expTime": 0
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Token name. |
| `expTime` | integer (int64) | no | Unix expiry timestamp; `0` means no expiry. |

**Response:** `201 Created` — a `SettingsAccessToken`. The plaintext value is returned
in `token` **only on this response**.

### POST /user/settings/tokens/access-tokens/delete-records

Bulk-delete access tokens by ID.

- **Auth:** Token.

**Request body:** `AccessTokenIdList`.

```json
{ "tokenIDs": [1, 2, 3] }
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tokenIDs` | array of integer (int64) | yes | IDs of tokens to delete. |

**Response:** `200 OK` — a message describing how many records were deleted
(`{ "message": "..." }`).

### DELETE /user/settings/tokens/access-tokens/{id}

Delete a single access token.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | ID of the access token to delete. |

**Response:** `200 OK` with no body; `404` if not found.

---

## NATS tokens (settings)

### GET /user/settings/tokens/nats-tokens/

List the authenticated user's NATS user-type tokens (returned as an array of opaque
NATS token-account objects).

- **Auth:** Token.

**Response:** `200 OK` — an array of opaque objects.

> **Verified:** `GET /user/settings/tokens/nats-tokens/` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/tokens/nats-tokens/{id}/revoke/

Revoke a NATS user-type token.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | ID of the NATS token to revoke. |

**Response:** `200 OK` with no body; `404` if not found.

---

## OAuth2 applications

### GET /user/settings/applications/oauth2

List the authenticated user's OAuth2 applications.

- **Auth:** Token.

**Response:** `200 OK` — an array of `OAuth2Application` objects.

```json
[
  {
    "id": 1,
    "uid": 2,
    "name": "my-app",
    "clientId": "<client-id>",
    "redirectURIs": ["https://app.example.com/callback"],
    "createdAt": 1768329833,
    "updatedAt": 1768329833
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Application ID. |
| `uid` | integer (int64) | Owning user ID. |
| `name` | string | Application name. |
| `clientId` | string | OAuth2 client ID. |
| `clientSecret` | string | Plaintext secret — **returned only on create/regenerate**. |
| `clientSecretHash` | string | Stored secret hash. |
| `redirectURIs` | array of string | Allowed redirect URIs. |
| `logo` | string | Logo URL. |
| `createdAt` / `updatedAt` | integer (int64) | Unix timestamps. |

> **Verified:** `GET /user/settings/applications/oauth2` returned `200` against `appscode` on 2026-07-14.

### POST /user/settings/applications/oauth2

Create an OAuth2 application.

- **Auth:** Token.

**Request body:** `OAuth2ApplicationParams`.

```json
{
  "name": "my-app",
  "redirectUri": "https://app.example.com/callback"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Application name. |
| `redirectUri` | string | yes | Redirect URI. |
| `logo` | file | no | Logo file (multipart, on update). |

**Response:** `200 OK` — the created `OAuth2Application`, including the plaintext
`clientSecret` (**shown only on this response**).

### GET /user/settings/applications/oauth2/{id}

Get a single OAuth2 application.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Application ID. |

**Response:** `200 OK` — an `OAuth2Application`; `404` if not found.

### PUT /user/settings/applications/oauth2/{id}

Update an OAuth2 application.

- **Auth:** Token.
- **Content type:** `multipart/form-data` (`OAuth2ApplicationParams`, which may
  include a `logo` file).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Application ID. |

**Response:** `200 OK` — the updated `OAuth2Application`.

### DELETE /user/settings/applications/oauth2/{id}

Delete an OAuth2 application.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Application ID. |

**Response:** `200 OK` with no body; `404` if not found.

### POST /user/settings/applications/oauth2/{id}/regenerate_secret

Regenerate an OAuth2 application's client secret.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | Application ID. |

**Response:** `200 OK` — the new client-secret string.

### POST /user/settings/applications/oauth2/{id}/revoke

Revoke an OAuth2 grant. Here `{id}` is the **grant** ID (not the application ID).

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | integer (int64) | ID of the OAuth2 grant to revoke. |

**Response:** `200 OK` with no body.

### GET /user/settings/applications/oauth2/grants

List the authenticated user's OAuth2 grants (authorizations the user has given to
applications).

- **Auth:** Token.

**Response:** `200 OK` — an array of `OAuth2Grant` objects.

```json
[
  {
    "id": 1,
    "userId": 2,
    "applicationId": 1,
    "applicationName": "my-app",
    "counter": 4,
    "createdAt": 1768329833,
    "updatedAt": 1768329833
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Grant ID. |
| `userId` | integer (int64) | Granting user ID. |
| `applicationId` | integer (int64) | Application ID. |
| `applicationName` | string | Application name. |
| `logo` | string | Application logo URL. |
| `counter` | integer (int64) | Usage counter. |
| `createdAt` / `updatedAt` | integer (int64) | Unix timestamps. |

> **Verified:** `GET /user/settings/applications/oauth2/grants` returned `200` against `appscode` on 2026-07-14.
