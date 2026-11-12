---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-chart-repositories-chart-repositories
    name: Chart Repositories
    parent: api-chart-repositories
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Chart Repositories

These endpoints provide a read-only view over the public Helm Hub chart
repository index used by the KubeDB Platform. You can list the known repositories, load a
repository by URL and list the charts inside it, and list the versions of a
named chart.

All paths on this page are relative to `/api/v1`. The full base path is
`/api/v1/chartrepositories`.

All three endpoints are **public** (no `security` requirement, no organization
context). Clients typically still send their bearer token, but no membership or
role is required. Only `GET` is supported.

Examples below use a placeholder host `<akp-host>` and a `$AKP_TOKEN`
environment variable holding the caller's token.

---

## List chart repositories

### GET /chartrepositories

Returns the list of known Helm Hub chart repositories.

- **Auth:** public. No organization context required.

**Path parameters:** none.

**Query parameters:** none.

**Response:** `200 OK` — a JSON array of chart repository entries. Each entry is
a Helm repository configuration (Helm's `repo.Entry`). In practice only `name`
and `url` are populated for the public Helm Hub index; the credential-related
fields are part of the schema but are empty for public repositories.

```json
[
  { "name": "appscode", "url": "https://charts.appscode.com/stable" },
  { "name": "bitnami", "url": "https://charts.bitnami.com/bitnami" },
  { "name": "argo", "url": "https://argoproj.github.io/argo-helm" }
]
```

Fields of each `ChartRepositoryEntry`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Repository name. |
| `url` | string | Repository index URL. |
| `username` | string | Basic-auth username (empty for public repos). |
| `password` | string | Basic-auth password (empty for public repos). |
| `certFile` | string | Client TLS certificate file. |
| `keyFile` | string | Client TLS key file. |
| `caFile` | string | CA bundle file. |
| `insecure_skip_tls_verify` | boolean | Skip TLS verification for the repo. |
| `pass_credentials_all` | boolean | Pass credentials to all hosts. |

**Example:**

```bash
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/chartrepositories
```

> **Verified:** `GET` returned `200` on 2026-07-14 (public endpoint; not
> cluster-scoped). Returned a large array of repositories; live entries populate
> only `name` and `url`.

---

## List charts in a repository

### GET /chartrepositories/charts

Loads the chart repository at the given `url` and returns the names of the charts
it contains.

- **Auth:** public. No organization context required.

**Path parameters:** none.

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | yes | URL of the chart repository to load (for example `https://charts.appscode.com/stable`). |

**Response:** `200 OK` — a JSON array of chart names (strings) found in the
repository index.

```json
[
  "kubedb",
  "stash",
  "cert-manager-crds",
  "prometheus"
]
```

Other statuses:

| Status | Meaning |
|--------|---------|
| `400` | Missing chart repo `url`. |
| `500` | Internal server error (for example the repository index could not be loaded). |

**Example:**

```bash
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/chartrepositories/charts?url=https://charts.appscode.com/stable"
```

> **Verified:** `GET` returned `200` on 2026-07-14 for
> `url=https://charts.appscode.com/stable` (public endpoint; not cluster-scoped).
> Response was a JSON array of chart-name strings (264 charts).

---

## List versions of a chart

### GET /chartrepositories/charts/{name}/versions

Loads the chart repository at the given `url` and returns the available versions
of the named chart.

- **Auth:** public. No organization context required.

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `name` | string | Name of the chart (for example `kubedb`). |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | yes | URL of the chart repository that contains the chart. |

**Response:** `200 OK` — a JSON array of chart version entries (Helm's
`repo.ChartVersion` / chart metadata). The schema models the common chart
metadata fields; a given repository only populates the fields it publishes. In
practice the public Helm Hub index returns `version`, `appVersion`, `created`,
and (when set) `kubeVersion`.

```json
[
  {
    "version": "v2026.7.10",
    "appVersion": "v2026.7.10",
    "kubeVersion": ">=1.26.0-0",
    "created": "2026-07-13T07:15:34.541887Z"
  }
]
```

Fields of each `ChartVersion` (as defined by the API schema):

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Chart name. |
| `version` | string | Chart version (SemVer). |
| `description` | string | Chart description. |
| `apiVersion` | string | Chart API version (`v1` or `v2`). |
| `appVersion` | string | Version of the application packaged by the chart. |
| `type` | string | Chart type (`application` or `library`). |
| `deprecated` | boolean | Whether this chart version is deprecated. |
| `icon` | string | URL of the chart icon. |
| `home` | string | Home page URL of the project. |
| `keywords` | array of string | Search keywords. |
| `sources` | array of string | Source URLs for the project. |
| `urls` | array of string | Download URLs for the chart archive. |
| `created` | string (date-time) | Publication timestamp. |
| `digest` | string | Digest of the chart archive. |

Other statuses:

| Status | Meaning |
|--------|---------|
| `400` | Missing chart repo `url` or chart `name`. |
| `500` | Internal server error (for example the repository index could not be loaded). |

**Example:**

```bash
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/chartrepositories/charts/kubedb/versions?url=https://charts.appscode.com/stable"
```

> **Verified:** `GET` returned `200` on 2026-07-14 for chart `kubedb` with
> `url=https://charts.appscode.com/stable` (public endpoint; not cluster-scoped).
> Response was a JSON array of 106 version entries.
