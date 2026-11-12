---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-billing-dashboard-user-dashboard
    name: User Billing Dashboard
    parent: api-billing-dashboard
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# User Billing Dashboard

Owner-scoped endpoints under `/api/v1/dashboard/clusters` that back the self-service
billing dashboard an organization sees for its **own** clusters: active clusters,
their licenses and licensed products, and per-cluster / per-license / per-resource
event counts.

All paths on this page are relative to `/api/v1`. Every endpoint requires
`Authorization: token <YOUR_TOKEN>`, resolves the owner from the `org` query
parameter (`?org=<org-slug>`), and requires the `view:contracts` permission on that
organization (this is the org's "hosted mode / view contracts" grant — not
site-admin). This group is available only on **billing-enabled deployments**.

> **Verified:** every endpoint on this page returned `404 Not Found` against
> `appscode` on `<akp-host>` on 2026-07-14 — this deployment is not billing-enabled,
> so the `/dashboard/clusters/*` routes are not registered. (Sanity: `GET /version`
> and `GET /user` returned `200` with the same token.)

Shared conventions on this page:

- **`cid`** is a cluster UID string; **`lid`** is a license ID string; **`product`**
  is a product name.
- **`limit`** (query, optional) sets the "active" window: a Go duration such as
  `720h` or a `YYYY-MM-DD` date; defaults to roughly the last six months.

## Clusters

### GET /dashboard/clusters/active

Lists clusters that reported within the `limit` window for the owner resolved from
the query.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug that owns the clusters. |
| `limit` | string | no | Activity window (Go duration or `YYYY-MM-DD` date). |

- **Response:** `200 OK` — an array of `ActiveClustersAPIForm`.

```json
[
  {
    "username": "appscode",
    "clusterID": "<cluster-uid>",
    "firstReceivedAt": 1700000000,
    "lastReceivedAt": 1718000000,
    "noOfAssociatedContracts": 2
  }
]
```

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/dashboard/clusters/active?org=appscode"
```

> **Verified:** returned `404` against `appscode` — billing not enabled on this deployment.

### GET /dashboard/clusters/{cid}

Returns cluster information for a cluster owned by the request owner.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `cid` | string | Cluster UID. |

- **Response:** `200 OK` — a single `ClusterInfo` object (the same shape documented
  on the [Admin Billing Dashboard](../admin-dashboard.md) page;
  `status` is a free-form Kubernetes-style object). `404` if the cluster is unknown
  or not owned by the org.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/clusters/{cid}/events-count

Returns today's event count for the cluster.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string) — cluster UID.
- **Response:** `200 OK` — an `EventsCounterResponse`.

```json
{
  "clusterID": "<cluster-uid>",
  "date": "2026-07-14",
  "noOfEvents": 27
}
```

The `product`, `licenseID`, `group`, `resource`, and `RID` fields are populated on
the license/resource-scoped counter endpoints below; `error` is set instead of
`noOfEvents` when the count could not be computed.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Licenses

### GET /dashboard/clusters/{cid}/licenses/

Lists licensed plans associated with the request owner and cluster.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string) — cluster UID.
- **Response:** `200 OK` — an array of `LicensedPlan` (see the Admin Billing
  Dashboard page for the full shape).

```json
[
  {
    "uid": 42,
    "email": "user@example.com",
    "licenseID": "<license-id>",
    "clusters": ["<cluster-uid>"],
    "planName": "kubedb-enterprise",
    "notBefore": 1700000000,
    "notAfter": 1731600000
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/clusters/{cid}/licenses/{lid}

Returns a licensed plan (API form) associated with the request owner.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string), `lid` (string) — license ID.
- **Response:** `200 OK` — a `LicensePlanApiForm`.

```json
{
  "uid": 42,
  "email": "user@example.com",
  "licenseID": "<license-id>",
  "clusters": ["<cluster-uid>"],
  "planName": "kubedb-enterprise",
  "notBefore": 1700000000,
  "notAfter": 1731600000,
  "reconciledAt": 1718000000,
  "registeredAt": 1700000000,
  "createdAt": 1700000000,
  "updatedAt": 1718000000
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Event counts and events

### GET /dashboard/clusters/{cid}/licenses/{lid}/products/{product}/events-count

Returns today's event count for a license/product.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string), `lid` (string), `product` (string).
- **Response:** `200 OK` — an `EventsCounterResponse` (with `product` and
  `licenseID` populated).

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/clusters/{cid}/licenses/{lid}/products/{product}/groups/{group}/resources/{resource}/{rid}/events-count

Returns today's event count for a specific resource object.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `cid` | string | Cluster UID. |
| `lid` | string | License ID. |
| `product` | string | Product name. |
| `group` | string | Kubernetes API group. |
| `resource` | string | Kubernetes resource. |
| `rid` | string | Resource ID (object UID). |

- **Response:** `200 OK` — an `EventsCounterResponse` (with `group`, `resource`, and
  `RID` populated).

```json
{
  "clusterID": "<cluster-uid>",
  "product": "kube-db",
  "licenseID": "<license-id>",
  "group": "kubedb.com",
  "resource": "mongodbs",
  "RID": "<object-uid>",
  "date": "2026-07-14",
  "noOfEvents": 4
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/clusters/{cid}/licenses/{lid}/products/{product}/events/

Returns the tabular event list for the caller's cluster/license/product.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string), `lid` (string), `product` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `lastDays` | integer | no | Look-back window in days (max 14; defaults to 14). |

- **Response:** `200 OK` — an array of `ClusterResourceTabularForm`, newest first.

```json
[
  {
    "key": "<event-key>",
    "version": 3,
    "timestamp": 1718000000,
    "partialResource": {
      "partialObjectMeta": { "...": "free-form partial Kubernetes object metadata" }
    }
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/clusters/{cid}/licenses/{lid}/products/{product}/events/raw-event

Returns the raw badger value for a specific event key/version.

- **Auth:** token; owner-scoped (`view:contracts`). Requires `?org=`.
- **Path parameters:** `cid` (string), `lid` (string), `product` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Badger event key. |
| `version` | integer | yes | Event version (uint). |

- **Response:** `200 OK` — a single `BadgerValue`.

```json
{
  "resourceID": { "...": "free-form Kubernetes object" },
  "licenseID": "<license-id>",
  "version": 3,
  "timestamp": 1718000000
}
```

`400` when `key`/`version` are missing or invalid.

> **Verified:** returned `404` against `appscode` — billing not enabled.
