---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-rancher-rancher
    name: Rancher Integration
    parent: api-rancher
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Rancher Integration

Endpoints for integrating the KubeDB Platform with a Rancher management cluster: syncing Rancher
users, generating the `acerproxy` installation command, downloading the platform
CA certificate, minting Rancher proxy-server tokens, and fetching NATS
credentials for the authenticated Rancher user.

All paths below are relative to the API base **`/api/v1`** (for example,
`/rancher/nats-cred` is served at `/api/v1/rancher/nats-cred`).

## Authentication

Every endpoint requires a bearer token, sent as a header:

```
Authorization: token <YOUR_TOKEN>
```

The token may also be supplied via a `token` or `access_token` query parameter.

Authorization requirements differ per route:

- **`/rancher/org/{orgname}/...`** — the caller must be a **site administrator**
  and the named organization must be **Rancher-managed** (its origin is Rancher).
  On platforms whose organizations are not Rancher-managed these routes fail with
  `500 org isn't a rancher organization`.
- **`POST /rancher/proxy-token`** — the caller must be a **site administrator**.
- **`GET /rancher/nats-cred`** — any valid token; the server resolves the
  Rancher-user context from the token.

---

## User sync

### GET /rancher/org/{orgname}/sync/users

Imports users from the organization's Rancher management cluster into the KubeDB Platform. For
each Rancher user it creates a matching platform user (when missing) and adds them to
the organization's viewer team.

- **Auth:** token — **site-admin** required, and `{orgname}` must be a
  Rancher-managed organization.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. Must be a Rancher-managed org. |

**Response** — `200 OK`. A summary of the sync, listing successfully synced
usernames and any users that failed (each with an error string).

```json
{
  "synced_users": [
    "alice",
    "bob"
  ],
  "failed_users": [
    { "carol": "could not create user: email already in use" }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `synced_users` | array of string | Usernames successfully imported / added to the viewer team. |
| `failed_users` | array of object | Map entries of `username → error message` for users that failed. |

> **Verified:** returned `500` against `appscode/sync/users` — `org isn't a rancher organization` (this platform's org `appscode` is not Rancher-managed, so the site-admin + Rancher-org precondition fails before any sync).

---

## acerproxy installation

### GET /rancher/org/{orgname}/acerproxy

Returns a ready-to-run Helm command that installs the `acerproxy` chart, wired
with a freshly issued Rancher extended server token and the platform base URL.

- **Auth:** token — **site-admin** required, and `{orgname}` must be a
  Rancher-managed organization.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. Must be a Rancher-managed org. |

**Response** — `200 OK`.

```json
{
  "helm": "helm upgrade -i acerproxy oci://ghcr.io/appscode-charts/acerproxy --set token=<token> --set baseURL=https://<akp-host> ..."
}
```

| Field | Type | Description |
|---|---|---|
| `helm` | string | The complete `helm upgrade -i` command to install acerproxy. |

> **Verified:** returned `500` against `appscode/acerproxy` — `org isn't a rancher organization` (org `appscode` is not Rancher-managed).

---

## CA certificate

### GET /rancher/org/{orgname}/ca/download

Returns the platform CA certificate as a downloadable text file (`ace-ca.txt`).

- **Auth:** token — **site-admin** required, and `{orgname}` must be a
  Rancher-managed organization.

**Path parameters**

| Name | Type | Description |
|---|---|---|
| `orgname` | string | Organization slug. Must be a Rancher-managed org. |

**Response** — `200 OK`, `Content-Type: text/plain`. The response body is the
PEM-encoded CA certificate, served as an attachment named `ace-ca.txt`. Returns
`400` if no CA certificate is configured.

```
-----BEGIN CERTIFICATE-----
MIIC...<snip>...IDAQAB
-----END CERTIFICATE-----
```

> **Verified:** returned `500` against `appscode/ca/download` — `org isn't a rancher organization` (org `appscode` is not Rancher-managed).

---

## Proxy-server token

### POST /rancher/proxy-token

Creates a Rancher extended server token for a given Rancher URL and returns it in
the platform's access-token API format.

- **Auth:** token — **site-admin** required.
- **Not verified live:** this is a `POST`; not called against the platform per
  the GET-only verification policy.

**Request body** — a JSON string map. The `rancherUrl` key specifies the Rancher
management cluster endpoint.

```json
{
  "rancherUrl": "https://rancher.example.com"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `rancherUrl` | string | yes | Endpoint of the Rancher management cluster to mint the extended server token against. |

**Response** — `201 Created`. The created access token (`AccessToken` schema).

```json
{
  "name": "rancher-proxy-server",
  "token": "<token>",
  "expiresAt": "2026-08-01T00:00:00Z"
}
```

The exact field set follows the platform `AccessToken` schema; treat `token` as a
secret and store it securely.

---

## NATS credentials

### GET /rancher/nats-cred

Returns the primary NATS user JWT and seed for the authenticated Rancher user. If
the existing credentials are no longer authorized, the server recreates the
primary NATS account before returning fresh credentials.

- **Auth:** token — any valid token; the Rancher-user context is resolved from
  the token by the server.

**Response** — `200 OK`.

```json
{
  "user-jwt": "<user-jwt>",
  "user-seed": "SUAB...<snip>...XYZ",
  "url": "wss://<akp-host>/nats"
}
```

| Field | Type | Description |
|---|---|---|
| `user-jwt` | string | The primary NATS user JWT for the Rancher user. |
| `user-seed` | string | The NATS user seed (private nkey). Treat as a secret. |
| `url` | string | NATS connection URL. Present only when two external NATS addresses are configured. |

> **Verified:** `GET` returned `200` against `/rancher/nats-cred` on 2026-07-14 — the response carried `url`, `user-jwt`, and `user-seed` for the token's Rancher-user context.
