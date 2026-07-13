---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-organizations-teams-organizations
    name: Organizations
    parent: api-organizations-teams
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Organizations

Endpoints for creating and managing organizations, their members, avatars, Rancher
integration tokens, and organization-scoped access/NATS tokens.

All paths below are relative to the API root `/api/v1`. For example, `GET /orgs/{orgname}`
is `GET https://<ace-host>/api/v1/orgs/{orgname}`. In these paths `orgname` is the
organization slug (e.g. `appscode`).

Unless noted, authenticated endpoints accept a personal access token:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/orgs/appscode
```

Authorization checks (e.g. `edit:org`, `admin:org`, `view:avatar`) are
relationship-based (OpenFGA) and evaluated against the caller's role in the
organization.

## Organization lifecycle

### POST /orgs

Create a new organization owned by the authenticated user.

- **Auth:** token. The user must be permitted to create organizations
  (`CanCreateOrganization`); otherwise `403` is returned.

**Request body** (`CreateOrgOption`):

```json
{
  "username": "acme",
  "full_name": "Acme Inc.",
  "description": "Acme engineering org",
  "website": "https://acme.example.com",
  "location": "Remote",
  "orgType": "public",
  "visibility": "public"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | string | yes | Slug/username of the new organization. |
| `full_name` | string | no | Display name. |
| `description` | string | no | Free-text description. |
| `website` | string | no | Website URL. |
| `location` | string | no | Location text. |
| `orgType` | string | no | One of `public` (default), `limited`, or `private`. |
| `rancherManagementClusterEndPoint` | string | no | Rancher management cluster endpoint (for Rancher-origin orgs). |
| `visibility` | string | no | One of `""`, `public`, `limited`, `private`. |

**Response:** `201 Created` with the created `Organization`:

```json
{
  "id": 42,
  "username": "acme",
  "full_name": "Acme Inc.",
  "avatar_url": "https://<ace-host>/accounts/avatars?obj=avatars/42-<hash>",
  "description": "Acme engineering org",
  "website": "https://acme.example.com",
  "location": "Remote",
  "rancherManagementClusterEndPoint": "",
  "visibility": "public",
  "orgType": 0
}
```

### PATCH /orgs/claim/{claimID}

Claim a previously created standalone (marketplace) organization and assign ownership
to the authenticated user.

- **Auth:** token. Only registered on AppsCode-hosted deployments (`setting.AppsCodeHosted`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `claimID` | string | Claim identifier of the standalone organization. |

**Response:** `200 OK` returning the claimed organization as a free-form Kubernetes
object (`models.User.APIFormat`, dynamic payload). `409 Conflict` if the organization
was already claimed; `404` if the claim ID is unknown.

### GET /orgs/claim/

Return the claim ID of the oldest claimable standalone organization, by proxying an
eligibility check to the central marketplace server.

- **Auth:** token + **site admin** (`reqSiteAdmin`). Only registered for marketplace
  deployments or in dev run mode.

**Response:** `200 OK` (`OrgClaimableCheckResp`):

```json
{
  "isClaimable": true,
  "claimID": "a1b2c3d4"
}
```

> **Verified:** not called against the live platform (registered only on
> marketplace/dev deployments and requires site admin).

### GET /orgs/{orgname}

Get an organization's details (returned if visible to the requesting user).

- **Auth:** public (no auth required). A non-public org may return `404` to callers
  who cannot see it.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` (`Organization`):

```json
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
```

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14.

### PATCH /orgs/{orgname}

Update an organization's profile fields.

- **Auth:** token + `authzCheck(edit:org)` (`Organization_CanEditOrg`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Request body** (`EditOrgOption`):

```json
{
  "full_name": "Acme Inc.",
  "description": "Updated description",
  "website": "https://acme.example.com",
  "location": "Remote",
  "orgType": "limited",
  "visibility": "limited"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | string | no | Display name. |
| `description` | string | no | Free-text description. |
| `website` | string | no | Website URL. |
| `location` | string | no | Location text. |
| `orgType` | string | no | One of `public`, `limited`, or `private`. |
| `rancherManagementClusterEndPoint` | string | no | Rancher management cluster endpoint. |
| `visibility` | string | no | One of `""`, `public`, `limited`, `private`. |

**Response:** `200 OK` with the updated `Organization` (same shape as `GET /orgs/{orgname}`).

### DELETE /orgs/{orgname}

Delete an organization.

- **Auth:** token + `authzCheck(delete:org)` (`Organization_CanDeleteOrg`). The
  requester must be the last admin (per the `orgLastAdmin` condition).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `204 No Content` on success.

## Membership & ownership checks

### GET /orgs/{orgname}/user/{username}

Check whether a user exists (in the org context). Looks up a user by username and
returns their profile if the user exists and is active.

- **Auth:** token (org context).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | Username to look up. |

**Response:** `200 OK` (`Profile`):

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

`400` if the user does not exist or is inactive.

> **Verified:** `GET` returned `200` for `appscode/appscode` on 2026-07-14.

### GET /orgs/{orgname}/is-owner

Return `200` if the authenticated user is an owner of the organization. Ownership is
enforced by upstream middleware.

- **Auth:** token (org context).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` (empty body) when the caller is an owner; otherwise `403`.

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14.

### GET /orgs/{orgname}/members

List an organization's members. Non-members (and unauthenticated callers) see only
public members.

- **Auth:** public (no auth required); the response is scoped to what the caller may
  see.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — an array of `User`:

```json
[
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
    "location": "",
    "website": "",
    "description": "",
    "orgAdmin": true,
    "clientOrgUser": false
  }
]
```

`username` is a backward-compatibility alias of `login`.

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14.

### POST /orgs/{orgname}/members/action/{action}

Perform a membership action for a member identified by the `uid` query parameter.

- **Auth:** token + org membership.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `action` | string | One of `private`, `public`, `remove`, `leave`. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `uid` | integer (int64) | yes | User ID of the member the action applies to. |

**Response:** `200 OK` when the action is performed. `400` if `uid` is missing or invalid.

### GET /orgs/{orgname}/members/{username}

Check whether a user is a member of an organization.

- **Auth:** public (no auth required).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | Username to check. |

**Response:** `204 No Content` if the user is a member; `404` if not; may redirect
(`302`) to the public-members check for non-members of the org.

> **Verified:** `GET` returned `204` for member `appscode/someuser` on 2026-07-14.

### DELETE /orgs/{orgname}/members/{username}

Remove a member from the organization.

- **Auth:** token + org ownership + `authzCheck(admin:org)`
  (`Organization_CanRemoveMember`, `orgLastMember` condition). Site admins cannot be
  removed from the administrative org.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | Username of the member to remove. |

**Response:** `204 No Content` on success.

### GET /orgs/{orgname}/public_members

List an organization's public members.

- **Auth:** public (no auth required).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — an array of `User` (same shape as `GET /orgs/{orgname}/members`).

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14.

### GET /orgs/{orgname}/public_members/{username}

Check whether a user is a public member of an organization.

- **Auth:** public (no auth required).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | Username to check. |

**Response:** `204 No Content` if the user is a public member; `404` if not.

> **Verified:** `GET` returned `404` for `appscode/someuser` on 2026-07-14 (member is not public).

### PUT /orgs/{orgname}/public_members/{username}

Publicize the caller's own organization membership.

- **Auth:** token + org membership. A user cannot publicize another member (`403`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | The caller's own username. |

**Response:** `204 No Content` on success.

### DELETE /orgs/{orgname}/public_members/{username}

Conceal (make private) the caller's own organization membership.

- **Auth:** token + org membership. A user cannot conceal another member (`403`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `username` | string | The caller's own username. |

**Response:** `204 No Content` on success.

## Organization avatar

### GET /orgs/{orgname}/avatar/

Get the organization's avatar URL.

- **Auth:** token + `authzCheck(view:avatar)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — a JSON string containing the avatar URL:

```json
"https://<ace-host>/accounts/avatars?obj=avatars/3-<hash>"
```

### POST /orgs/{orgname}/avatar/

Upload or set the organization avatar.

- **Auth:** token + `authzCheck(update:avatar)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Request body:** `multipart/form-data` (`AvatarParams`):

| Field | Type | Required | Description |
|---|---|---|---|
| `avatar` | binary (file) | no | Uploaded avatar image file. |
| `source` | string | no | Avatar source selector. |
| `gravatar` | string | no | Gravatar email/URL. |
| `federavatar` | boolean | no | Whether to use a federated avatar. |

**Response:** `200 OK`; the exact body depends on the avatar handler (a free-form
Kubernetes object).

### POST /orgs/{orgname}/avatar/delete

Remove the organization's avatar.

- **Auth:** token + `authzCheck(delete:avatar)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` on success.

## Rancher integration tokens

### GET /orgs/{orgname}/rancher/sync-token

Get the organization's Rancher synchronization token.

- **Auth:** token + `authzCheck(view:sync-token)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` (`RancherAPIToken`):

```json
{
  "userID": 4,
  "orgID": 3,
  "orgName": "appscode",
  "accessKeyID": "<access-key-id>",
  "secretAccessKey": "<secret>"
}
```

`404` when no sync token exists (e.g. the org is not of Rancher origin).

> **Verified:** `GET` returned `404` for `appscode` on 2026-07-14 (org is not of Rancher origin — no sync token).

### POST /orgs/{orgname}/rancher/sync-token

Create a Rancher organization synchronization token from the provided access key. The
organization must be of Rancher origin.

- **Auth:** token + `authzCheck(create:rancher-org-sync-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Request body** (`AccessToken`):

```json
{
  "name": "rancher-sync",
  "sha1": "<rancher-access-key>"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | integer (int64) | no | Token ID. |
| `name` | string | no | Token name. |
| `sha1` | string | no | The plaintext access key. |
| `token_last_eight` | string | no | Last eight characters of the token. |

**Response:** `200 OK` (`ApiResponseMessage`):

```json
{ "message": "token created" }
```

`400` if the organization's origin is not Rancher.

### DELETE /orgs/{orgname}/rancher/sync-token

Delete the organization's Rancher synchronization token.

- **Auth:** token + `authzCheck(remove:rancher-sync-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` on success.

### GET /orgs/{orgname}/rancher/user-token

**Deprecated.** Return the caller's Rancher API token for the organization.

- **Auth:** token + org membership + `authzCheck(view:sync-token)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` (`RancherAPIToken`, same shape as the sync-token response).

> **Verified:** `GET` returned `404` for `appscode` on 2026-07-14 (deprecated; org is not of Rancher origin).

### POST /orgs/{orgname}/rancher/user-token

**Deprecated.** Store a Rancher API token for the caller in the organization.

- **Auth:** token + org membership + `authzCheck(create:rancher-org-sync-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Request body** (`AccessToken`): same as `POST /orgs/{orgname}/rancher/sync-token`.

**Response:** `200 OK` on success.

### DELETE /orgs/{orgname}/rancher/user-token

**Deprecated.** Delete the caller's Rancher API token for the organization.

- **Auth:** token + org membership + `authzCheck(remove:rancher-sync-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` on success.

## Organization access & NATS tokens

These endpoints manage tokens belonging to the organization's system admin.

### GET /orgs/{orgname}/tokens/access-tokens/

List the access tokens of the organization's system admin.

- **Auth:** token + org membership + `authzCheck(list:access-token)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — an array of `AccessTokenInfo`:

```json
[
  {
    "id": 12,
    "uid": 4,
    "name": "kube-ui-server 2026-07-05 7:49AM",
    "token": "",
    "tokenLastEight": "3d492e7c",
    "createdAt": 1783237775,
    "updatedAt": 1783785356,
    "hasRecentActivity": true,
    "hasUsed": true,
    "expDate": 2098856975
  }
]
```

The `token` value is empty for existing tokens; the full token is only returned at
creation time. `createdAt`, `updatedAt`, and `expDate` are Unix timestamps. `400`
if the organization system admin does not exist.

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14.

### DELETE /orgs/{orgname}/tokens/access-tokens/{id}

Delete an access token of the organization's system admin.

- **Auth:** token + org membership + `authzCheck(delete:access-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `id` | integer (int64) | ID of the access token. |

**Response:** `200 OK` on success. `400` if the organization system admin does not exist.

### GET /orgs/{orgname}/tokens/nats-tokens/

List the NATS user-type tokens of the organization's system admin.

- **Auth:** token + org membership + `authzCheck(list:nats-token)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — an array of `NatsAccount`:

```json
[
  {
    "id": 1,
    "uid": 4,
    "accountType": "user",
    "natsPubKey": "<nats-public-key>",
    "clusterID": "<cluster-uid>",
    "productName": "kubedb",
    "revoked": false
  }
]
```

`400` if the organization system admin does not exist.

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14 (empty list `[]`).

### POST /orgs/{orgname}/tokens/nats-tokens/{id}/revoke

Revoke a NATS user-type token of the organization's system admin.

- **Auth:** token + org membership + `authzCheck(revoke:nats-token)` (`Organization_Editor`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `id` | integer (int64) | ID of the NATS token. |

**Response:** `200 OK` on success. `400` if the organization system admin is missing
or the NATS user is not found.
