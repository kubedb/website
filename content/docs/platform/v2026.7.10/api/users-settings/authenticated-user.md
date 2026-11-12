---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-users-settings-authenticated-user
    name: Authenticated User
    parent: api-users-settings
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Authenticated User

The `/api/v1/user/*` endpoints operate on the currently authenticated user
identified by the request token. All paths on this page are relative to the API root
`/api/v1` (for example, `/user/emails` is `https://<akp-host>/api/v1/user/emails`).

Unless noted otherwise:

- **Auth:** Token — send `Authorization: token <YOUR_TOKEN>`.

A few endpoints require additional privileges (site admin) or are only registered on
AppsCode-hosted deployments; this is called out per endpoint.

---

## Current user & session

### GET /user

Get the authenticated user.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `check_client_org` | string | no | When `"true"`, populate the `clientOrgUser` field on the response. |

**Response:** `200 OK` — a `User` object.

```json
{
  "id": 2,
  "login": "someuser",
  "username": "someuser",
  "full_name": "Some User",
  "email": "user@example.com",
  "avatar_url": "https://secure.gravatar.com/avatar/<hash>?d=identicon",
  "language": "en-US",
  "is_admin": true,
  "last_login": "2026-07-13T18:23:53Z",
  "created": "2026-07-05T06:46:29Z",
  "type": 0,
  "active": true,
  "prohibit_login": false,
  "orgAdmin": false,
  "clientOrgUser": false
}
```

The `User` fields are documented in the
[Public & Basic-auth User APIs](../public-user-apis.md#user-object)
page.

> **Verified:** `GET /user` returned `200` against `appscode` on 2026-07-14.

Example:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/user
```

### GET /user/signout

Sign out the authenticated user (clears session and auth cookies).

- **Auth:** Token.

**Response:** `200 OK` with no body.

### GET /user/firebase-token

Get a Firebase custom auth token for the authenticated user. Only registered on
AppsCode-hosted deployments.

- **Auth:** Token. AppsCode-hosted deployments only.

**Response:** `200 OK` — a `FirebaseToken`.

```json
{
  "firebaseToken": "<firebase-custom-token>"
}
```

> **Verified:** `GET /user/firebase-token` returned `404` against `appscode` on 2026-07-14 — the route is not registered on this (self-hosted) deployment.

---

## NATS credentials

### GET /user/nats/credentials

Get the authenticated user's NATS credentials (endpoints plus credential bytes for
the primary NATS user).

- **Auth:** Token.

**Response:** `200 OK` — a `NatsCredentialsResponse`.

```json
{
  "natsEndpoints": ["nats://nats.example.com:4222"],
  "credentials": "<base64-encoded-creds>"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `natsEndpoints` | array of string | NATS server URLs. |
| `credentials` | string (byte) | Base64-encoded NATS credentials file contents. |

> **Verified:** `GET /user/nats/credentials` returned `200` against `appscode` on 2026-07-14. (Credential bytes redacted above.)

### GET /user/nats/admin_credentials

Get NATS admin credentials. The response body is deployment-specific and modeled as
an opaque JSON object.

- **Auth:** Token + **site admin**.

**Response:** `200 OK` — an opaque object.

> **Verified:** `GET /user/nats/admin_credentials` returned `200` against `appscode` on 2026-07-14 (called with a site-admin token).

### GET /user/nats/user_credentials

Get NATS user credentials. Deployment-specific opaque object.

- **Auth:** Token + **site admin**.

**Response:** `200 OK` — an opaque object.

> **Verified:** `GET /user/nats/user_credentials` returned `302` against `appscode` on 2026-07-14 — the request was redirected (missing required NATS user context on this deployment).

### GET /user/nats/cluster-resource-history

Get cluster resource history from NATS. Deployment-specific opaque object.

- **Auth:** Token + **site admin**.

**Response:** `200 OK` — an opaque object.

> **Verified:** `GET /user/nats/cluster-resource-history` returned `400` against `appscode` on 2026-07-14 — required query parameters (cluster context) were not supplied.

---

## Emails

### GET /user/emails

List the authenticated user's email addresses.

- **Auth:** Token.

**Response:** `200 OK` — an array of `Email` objects.

```json
[
  { "email": "user@example.com", "verified": true, "primary": true }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | The email address. |
| `verified` | boolean | Whether the address is verified. |
| `primary` | boolean | Whether it is the primary address. |

> **Verified:** `GET /user/emails` returned `200` against `appscode` on 2026-07-14.

### POST /user/emails

Add one or more email addresses.

- **Auth:** Token.

**Request body:** `CreateEmailOption`.

```json
{
  "emails": ["user@example.com"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `emails` | array of string | yes | Email addresses to add. |

**Response:** `201 Created` — the updated array of `Email` objects.

### DELETE /user/emails

Delete one or more email addresses.

- **Auth:** Token.

**Request body:** `DeleteEmailOption`.

```json
{
  "emails": ["user@example.com"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `emails` | array of string | yes | Email addresses to remove. |

**Response:** `204 No Content`.

---

## Social follow

### GET /user/followers

List the authenticated user's followers.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | integer | no | Page number of results (1-based). |

**Response:** `200 OK` — an array of `User` objects.

> **Verified:** `GET /user/followers` returned `200` against `appscode` on 2026-07-14.

### GET /user/following

List the users the authenticated user is following.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | integer | no | Page number of results (1-based). |

**Response:** `200 OK` — an array of `User` objects.

> **Verified:** `GET /user/following` returned `200` against `appscode` on 2026-07-14.

### GET /user/following/{username}

Check whether the authenticated user follows the given user.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username to check. |

**Response:** `204 No Content` if following; `404` otherwise.

### PUT /user/following/{username}

Follow a user.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username to follow. |

**Response:** `204 No Content`.

### DELETE /user/following/{username}

Unfollow a user.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `username` | string | Username to unfollow. |

**Response:** `204 No Content`.

---

## Organizations & teams

### GET /user/teams

List all teams the authenticated user belongs to.

- **Auth:** Token.

**Response:** `200 OK` — an array of `Team` objects.

```json
[
  {
    "id": 5,
    "name": "developers",
    "description": "Application developers",
    "permission": "write",
    "type": "",
    "units": [],
    "role_ids": []
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer (int64) | Team ID. |
| `name` | string | Team name. |
| `description` | string | Free-form description. |
| `organization` | Organization | The owning organization. |
| `permission` | string | One of `none`, `read`, `write`, `admin`, `owner`. |
| `units` | array of string | Enabled feature units. |
| `type` | string | Team type. |
| `role_ids` | array of integer | Assigned custom-role IDs. |

> **Verified:** `GET /user/teams` returned `200` against `appscode` on 2026-07-14.

Organization list endpoints for the authenticated user live under settings — see
[GET /user/settings/organizations](../user-settings.md#get-usersettingsorganizations).

---

## Clusters

### GET /user/clusters

List clusters the authenticated user owns or can access.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `all` | string | no | When `"true"`, include clusters the user has access to, not just owned clusters. |

**Response:** `200 OK` — an array of `ClusterInfo` objects.

```json
[
  {
    "id": 1,
    "displayName": "KubeDB Platform Hub",
    "name": "ace",
    "uid": "<uid>",
    "ownerName": "appscode",
    "provider": "generic",
    "kubernetesVersion": "1.29.0",
    "nodeCount": 3,
    "createdAt": "2026-07-05T06:46:29Z"
  }
]
```

Key `ClusterInfo` fields: `id`, `displayName`, `name`, `uid`, `ownerID`/`ownerName`,
`provider`, `vendor`, `kubernetesVersion`, `nodeCount`, `endpoint`, `location`,
`hubClusterName`, `clusterSetName`, `isMonitoringCluster`, `createdAt`, `age`, and a
`status` (a Kubernetes-style object).

> **Verified:** `GET /user/clusters` returned `200` against `appscode` on 2026-07-14. `GET /user/clusters?all=true` returned `302` on 2026-07-14 (redirected — the `all` variant requires session/org context).

---

## Cloud credentials

### GET /user/credentials

List the authenticated user's cloud credentials.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `credential_type` | array of string | no | Filter by one or more credential types. |
| `rancher_endpoint` | string | no | For Rancher credentials, only return those matching this endpoint. |

**Response:** `200 OK` — an array of `CloudCredentialApiForm` objects. Each embeds a
`cloudv1alpha1.CredentialSpec` (a Kubernetes-style object) plus a `creationTimestamp`
field; the credential fields themselves are free-form (provider-specific).

> **Verified:** `GET /user/credentials` returned `200` against `appscode` on 2026-07-14.

### GET /user/credentials/{credName}

Get a single cloud credential by name.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `credName` | string | Name of the cloud credential. |

**Response:** `200 OK` — a `CloudCredentialApiForm` object; `404` if not found.

### POST /user/credentials

Create a cloud credential for the authenticated user.

- **Auth:** Token.

**Request body:** a `cloudv1alpha1.CredentialSpec` — a Kubernetes-style object.
The exact fields are provider-specific; the API passes the object through as an
arbitrary Kubernetes object rather than a fixed schema.

**Response:** `201 Created` with no body.

### PUT /user/credentials

Update a cloud credential for the authenticated user. Registered at the path
`/user/credentials/` (with a trailing slash).

- **Auth:** Token.

**Request body:** a `cloudv1alpha1.CredentialSpec` — a Kubernetes-style object (see
POST above).

**Response:** `204 No Content`.

### DELETE /user/credentials/{credName}

Delete a cloud credential by name.

- **Auth:** Token.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `credName` | string | Name of the cloud credential. |

**Response:** `204 No Content`; `404` if not found.

### GET /user/clouds/{cloud}/buckets

List storage buckets for a cloud provider.

- **Auth:** Token.

> **Note:** Despite being a `GET`, this endpoint is bound to a JSON request body
> (`BucketListOptions`). Either a cloud credential **or** a secret namespace + name
> must be provided, plus a cluster UID. Because it requires a body it was not
> exercised as part of live GET verification.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `cloud` | string | Cloud provider identifier. |

**Request body:** `BucketListOptions`.

```json
{
  "credential": "my-gcs-cred",
  "gce_project": "my-project",
  "cluster_uid": "<uid>",
  "secret_namespace": "",
  "secret_name": "",
  "provider": "gcs"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `credential` | string | one of credential / secret | Cloud credential name. |
| `gce_project` | string | no | GCE project (for GCS). |
| `cluster_uid` | string | yes | Cluster UID for context. |
| `secret_namespace` | string | one of credential / secret | Secret namespace. |
| `secret_name` | string | one of credential / secret | Secret name. |
| `provider` | string | no | Provider identifier. |

**Response:** `200 OK` — a `BucketListResponse`.

```json
{
  "names": ["bucket-a", "bucket-b"]
}
```

---

## Name & email validation

Each validation endpoint returns a `Validation` object whose `Status` is one of
`VALID`, `USER_EXISTS`, `RESERVED`, `INVALID`, or `NOT_ALLOWED`.

### POST /user/validate/username

Validate username availability.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `user_name` | string | no | Username to validate. |

**Response:** `200 OK` — a `Validation` object.

```json
{ "Status": "VALID" }
```

### POST /user/validate/orgname

Validate organization-name availability.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `org` | string | no | Existing organization name (when renaming). |
| `user_name` | string | no | Proposed organization name to validate. |

**Response:** `200 OK` — a `Validation` object.

### POST /user/validate/email

Validate email availability.

- **Auth:** Token.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `email` | string | no | Email address to validate. |

**Response:** `200 OK` — a `Validation` object.

---

## Deployment orders

The high-level design also lists deployment-order endpoints under the authenticated
user (`POST /user/deploy/orders` and the `/user/deploy/orders/{id}/render/*` preview
routes). These are not part of the machine-readable OpenAPI specification for this
group and are therefore not documented in detail here; consult the KubeDB Platform API Server source
(`routers/api/v1`) for their current request/response shapes.
