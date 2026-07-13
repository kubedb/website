---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-billing-dashboard-usage-reports
    name: Usage Reports
    parent: api-billing-dashboard
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Usage Reports

Endpoints that serve the pre-generated monthly usage summaries under
`/api/v1/dashboard/summary` (KubeDB, KubeStash, KubeVault, Voyager) and the DBaaS
namespace billing reports under `/api/v1/dbaas/billing`.

All paths on this page are relative to `/api/v1`. Every endpoint requires
`Authorization: token <YOUR_TOKEN>` and resolves the acting organization from the
`org` query parameter (`?org=<org-slug>`). The `/dashboard/summary/*` routes require
`view_usage_analytics:site_admin`; the `/dbaas/billing/*` routes require org
ownership when an org is set. This group is available only on **billing-enabled
deployments**.

> **Verified:** every endpoint on this page returned `404 Not Found` against
> `appscode` on `<ace-host>` on 2026-07-14 — this deployment is not billing-enabled,
> so neither the `/dashboard/summary/*` nor the `/dbaas/billing/*` routes are
> registered. (Sanity: `GET /version` and `GET /user` returned `200` with the same
> token.)

## About usage-report views

Usage summaries are generated per month and per product. The individual view
endpoints (`objects`, `clusters`, `namespaces`, `gks`, `contracts`, quota-history,
cluster-mode) all return a **`UsageView`** — a complex, deeply-nested aggregation
structure whose exact shape varies by product and by the `view_type` query
parameter. It is modeled as a free-form JSON object, so the examples below show the
envelope rather than an exhaustive field list.

Common path parameters for the `summary` routes:

| Name | Type | Description |
|---|---|---|
| `year` | string | Four-digit report year (e.g. `2026`). |
| `month` | string | Report month (e.g. `06` or `June`, per the generated-months list). |

## Generated months

### GET /dashboard/summary/generated-months

Returns the year/month combinations for which a usage summary has been generated for
the owner.

- **Auth:** token; site-admin (`view_usage_analytics:site_admin`). Requires `?org=`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug. |

- **Response:** `200 OK` — a `GeneratedDates` object. `yearMonthList` is keyed by
  year, with a list of generated month names per year.

```json
{
  "yearMonthList": {
    "2026": ["January", "February", "March", "April", "May", "June"]
  }
}
```

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/dashboard/summary/generated-months?org=appscode"
```

> **Verified:** returned `404` against `appscode` — billing not enabled on this deployment.

### GET /dashboard/summary/object-quota-history/clusters/{clusterUID}/objects/{objectID}

Returns the quota-history usage view for a specific KubeDB object (not scoped to a
month).

- **Auth:** token; site-admin (`view_usage_analytics:site_admin`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `clusterUID` | string | Cluster UID. |
| `objectID` | string | Object (database) ID. |

- **Response:** `200 OK` — a `UsageView` (free-form object quota-history view).

> **Verified:** returned `404` against `appscode` — billing not enabled.

## KubeDB usage views

All routes below are rooted at
`/dashboard/summary/{year}/{month}/usage-report/products/kubeDb/views` and require
`view_usage_analytics:site_admin` and `?org=`. Each returns a `UsageView`.

### GET .../kubeDb/views/objects-usage-view

Returns the KubeDB objects usage view for the month, enriched with each object's
daily event count.

- **Query parameters (all optional):** `view_type` (string), `group` (string),
  `kind` (string), `clusterUID` (string), `namespace` (string), `namespaceUID`
  (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

```json
{
  "...": "free-form KubeDB objects usage view (varies by view_type)"
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/clusters-usage-view

Returns the KubeDB clusters usage view for the month.

- **Query parameters (all optional):** `view_type` (string), `group` (string),
  `kind` (string), `contractID` (integer).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/namespaces-usage-view

Returns the KubeDB namespaces usage view for the month.

- **Query parameters (all optional):** `view_type` (string), `clusterUID` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/gks-usage-view

Returns the KubeDB "GKs" (group/kind) usage view for the month, with the total
monthly usage matrix.

- **Query parameters (all optional):** `view_type` (string), `clusterUID` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/contracts-usage-view

Returns the KubeDB contracts usage view for the month.

- **Query parameters (all optional):** `view_type` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/object-quota-history-summaries-view

Returns the month-specific KubeDB object quota-history summaries.

- **Response:** `200 OK` — a `UsageView`.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/object-quota-history-summaries-view/clusters/{clusterUID}/objects/{objectID}

Returns the month-specific KubeDB object quota-history summary for a specific
cluster/object.

- **Path parameters:** `clusterUID` (string), `objectID` (string).
- **Response:** `200 OK` — a `UsageView`.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/objects-cluster-mode-usage-view

Returns the KubeDB objects cluster-mode usage history list for the month.

- **Response:** `200 OK` — a `UsageView`.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeDb/views/objects-cluster-mode-usage-view/clusters/{clusterUID}/objects/{objectID}

Returns the KubeDB cluster-mode usage history for a specific cluster/object.

- **Path parameters:** `clusterUID` (string), `objectID` (string).
- **Response:** `200 OK` — a `UsageView`.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## KubeStash, KubeVault, and Voyager usage views

Each of these products exposes a `clusters-usage-view` and a `contracts-usage-view`
for the month, rooted at
`/dashboard/summary/{year}/{month}/usage-report/products/{product}/views`. They
require `view_usage_analytics:site_admin` and `?org=`, and each returns a
`UsageView`.

### GET .../kubeStash/views/clusters-usage-view

Returns the KubeStash clusters usage view for the month.

- **Query parameters (all optional):** `view_type` (string), `contractID` (integer).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeStash/views/contracts-usage-view

Returns the KubeStash contracts usage view for the month.

- **Query parameters (all optional):** `view_type` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeVault/views/clusters-usage-view

Returns the KubeVault clusters usage view for the month.

- **Query parameters (all optional):** `view_type` (string), `contractID` (integer).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../kubeVault/views/contracts-usage-view

Returns the KubeVault contracts usage view for the month.

- **Query parameters (all optional):** `view_type` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../voyager/views/clusters-usage-view

Returns the Voyager clusters usage view for the month.

- **Query parameters (all optional):** `view_type` (string), `contractID` (integer).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET .../voyager/views/contracts-usage-view

Returns the Voyager contracts usage view for the month.

- **Query parameters (all optional):** `view_type` (string).
- **Response:** `200 OK` — a `UsageView`. `400` on invalid parameters.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Download

### GET /dashboard/summary/{year}/{month}/download

Renders and returns the KubeDB usage summary as a PDF document for the given month.

- **Auth:** token; site-admin (`view_usage_analytics:site_admin`). Requires `?org=`.
- **Path parameters:** `year` (string), `month` (string).
- **Response:** `200 OK` — the usage-report PDF (`application/pdf`, or
  `application/octet-stream`) as a binary body.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/dashboard/summary/2026/June/download?org=appscode" \
  -o usage-report.pdf
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

## DBaaS billing reports

These routes are rooted at `/dbaas/billing/reports`, require a token and `?org=`,
and are checked for org ownership when an org is set (rather than site-admin). Each
returns a pre-marshaled report view, modeled as a free-form `UsageView`.

### GET /dbaas/billing/reports/namespaces

Returns the DBaaS namespace report list (V1) for the owner.

- **Auth:** token; org-ownership when `org` is set. Requires `?org=`.
- **Response:** `200 OK` — a `UsageView` (free-form namespace report list).

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/dbaas/billing/reports/namespaces?org=appscode"
```

> **Verified:** returned `404` against `appscode` — billing not enabled on this deployment.

### GET /dbaas/billing/reports/clusters/{clusterID}/namespaces/{namespaceName}

Returns the DBaaS namespace report (V1) for a specific cluster/namespace.

- **Auth:** token; org-ownership when `org` is set. Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `clusterID` | string | Cluster ID. |
| `namespaceName` | string | Namespace name. |

- **Response:** `200 OK` — a `UsageView` (free-form namespace report).

> **Verified:** returned `404` against `appscode` — billing not enabled.
