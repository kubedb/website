---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-monitoring-telemetry-trickster
    name: Trickster Auth Proxy
    parent: api-monitoring-telemetry
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Trickster Auth Proxy

These endpoints manage the **Trickster** Prometheus proxy that fronts per-cluster
Prometheus backends and enforces per-tenant access. There are three concerns:

- **Register / unregister** a Prometheus backend for a cluster so it becomes available as a
  **Grafana** datasource (`/register`, `/unregister`).
- The **Perses** equivalents (`/perses/register`, `/perses/unregister`) that produce a
  Perses datasource instead of a Grafana one.
- The **ownership/auth hook** (`/auth/{uidcid}/{path}`) that `prom-authproxy` calls to
  verify that the caller owns (or belongs to the org that owns) the cluster identified by a
  `uid.clusterid[.projectid]` identity before proxying a Prometheus request.

All paths below are relative to the API base `/api/v1`; the full prefix for this page is
`/api/v1/trickster`.

**Auth for all endpoints on this page:** bearer **token** plus **org-admin** context. For
the register/unregister routes the referenced cluster (via `clusterUID`) must belong to the
caller's org; for the auth hook the caller must be a member/owner of the org that owns the
identified cluster.

A documented call looks like:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/trickster/auth/<uid>.<clusterid>/api/v1/query
```

---

## Grafana datasource registration

### POST /trickster/register

Registers a Prometheus backend with the Trickster proxy and returns a Grafana datasource
response.

- **Auth:** token + org admin.

**Request body** (`RegisterRequest`):

```json
{
  "prometheus": {
    "url": "https://prometheus.monitoring.svc:9090",
    "service": {
      "scheme": "https",
      "name": "prometheus",
      "namespace": "monitoring",
      "port": "9090",
      "path": "/",
      "query": ""
    },
    "basicAuth": { "username": "user", "password": "<redacted>" },
    "bearerToken": "<redacted>",
    "tls": {
      "ca": "<pem>",
      "cert": "<pem>",
      "key": "<pem>",
      "serverName": "prometheus.monitoring.svc",
      "insecureSkipTLSVerify": false
    }
  },
  "hubUID": "<hub-uid>",
  "clusterUID": "<cluster-uid>",
  "projectId": "",
  "default": true,
  "issueToken": true,
  "clientOrgID": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prometheus` | object (`PrometheusConfig`) | Yes | Connection config for the Prometheus backend (see fields below). |
| `hubUID` | string | No | UID of the hub cluster. |
| `clusterUID` | string | No | UID of the cluster whose Prometheus is being registered. |
| `projectId` | string | No | Optional project scope for the identity. |
| `default` | boolean | No | Whether this becomes the default datasource. |
| `issueToken` | boolean | No | Whether to issue an access token for the datasource. |
| `clientOrgID` | string | No | Client-organization id when registering on behalf of a client org. |

`PrometheusConfig` fields: `url` (string), `service` (`ServiceSpec`: `scheme`, `name`,
`namespace`, `port`, `path`, `query`), `basicAuth` (`username`, `password`), `bearerToken`
(string), and `tls` (`ca`, `cert`, `key`, `serverName`, `insecureSkipTLSVerify`).

**Response `200`** (`GrafanaDatasourceResponse`):

```json
{
  "grafana": {
    "url": "https://<akp-host>/api/v1/trickster/...",
    "service": { "scheme": "https", "name": "trickster", "namespace": "monitoring", "port": "8480", "path": "/", "query": "" },
    "basicAuth": { "username": "user", "password": "<redacted>" },
    "bearerToken": "<redacted>",
    "tls": { "insecureSkipTLSVerify": false },
    "dashboard": { "datasource": "<uid>.<clusterid>", "folderID": 0 }
  },
  "folderID": 0,
  "datasource": "<uid>.<clusterid>"
}
```

The `grafana` object is a `GrafanaConfig` (same connection fields as `PrometheusConfig`
plus a `dashboard` `DashboardSpec` of `datasource`/`folderID`). The top-level `folderID`
and `datasource` mirror the resolved Grafana context.

> Not verified live — `POST` (mutating). Documented from the schema only.

---

### POST /trickster/unregister

Removes the Trickster backend and Grafana datasource associated with the given Prometheus
context.

- **Auth:** token + org admin.

**Request body** (`PrometheusContext`):

```json
{
  "hubUID": "<hub-uid>",
  "clusterUID": "<cluster-uid>",
  "projectId": "",
  "default": true,
  "issueToken": false,
  "clientOrgID": ""
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hubUID` | string | No | UID of the hub cluster. |
| `clusterUID` | string | No | UID of the cluster whose backend is being removed. |
| `projectId` | string | No | Optional project scope. |
| `default` | boolean | No | Whether this was the default datasource. |
| `issueToken` | boolean | No | Token-issuance flag from registration. |
| `clientOrgID` | string | No | Client-organization id, if applicable. |

**Response `200`:** backend unregistered (no body).

> Not verified live — `POST` (mutating). Documented from the schema only.

---

## Perses datasource registration

### POST /trickster/perses/register

Registers a Prometheus backend with the Trickster proxy and returns a **Perses** datasource
response. Same request body as `/trickster/register`.

- **Auth:** token + org admin.

**Request body** (`RegisterRequest`): identical to
[`POST /trickster/register`](#post-tricksterregister).

**Response `200`** (`PersesDatasourceResponse`):

```json
{
  "perses": {
    "url": "https://<akp-host>/api/v1/trickster/...",
    "service": { "scheme": "https", "name": "trickster", "namespace": "monitoring", "port": "8480", "path": "/", "query": "" },
    "basicAuth": { "username": "user", "password": "<redacted>" },
    "bearerToken": "<redacted>",
    "tls": { "insecureSkipTLSVerify": false },
    "dashboard": { "projectName": "appscode", "folderName": "default", "datasource": "<uid>.<clusterid>" }
  },
  "projectName": "appscode",
  "folderName": "default",
  "datasource": "<uid>.<clusterid>"
}
```

The `perses` object is a `PersesConfig` (connection fields plus a `dashboard`
`PersesDashboardSpec` of `projectName`/`folderName`/`datasource`). The top-level
`projectName`, `folderName`, and `datasource` mirror the resolved Perses context.

> Not verified live — `POST` (mutating). Documented from the schema only.

---

### POST /trickster/perses/unregister

Removes the Trickster backend and Perses datasource associated with the given Prometheus
context. Same request body as `/trickster/unregister`.

- **Auth:** token + org admin.

**Request body** (`PrometheusContext`): identical to
[`POST /trickster/unregister`](#post-tricksterunregister).

**Response `200`:** backend unregistered (no body).

> Not verified live — `POST` (mutating). Documented from the schema only.

---

## Auth hook

### GET /trickster/auth/{uidcid}/{path}

Auth-proxy hook used by `prom-authproxy`. Validates that the caller owns (or is a member of
the org that owns) the cluster identified by the `uid.clusterid[.projectid]` segment and
returns owner/cluster/tenant metadata. The trailing wildcard captures the proxied request
path.

- **Auth:** token + org admin — the caller must be a member of the organization that owns
  the identified cluster.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `uidcid` | string | Identity following the `uid.clusterid[.projectid]` pattern (e.g. `3.<cluster-uid>`). |
| `path` | string | Remaining proxied request path, matched by the trailing wildcard (e.g. `api/v1/query`). |

**Response `200`:** a JSON object of string values containing the keys `owner`,
`clusterName`, `tenantID`, and optionally `clientOrg`.

```json
{
  "owner": "appscode",
  "clusterName": "arnob-monitoring",
  "tenantID": "ace.user.3",
  "clientOrg": ""
}
```

Other responses: `400` (malformed `uidcid`), `401` (caller is not an org member), `403`
(forbidden), `404` (cluster or owner not found).

> **Verified:** returned `404` against `appscode` on 2026-07-14 when probed with a
> fabricated identity (`/trickster/auth/1.2/api/v1/query` → `user does not exist`), which
> confirms the endpoint is live and enforcing identity resolution. A `200` requires a real
> `uid.clusterid` for a cluster owned by the caller's org.
