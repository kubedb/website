---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-organizations-teams-teams
    name: Teams
    parent: api-organizations-teams
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Teams

Endpoints for managing teams within an organization and their members. Teams are
created under an organization (`/orgs/{orgname}/teams`) and then addressed by their
numeric ID under `/teams/{teamid}`.

All paths below are relative to the API root `/api/v1`. For example,
`GET /teams/{teamid}` is `GET https://<ace-host>/api/v1/teams/{teamid}`. In these
paths `orgname` is the organization slug (e.g. `appscode`) and `teamid` is the
team's numeric ID.

All team endpoints authenticate with a personal access token:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/teams/1
```

Authorization checks (e.g. `view:team`, `edit:team`, `add:team-member`) are
relationship-based (OpenFGA) and evaluated against the caller's role in the team or
its organization.

## Teams under an organization

### GET /orgs/{orgname}/teams

List the teams of an organization.

- **Auth:** token + org membership + `authzCheck(list:team)` (`Organization_Viewer`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Response:** `200 OK` — an array of `Team`:

```json
[
  {
    "id": 1,
    "name": "Owners",
    "description": "",
    "organization": null,
    "permission": "owner",
    "units": [
      "repo.code",
      "repo.issues",
      "repo.pulls"
    ],
    "type": "kubernetes"
  },
  {
    "id": 2,
    "name": "Editors",
    "description": "",
    "organization": null,
    "permission": "write",
    "units": null,
    "type": ""
  },
  {
    "id": 3,
    "name": "Viewers",
    "description": "",
    "organization": null,
    "permission": "read",
    "units": null,
    "type": ""
  }
]
```

Each `Team` has an `id`, `name`, `description`, optional embedded `organization`,
`permission` (one of `none`, `read`, `write`, `admin`, `owner`), a `units` list, a
`type`, and (when set) a `role_ids` array of assigned custom-role IDs.

> **Verified:** `GET` returned `200` for `appscode` on 2026-07-14 (3 teams: Owners, Editors, Viewers).

### POST /orgs/{orgname}/teams

Create a team in the organization.

- **Auth:** token + org membership + `authzCheck(create:team)` (team editor).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |

**Request body** (`CreateTeamOption`):

```json
{
  "name": "Developers",
  "description": "Application developers",
  "permission": "write",
  "assignedRoleIDs": [101, 102],
  "type": "kubernetes"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Team name. |
| `type` | string | yes | Team type. |
| `description` | string | no | Free-text description. |
| `permission` | string | no | One of `read`, `write`, `admin`. |
| `assignedRoleIDs` | integer[] (int64) | no | Custom-role IDs assigned to the team. |

**Response:** `201 Created` with the created `Team`. `400` if the team type is
invalid or too many roles are assigned.

### POST /orgs/{orgname}/teams/{teamid}/action/{action}

Perform a team action (join, leave, remove, add) for the user identified by the `uid`
query parameter (or `uname` for the `add` action).

- **Auth:** token + org membership + `authzCheck(ctx.param.action:team)` (`Team_Member`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. |
| `teamid` | integer (int64) | ID of the team. |
| `action` | string | One of `join`, `leave`, `remove`, `add`. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `uid` | integer (int64) | yes | User ID the action applies to. |
| `uname` | string | no | Username to add (used with the `add` action). |

**Response:** `200 OK` when the action is performed. `400` if `uid` is missing or the
target user is an organization. `409` if the user is already a member of the team.

## Managing a team by ID

### GET /teams/{teamid}

Get a team by ID.

- **Auth:** token + `authzCheck(view:team)` (`Team_CanView`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |

**Response:** `200 OK` (`Team`):

```json
{
  "id": 1,
  "name": "Owners",
  "description": "",
  "organization": null,
  "permission": "owner",
  "units": null,
  "type": "kubernetes"
}
```

> **Verified:** `GET` returned `200` for team `1` on 2026-07-14.

### PATCH /teams/{teamid}

Update a team. The owner-team permission cannot be changed.

- **Auth:** token + `authzCheck(edit:team)` (`Team_CanEdit`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |

**Request body** (`EditTeamOption`):

```json
{
  "name": "Developers",
  "description": "Updated description",
  "permission": "custom",
  "assignedRoleIDs": [101],
  "type": "kubernetes"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Team name. |
| `description` | string | no | Free-text description. |
| `permission` | string | no | One of `read`, `write`, `admin`, `custom`. |
| `assignedRoleIDs` | integer[] (int64) | no | Custom-role IDs assigned to the team. |
| `type` | string | no | Team type. |

**Response:** `200 OK` with the updated `Team`. `400` if the team type or name is invalid.

### DELETE /teams/{teamid}

Delete a team.

- **Auth:** token + `authzCheck(delete:team)` (`Team_CanDelete`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |

**Response:** `204 No Content` on success.

## Team members

### GET /teams/{teamid}/members

List the members of a team.

- **Auth:** token + org membership + `authzCheck(list:team-members)` (`Team_CanView`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |

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
    "is_admin": true,
    "active": true,
    "orgAdmin": true
  }
]
```

`username` is a backward-compatibility alias of `login`.

> **Verified:** `GET` returned `200` for team `1` on 2026-07-14.

### GET /teams/{teamid}/members/{username}

Get a specific member of a team.

- **Auth:** token + `authzCheck(view:team-member)` (`Team_CanView`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |
| `username` | string | Username of the team member. |

**Response:** `200 OK` — a single `User` (same shape as the list entries above).

> **Verified:** `GET` returned `200` for team `1`, member `someuser`, on 2026-07-14.

### PUT /teams/{teamid}/members/{username}

Add a user to the team.

- **Auth:** token + `authzCheck(add:team-member)` (`Team_CanAddMember`).

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |
| `username` | string | Username of the user to add. |

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `autoConnectClusters` | boolean | no | When adding to the owner team, auto-connect the user to the org's clusters. |

**Response:** `204 No Content` on success.

### DELETE /teams/{teamid}/members/{username}

Remove a user from the team.

- **Auth:** token + `authzCheck(remove:team-member)` (`Team_CanRemoveMember`,
  `ownerTeamLastMember` condition). Site admins cannot be removed from the
  administrative org.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `teamid` | integer (int64) | ID of the team. |
| `username` | string | Username of the member to remove. |

**Response:** `204 No Content` on success.
