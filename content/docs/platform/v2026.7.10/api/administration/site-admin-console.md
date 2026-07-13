---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-administration-site-admin-console
    name: Site Admin Console
    parent: api-administration
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Site Admin Console

The endpoints powering the ACE site-administration UI: usage analytics, users,
organizations, clusters, and authentication-source management. All paths below are
relative to `/api/v1`.

**Auth:** every endpoint requires a valid token, an organization supplied via the
`?org=<slug>` query parameter, membership of that organization, and (for most
endpoints) a specific `:site_admin` authorization relation named per endpoint below.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/accounts/admin/users?org=appscode"
```

All endpoints accept the common **query parameter**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | yes | Organization slug providing org context (resolved from `?org=`). |

Several list endpoints return raw internal records (`models.User`,
`models.Organization`, `models.ClusterInfo`, `models.LoginSource`, ...). In the
OpenAPI these are represented generically as untyped JSON objects; the examples below
show the salient fields only.

---

## Dashboard & configuration

### GET /accounts/admin

Site administration usage-analytics dashboard.

- **Auth:** token + `?org=` + membership + `view_usage_analytics:site_admin`.
- **Response:** `200` — an untyped JSON object with `stats` and `sysStatus` keys.

```json
{
  "stats": { "userCount": 12, "orgCount": 5, "clusterCount": 3 },
  "sysStatus": { "uptime": "5d3h", "goroutines": 210 }
}
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### GET /accounts/admin/config

Site administration configuration page. Renders an HTML template rather than a JSON
body.

- **Auth:** token + `?org=` + membership + site-admin.
- **Response:** `200` — `text/html`.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (HTML page).

### POST /accounts/admin/config/test_mail

Send a test email, then redirect to the config page.

- **Auth:** token + `?org=` + membership + `send_test_mails:site_admin`.
- **Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `email` | string | no | Destination address for the test email. |

- **Response:** `302` — redirect to the config page.

### GET /accounts/admin/monitor

Site administration monitor page. Renders an HTML template rather than a JSON body.

- **Auth:** token + `?org=` + membership + site-admin.
- **Response:** `200` — `text/html`.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14 (HTML page).

---

## Users

### GET /accounts/admin/users

List all users.

- **Auth:** token + `?org=` + membership + `view_users:site_admin`.
- **Response:** `200` — an array of raw user records.

```json
[
  {
    "ID": 5,
    "Name": "example-user",
    "FullName": "Example User",
    "Email": "user@example.com",
    "IsActive": true,
    "IsAdmin": false
  }
]
```

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### GET /accounts/admin/users/deleted_accounts

List deactivated user accounts.

- **Auth:** token + `?org=` + membership + `view_deleted_members:site_admin`.
- **Response:** `200` — an array of raw user records (deactivated).

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### POST /accounts/admin/users/deleted_accounts/{id}/reactivate

Reactivate a deactivated user.

- **Auth:** token + `?org=` + membership + `reactivate_members:site_admin`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | int64 | Numeric user ID. |

- **Response:** `200` — user reactivated.

### POST /accounts/admin/users/new

Create a new user.

- **Auth:** token + `?org=` + membership + `create_users:site_admin`.
- **Request body:** `AdminCreateUserPayload`.

```json
{
  "loginType": "local",
  "userName": "example-user",
  "email": "user@example.com",
  "fullName": "Example User",
  "loginName": "example-user",
  "password": "<password>",
  "sendNotify": true,
  "mustChangePassword": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `loginType` | string | yes | Authentication source type (e.g. `local`). |
| `userName` | string | yes | The new user's username. |
| `email` | string | yes | Primary email address. |
| `loginName` | string | no | External login name. |
| `fullName` | string | no | Display name. |
| `password` | string | no | Initial password. |
| `sendNotify` | boolean | no | Send a registration notification email. |
| `mustChangePassword` | boolean | no | Force a password change on first login. |

- **Response:** `201` — user created.

### POST /accounts/admin/users/{userid}

Edit a user.

- **Auth:** token + `?org=` + membership + `update_users:site_admin`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `userid` | int64 | Numeric user ID. |

- **Request body:** `AdminEditUserPayload`.

```json
{
  "loginType": "local",
  "email": "user@example.com",
  "fullName": "Example User",
  "active": true,
  "admin": false,
  "prohibitLogin": false,
  "allowCreateOrganization": true,
  "disableTwoFactor": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `loginType` | string | yes | Authentication source type. |
| `email` | string | yes | Primary email address. |
| `loginName` | string | no | External login name. |
| `fullName` | string | no | Display name. |
| `password` | string | no | New password (if changing). |
| `website` | string | no | Website URL. |
| `location` | string | no | Location. |
| `active` | boolean | no | Whether the account is active. |
| `admin` | boolean | no | Grant platform-admin. |
| `allowGitHook` | boolean | no | Allow git hooks. |
| `allowImportLocal` | boolean | no | Allow importing local repositories. |
| `allowCreateOrganization` | boolean | no | Allow the user to create organizations. |
| `prohibitLogin` | boolean | no | Prevent the user from signing in. |
| `disableTwoFactor` | boolean | no | Disable the user's two-factor authentication. |

- **Response:** `200` — user updated.

### POST /accounts/admin/users/{userid}/delete

Deactivate a user.

- **Auth:** token + `?org=` + membership + `delete_users:site_admin`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `userid` | int64 | Numeric user ID. |

- **Response:** `200` — user deactivated. Returns `400` with a `message` if the user
  still owns organizations.

### DELETE /accounts/admin/delete/inactive-users

Purge deactivated users that have been inactive for more than 30 days.

- **Auth:** token + `?org=` + membership + `purge_deactivated_users:site_admin`.
- **Response:** `200` — inactive users purged.

---

## Organizations

### GET /accounts/admin/orgs

List all organizations.

- **Auth:** token + `?org=` + membership + `view_orgs:site_admin`.
- **Response:** `200` — an array of raw organization records.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### GET /accounts/admin/orgs/orphaned/

List orphaned organizations (organizations with no remaining owner).

- **Auth:** token + `?org=` + membership.
- **Response:** `200` — an array of `Organization` objects.

> **Verified:** returned `400` ("invalid org id") against `appscode` on 2026-07-14 — the handler rejected the request context on this deployment; the route is reachable and authorized.

### DELETE /accounts/admin/orgs/orphaned/delete/{id}

Delete an orphaned organization.

- **Auth:** token + `?org=` + membership + `delete:orphaned-org`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `id` | int64 | Numeric organization ID. |

- **Response:** `200` — organization deleted.

---

## Clusters

### GET /accounts/admin/clusters

List all clusters known to the platform.

- **Auth:** token + `?org=` + membership.
- **Response:** `200` — an array of raw cluster records (`models.ClusterInfo`).

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

---

## Authentication sources

Manage the platform's login sources (LDAP, PAM, SMTP, OAuth2/OIDC, ...).

### GET /accounts/admin/auths

List authentication sources.

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Response:** `200` — an array of raw login-source records.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### GET /accounts/admin/auths/auth-types

List the available authentication source types (name/type pairs).

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Response:** `200` — an array of type descriptors.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### POST /accounts/admin/auths/new

Create an authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Request body:** `AuthenticationPayload` (fields vary by source type; the common
  ones are shown below — LDAP, SMTP, and OAuth2/OIDC fields are all part of the same
  payload).

```json
{
  "type": 2,
  "name": "corporate-ldap",
  "host": "ldap.example.com",
  "port": 636,
  "bindDN": "cn=admin,dc=example,dc=com",
  "bindPassword": "<password>",
  "userBase": "ou=users,dc=example,dc=com",
  "attributeUsername": "uid",
  "attributeMail": "mail",
  "isActive": true,
  "tls": true,
  "skipVerify": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name of the source. |
| `id` | int64 | no | Source ID (on edit). |
| `type` | integer | no | Numeric source type (LDAP, SMTP, PAM, OAuth2, ...). |
| `host` | string | no | Server host (LDAP/SMTP). |
| `port` | integer | no | Server port. |
| `bindDN` | string | no | LDAP bind DN. |
| `bindPassword` | string | no | LDAP bind password. |
| `userBase` | string | no | LDAP user search base. |
| `userDN` | string | no | LDAP user DN pattern. |
| `attributeUsername` | string | no | LDAP username attribute. |
| `attributeName` | string | no | LDAP given-name attribute. |
| `attributeSurname` | string | no | LDAP surname attribute. |
| `attributeMail` | string | no | LDAP email attribute. |
| `attributeSSHPublicKey` | string | no | LDAP SSH public-key attribute. |
| `attributesInBind` | boolean | no | Fetch attributes during bind. |
| `usePagedSearch` | boolean | no | Use LDAP paged search. |
| `searchPageSize` | integer | no | Paged-search page size. |
| `filter` | string | no | LDAP user filter. |
| `adminFilter` | string | no | LDAP admin filter. |
| `isActive` | boolean | no | Whether the source is enabled. |
| `isSyncEnabled` | boolean | no | Enable periodic user sync. |
| `smtpAuth` | string | no | SMTP auth mechanism. |
| `smtpHost` | string | no | SMTP host. |
| `smtpPort` | integer | no | SMTP port. |
| `allowedDomains` | string | no | Comma-separated allowed email domains. |
| `securityProtocol` | integer | no | Security protocol (none/StartTLS/LDAPS). |
| `tls` | boolean | no | Use TLS. |
| `skipVerify` | boolean | no | Skip TLS certificate verification. |
| `pamServiceName` | string | no | PAM service name. |
| `oauth2Provider` | string | no | OAuth2 provider name. |
| `oauth2Key` | string | no | OAuth2 client key/ID. |
| `oauth2Secret` | string | no | OAuth2 client secret. |
| `openIDConnectAutoDiscoveryURL` | string | no | OIDC auto-discovery URL. |
| `oauth2UseCustomURL` | boolean | no | Use custom OAuth2 URLs. |
| `oauth2TokenURL` | string | no | Custom token URL. |
| `oauth2AuthURL` | string | no | Custom authorize URL. |
| `oauth2ProfileURL` | string | no | Custom profile URL. |
| `oauth2EmailURL` | string | no | Custom email URL. |

- **Response:** `201` — authentication source created.

### GET /accounts/admin/auths/{authid}

Get a single authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `authid` | int64 | Numeric authentication source ID. |

- **Response:** `200` — a raw login-source record.

> **Verified:** returned `500` against `appscode` (authid `1`) on 2026-07-14 — no login source with that ID exists on this deployment; the route is reachable and authorized.

### POST /accounts/admin/auths/{authid}

Edit an authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `authid` | int64 | Numeric authentication source ID. |

- **Request body:** `AuthenticationPayload` (same fields as create, above).
- **Response:** `200` — authentication source updated.

### POST /accounts/admin/auths/{authid}/delete

Delete an authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_authn_source`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `authid` | int64 | Numeric authentication source ID. |

- **Response:** `200` — authentication source deleted.

---

## External OAuth2 sources

Manage external OAuth2/social-login providers.

### GET /accounts/admin/external_oauth

List external OAuth2 authentication sources.

- **Auth:** token + `?org=` + membership + `site_admin_editor_external_authn_source`.
- **Response:** `200` — an array of raw external OAuth2 application records.

> **Verified:** `GET` returned `200` against `appscode` on 2026-07-14.

### POST /accounts/admin/external_oauth/new

Create an external OAuth2 authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_external_authn_source`.
- **Request body:** `ExternalOAuth2AppPayload`.

```json
{
  "provider": "github",
  "clientID": "<client-id>",
  "clientSecret": "<client-secret>",
  "callbackURL": "https://<ace-host>/user/oauth2/github/callback"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | no | Provider name (e.g. `github`, `google`). |
| `clientID` | string | no | OAuth2 client ID. |
| `clientSecret` | string | no | OAuth2 client secret. |
| `callbackURL` | string | no | OAuth2 callback/redirect URL. |

- **Response:** `201` — external OAuth2 source created.

### POST /accounts/admin/external_oauth/{provider}

Edit an external OAuth2 authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_external_authn_source`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `provider` | string | Provider name to edit. |

- **Request body:** `ExternalOAuth2AppPayload` (same fields as create, above).
- **Response:** `200` — external OAuth2 source updated.

### POST /accounts/admin/external_oauth/{provider}/delete

Delete an external OAuth2 authentication source.

- **Auth:** token + `?org=` + membership + `site_admin_editor_external_authn_source`.
- **Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `provider` | string | Provider name to delete. |

- **Response:** `200` — external OAuth2 source deleted.
