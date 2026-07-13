---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-monitoring-telemetry-telemetry-stack
    name: Telemetry Stack
    parent: api-monitoring-telemetry
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Telemetry Stack

These endpoints manage the telemetry (observability) stack of an organization. A
**monitoring cluster** is one of the owner's imported clusters that has been designated to
receive telemetry from other clusters. The APIs here list monitoring clusters, install the
OpenTelemetry-based telemetry stack on a cluster, generate the `appscode-otel-stack` Helm
values that *target* clusters use to ship data to a monitoring cluster, expose the
monitoring cluster's ingress host, and list the tenants it serves.

All paths below are relative to the API base `/api/v1`; the full prefix for this page is
`/api/v1/telemetry`.

**Auth for all endpoints on this page:** bearer **token** plus **org-admin** context — the
caller must be an admin of the `{owner}` organization. `{owner}` is the slug of an
organization or user that owns the cluster.

A documented call looks like:

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/telemetry/appscode/monitoring-clusters?targetClusterName=arnob-dev"
```

---

## Monitoring clusters

### GET /telemetry/{owner}/monitoring-clusters

Returns the names of clusters imported by the owner that are configured as monitoring
clusters, optionally filtered to the region of a target cluster.

- **Auth:** token + org admin (admin of `{owner}`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization (or user) slug that owns the clusters. |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `targetClusterName` | string | No* | Name of the target cluster used to determine the region filter. Only monitoring clusters in the same region as this cluster are returned. |

> \* Marked optional in the schema, but the region-resolution step needs a resolvable
> target cluster. In practice call it with `targetClusterName` set; omitting it can fail
> to resolve cluster info (see verification note below).

**Response `200`:** a JSON array of monitoring cluster names.

```json
["arnob-monitoring"]
```

> **Verified:** `GET` returned `200` against `appscode/arnob-monitoring` (with
> `?targetClusterName=arnob-dev`) on 2026-07-14. Without `targetClusterName` the call
> returned `500` (`cluster info not found`) because the region filter could not resolve a
> target cluster.

---

### POST /telemetry/{owner}/{cluster}/stack

Creates a `TelemetryStack` custom resource on the given cluster and marks that cluster as a
monitoring cluster. This is the install step for the telemetry stack.

- **Auth:** token + org admin (admin of `{owner}`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization (or user) slug that owns the cluster. |
| `cluster` | string | Name of the cluster to turn into a monitoring cluster. |

**Request body** (`CreateTelemetryStackRequest`):

```json
{
  "name": "appscode-otel-stack",
  "namespace": "monitoring",
  "spec": {
    "...": "TelemetryStackSpec (go.open-pulse.dev/tenant-operator)"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Name of the `TelemetryStack` resource to create. |
| `namespace` | string | No | Namespace in which to create it. |
| `spec` | object | No | A `TelemetryStackSpec` (from `go.open-pulse.dev/tenant-operator`), modeled as a free-form Kubernetes object. Its fields are passed through to the cluster verbatim; see the tenant-operator TelemetryStack concept rather than treating these as fixed API fields. |

**Response `200`:** the created `TelemetryStack` object — an arbitrary Kubernetes object
returned verbatim from the cluster.

```json
{
  "apiVersion": "monitoring.open-pulse.dev/v1alpha1",
  "kind": "TelemetryStack",
  "metadata": { "name": "appscode-otel-stack", "namespace": "monitoring" },
  "spec": { "...": "..." }
}
```

> Not verified live — this is a `POST` (mutating) request and is documented from the schema
> only.

---

### GET /telemetry/{owner}/{cluster}/values/appscode-otel-stack

Returns the Helm values for the `opentelemetry-kube-stack` chart to install on a *target*
cluster so that it ships telemetry to the given monitoring cluster.

- **Auth:** token + org admin (admin of `{owner}`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization (or user) slug. |
| `cluster` | string | Name of the monitoring cluster the values point at. |

**Query parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `targetClusterName` | string | Yes | Name of the target cluster the values are generated for. |

**Response `200`:** a dynamic Helm values object for the `appscode-otel-stack` chart
(an arbitrary Kubernetes/values object). Shape depends on the chart; a truncated,
sanitized example:

```json
{
  "opentelemetry-kube-stack": {
    "clusterName": "arnob-dev",
    "collectors": {
      "cluster": {
        "config": {
          "exporters": {
            "clickhouse": {
              "endpoint": "https://prom-label-proxy.monitoring.svc.cluster.local:10001/?database=default&secure=true&http_path=/api/v1/logs"
            },
            "prometheusremotewrite": {
              "endpoint": "https://prom-label-proxy.monitoring.svc.cluster.local:10001/api/v1/receive"
            }
          }
        }
      }
    }
  }
}
```

> **Verified:** `GET` returned `200` against `appscode/arnob-monitoring` (with
> `?targetClusterName=arnob-dev`) on 2026-07-14.

---

### GET /telemetry/{owner}/{cluster}/stack/host

Returns the ingress host (hostname or IP) of the given monitoring cluster, used by
telemetry collectors as their upstream endpoint.

- **Auth:** token + org admin (admin of `{owner}`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization (or user) slug. |
| `cluster` | string | Name of the monitoring cluster. |

**Response `200`:** a JSON string with the host.

```json
"10.2.0.136"
```

> **Verified:** `GET` returned `200` against `appscode/arnob-monitoring` on 2026-07-14.

---

### GET /telemetry/{owner}/{cluster}/tenants/ownerlist

Lists the `Tenant` custom resources present on the given monitoring cluster, returning a
map of tenant owner identifier (`ace.user.{id}`) to the ACE user/organization name.

- **Auth:** token + org admin (admin of `{owner}`).

**Path parameters:**

| Name | Type | Description |
|------|------|-------------|
| `owner` | string | Organization (or user) slug. |
| `cluster` | string | Name of the monitoring cluster. |

**Response `200`:** a JSON object mapping tenant owner id to name.

```json
{
  "ace.user.3": "appscode"
}
```

> **Verified:** `GET` returned `200` against `appscode/arnob-monitoring` on 2026-07-14.
