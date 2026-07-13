---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-billing-dashboard-admin-dashboard
    name: Admin Billing Dashboard
    parent: api-billing-dashboard
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Admin Billing Dashboard

Site-admin endpoints under `/api/v1/dashboard` that back the platform-wide license
and billing administration screens: licensed users and their clusters, per-cluster
licenses and licensed products, resource/event histories, marketplace
subscriptions, and system-outage records.

All paths on this page are relative to `/api/v1`. Every endpoint requires
`Authorization: token <YOUR_TOKEN>`, resolves the acting organization from the
`org` query parameter (`?org=<org-slug>`), and requires site-admin authorization on
that org. This whole group is available only on **billing-enabled deployments**.

> **Verified:** every endpoint on this page returned `404 Not Found` against
> `appscode` on `<ace-host>` on 2026-07-14 — this deployment is not billing-enabled,
> so none of the `/dashboard/*` routes are registered. (Sanity: `GET /version` and
> `GET /user` returned `200` with the same token, confirming the platform and token
> are live.) Response bodies were the standard `{"message":"Not Found"}`.

Shared conventions on this page:

- **`uid`** is the numeric user (account) ID; **`cid`** is a cluster UID string;
  **`lid`** is a license ID string.
- **`limit`** (query, optional) sets the "active" window: a Go duration such as
  `720h` or a `YYYY-MM-DD` date. When omitted it defaults to roughly the last six
  months.
- Timestamps in these forms are Unix epoch values (`int64`) unless noted.

## Licensed users

### GET /dashboard/users/

Lists all users that have ever reported a license to this deployment.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug used to resolve site-admin context. |

- **Response:** `200 OK` — an array of licensed users.

```json
[
  {
    "username": "alice",
    "userType": "user",
    "email": "user@example.com",
    "userID": 42,
    "lastReceivedAt": 1718000000
  }
]
```

`403` is returned when the caller is not a site admin; `401` when unauthenticated.

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/dashboard/users/?org=appscode"
```

> **Verified:** returned `404` against `appscode` — billing not enabled on this deployment.

### GET /dashboard/users/active

Lists licensed users that have reported within the `limit` window (defaults to the
last ~6 months).

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug. |
| `limit` | string | no | Activity window: Go duration (e.g. `720h`) or `YYYY-MM-DD` date. |

- **Response:** `200 OK` — an array of `LicensedUserAPIForm` (same shape as above).

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/inactive

Lists licensed users that have never reported a licensed product.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Response:** `200 OK` — an array of `LicensedUserAPIForm`.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## A user's clusters

### GET /dashboard/users/{uid}/clusters/

Lists cluster information for the given licensed user.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `uid` | integer | User (account) ID. |

- **Response:** `200 OK` — an array of `ClusterInfo` objects.

```json
[
  {
    "id": 101,
    "displayName": "ACE Hub",
    "name": "ace",
    "uid": "<cluster-uid>",
    "ownerID": 42,
    "ownerName": "appscode",
    "provider": "GKE",
    "kubernetesVersion": "v1.29.4",
    "nodeCount": 3,
    "createdAt": "2026-01-10T09:00:00Z",
    "status": { "...": "rsapi.ClusterStatus (free-form Kubernetes-style object)" }
  }
]
```

The `status` field is a free-form Kubernetes-style object passed through verbatim.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/active

Lists clusters that reported for the given user within the `limit` window.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer) — user ID.
- **Query parameters:** `limit` (string, optional) — activity window.
- **Response:** `200 OK` — an array of `ActiveClustersAPIForm`.

```json
[
  {
    "username": "alice",
    "clusterID": "<cluster-uid>",
    "firstReceivedAt": 1700000000,
    "lastReceivedAt": 1718000000,
    "noOfAssociatedContracts": 2
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}

Returns cluster information for a specific user/cluster.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `uid` | integer | User (account) ID. |
| `cid` | string | Cluster UID. |

- **Response:** `200 OK` — a single `ClusterInfo` object (see above). `404` if the
  user/cluster pair is unknown.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## A user's licenses on a cluster

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/

Lists licensed plans associated with the given user and cluster.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string).
- **Response:** `200 OK` — an array of `LicensedPlan`.

```json
[
  {
    "uid": 42,
    "email": "user@example.com",
    "licenseID": "<license-id>",
    "clusters": ["<cluster-uid>"],
    "planName": "kubedb-enterprise",
    "notBefore": 1700000000,
    "notAfter": 1731600000,
    "registeredAt": 1700000000,
    "createdAt": 1700000000,
    "updatedAt": 1718000000
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/active

Lists licenses that reported within the `limit` window for the given user and cluster.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string).
- **Query parameters:** `limit` (string, optional) — activity window.
- **Response:** `200 OK` — an array of `ActiveLicenseAPIForm`.

```json
[
  {
    "username": "alice",
    "email": "user@example.com",
    "userId": 42,
    "licenseID": "<license-id>",
    "firstReceivedAt": 1700000000,
    "lastReceivedAt": 1718000000
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}

Returns a licensed plan together with the latest reported `SiteInfo`.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string) — license ID.
- **Response:** `200 OK` — an object with a `license` (a `LicensedPlan`, see above)
  and a `siteinfo` (a kmodules identity `SiteInfo`, a free-form Kubernetes-style
  object).

```json
{
  "license": { "licenseID": "<license-id>", "planName": "kubedb-enterprise", "clusters": ["<cluster-uid>"] },
  "siteinfo": { "...": "kmodules SiteInfo (free-form Kubernetes object)" }
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Licensed products for a license

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/

Lists reported licensed products for the given user/cluster/license.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string).
- **Query parameters:** `limit` (string, optional) — activity window.
- **Response:** `200 OK` — an array of `ReceivedLicensedProduct`.

```json
[
  {
    "userName": "alice",
    "userType": "user",
    "email": "user@example.com",
    "userID": 42,
    "clusterID": "<cluster-uid>",
    "licenseID": "<license-id>",
    "productName": "kube-db",
    "firstReceivedAt": 1700000000,
    "lastReceivedAt": 1718000000
  }
]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/{productName}

Returns the reported licensed product for a specific product.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string),
  `productName` (string).
- **Query parameters:** `limit` (string, optional) — activity window.
- **Response:** `200 OK` — a single `ReceivedLicensedProduct` (see above).

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/{productName}/resources

Fetches the badger resource history for a product from the member cluster over NATS.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string),
  `productName` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `group` | string | no | Kubernetes API group filter. |
| `resource` | string | no | Kubernetes resource filter. |

- **Response:** `200 OK` — a `BadgerEntryList` of resource-history entries. Each
  entry carries a `key`, a `lastSeen` timestamp, and a list of `BadgerValue`
  versions; the `resource`/`resourceID` inside each value are free-form Kubernetes
  objects passed through from the member cluster.

```json
{
  "items": [
    {
      "key": "<resource-key>",
      "lastSeen": 1718000000,
      "values": [
        {
          "resourceID": { "...": "free-form Kubernetes object" },
          "licenseID": "<license-id>",
          "version": 3,
          "timestamp": 1718000000
        }
      ]
    }
  ]
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/{productName}/events-histories

Returns an events-history report for a specific resource (admin/testing use).

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string),
  `productName` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `group` | string | no | Kubernetes API group. |
| `resource` | string | no | Kubernetes resource. |
| `rid` | string | no | Resource ID (object UID). |

- **Response:** `200 OK` — an `EventsReport`.

```json
{
  "userID": 42,
  "clusterID": "<cluster-uid>",
  "licenseID": "<license-id>",
  "group": "kubedb.com",
  "resource": "mongodbs",
  "resourceID": "<object-uid>",
  "totalEvents": 128,
  "eventsTimeHistories": ["2026-06-01T00:00:00Z", "2026-06-02T00:00:00Z"],
  "eventsDurationHours": 720.0,
  "averageEventsPerHour": 0.18
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/{productName}/events/

Returns the tabular event list for a licensed user's cluster/license/product.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string),
  `productName` (string).
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

### GET /dashboard/users/{uid}/clusters/{cid}/licenses/{lid}/products/{productName}/events/raw-event

Returns the raw badger value for a specific event key/version.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `uid` (integer), `cid` (string), `lid` (string),
  `productName` (string).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Badger event key. |
| `version` | integer | yes | Event version (uint). |

- **Response:** `200 OK` — a single `BadgerValue` (see the resources endpoint
  above). `400` when `key`/`version` are missing or invalid.

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Active licenses for a cluster

### GET /dashboard/clusters/{cid}/licenses/active

Lists licenses that reported within the `limit` window for the given cluster, across
all users.

- **Auth:** token; site-admin (`view_licensed_users:site_admin`). Requires `?org=`.
- **Path parameters:** `cid` (string) — cluster UID.
- **Query parameters:** `limit` (string, optional) — activity window.
- **Response:** `200 OK` — an array of `ActiveLicenseAPIForm` (see above).

> **Verified:** returned `404` against `appscode` — billing not enabled.

## System outages

### POST /dashboard/system-outages/

Records a system-outage window for an account/cluster.

- **Auth:** token; site-admin (`view_system_outages:site_admin`). Requires `?org=`.
- **Request body:** a `SystemOutageRequest`.

```json
{
  "accountName": "appscode",
  "clusterID": "<cluster-uid>",
  "start": "2026-06-01T00:00:00Z",
  "end": "2026-06-01T02:30:00Z",
  "tags": ["network", "planned"],
  "comments": "Planned maintenance window."
}
```

| Name | Type | Required | Description |
|---|---|---|---|
| `accountName` | string | no | Account (organization/user) name the outage applies to. |
| `clusterID` | string | no | Cluster UID the outage applies to. |
| `start` | date-time | yes | Outage start (RFC3339). |
| `end` | date-time | yes | Outage end (RFC3339). |
| `tags` | string[] | no | Free-form tags for grouping/reporting. |
| `comments` | string | no | Human-readable notes. |

- **Response:** `201 Created` — the stored `SystemOutageApiForm` (fields as above
  plus a server-assigned `id`, `accountID`, and `createdAt`). `409` if an
  overlapping entry already exists; `422` on validation failure.

### GET /dashboard/system-outages/report

Lists system-outage entries with an aggregated report (top tags, accounts, and
clusters by duration).

- **Auth:** token; site-admin (`view_system_outages:site_admin`). Requires `?org=`.
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `start` | string | no | RFC3339 start-time filter. |
| `account_id` | string | no | Filter by account ID. |
| `cluster_id` | string | no | Filter by cluster ID. |
| `tags` | string[] | no | Filter by tags (repeatable). |

- **Response:** `200 OK` — a `SystemOutagesAndReportAPIForm` with an aggregated
  `report` and the matching `entries`.

```json
{
  "report": {
    "totalOutages": 3,
    "totalDurationHours": 6.5,
    "topTagsPercentage": [{ "tag": "network", "percentage": 66.7 }],
    "topAccountsDuration": [
      { "entity": "account", "entityName": "appscode", "durationHours": 4.0, "percentage": 61.5 }
    ],
    "topClustersDuration": [
      { "entity": "cluster", "entityName": "ace", "durationHours": 2.5, "percentage": 38.5 }
    ]
  },
  "entries": [
    {
      "id": 1,
      "accountID": 42,
      "accountName": "appscode",
      "clusterID": "<cluster-uid>",
      "start": "2026-06-01T00:00:00Z",
      "end": "2026-06-01T02:30:00Z",
      "tags": ["network"],
      "comments": "Planned maintenance window.",
      "createdAt": "2026-06-01T03:00:00Z"
    }
  ]
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/system-outages/tags

Lists all unique tags used across system-outage entries.

- **Auth:** token; site-admin (`view_system_outages:site_admin`). Requires `?org=`.
- **Response:** `200 OK` — an array of tag strings.

```json
["network", "planned", "storage"]
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

## Marketplace subscriptions

### GET /dashboard/marketplaces/subscriptions

Lists all marketplace subscriptions (minimal API form), newest-updated first.

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Response:** `200 OK` — an array of `Subscription`.

```json
[
  {
    "marketplace": "Azure",
    "subscriptionId": "<subscription-id>",
    "subscriberId": 42,
    "requesterId": 42,
    "boundedInstallerId": "<installer-id>",
    "state": "Running",
    "isRevocable": true,
    "noOfBillingEventSent": 12,
    "createdAt": "2026-01-10T09:00:00Z",
    "lastUpdatedAt": "2026-06-01T00:00:00Z"
  }
]
```

`marketplace` is one of `Aws`, `Azure`, `Gcp`; `state` is one of `Pending`,
`Bounded`, `Running`, `Failed`, `Deleting`, `DeletionFailed`, `Deleted`, `Revoked`.
The per-marketplace `awsBillingDetails` / `azureBillingDetails` / `gcpBillingDetails`
objects are omitted here for brevity (they carry marketplace-specific billing
identifiers).

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/marketplaces/settings/warnings

Returns configuration warnings for marketplace integrations (e.g. Azure
client-secret expiry).

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Response:** `200 OK` — a `SettingWarnings` object: a `warnings` map keyed by
  marketplace, each value a list of `{ "Level": "...", "Msg": "..." }` warnings.

```json
{
  "warnings": {
    "Azure": [{ "Level": "warning", "Msg": "Client secret expires in 14 days." }]
  }
}
```

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/marketplaces/{marketplace}/{subscriptionId}

Returns the full API form of a marketplace subscription.

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Path parameters:**

| Name | Type | Description |
|---|---|---|
| `marketplace` | string | Marketplace identifier (`Aws`, `Azure`, `Gcp`). |
| `subscriptionId` | string | Marketplace subscription ID. |

- **Response:** `200 OK` — a `Subscription` (see above). `400` if the subscription
  is not found or invalid.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### DELETE /dashboard/marketplaces/{marketplace}/{subscriptionId}

Revokes a revocable marketplace subscription and all associated contracts.

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Path parameters:** `marketplace` (string), `subscriptionId` (string).
- **Response:** `200 OK` on success. `400` if the subscription is not found or not
  revocable.

### GET /dashboard/marketplaces/{marketplace}/{subscriptionId}/ping

Pings the hosted `b3` metering-readiness endpoint for a subscription (AWS or GCP
only).

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Path parameters:** `marketplace` (string), `subscriptionId` (string).
- **Response:** `200 OK` when the endpoint is reachable. `400` if the subscription
  is not found or the marketplace is unsupported.

> **Verified:** returned `404` against `appscode` — billing not enabled.

### GET /dashboard/marketplaces/{marketplace}/{subscriptionId}/audit-logs

Returns audit-event reports for a marketplace subscription, grouped by audit period.

- **Auth:** token; site-admin (`view_marketplace_usage:site_admin`). Requires `?org=`.
- **Path parameters:** `marketplace` (string), `subscriptionId` (string).
- **Response:** `200 OK` — an `AuditReportsResp`: an `auditReports` map keyed by
  audit period, each value a list of `MarketplaceAuditEvent`.

```json
{
  "auditReports": {
    "2026-06": [
      {
        "marketplace": "Azure",
        "subscriptionID": "<subscription-id>",
        "status": "success",
        "operationType": "report-usage",
        "description": "Reported metered usage.",
        "data": { "...": "free-form event payload" },
        "timestamp": "2026-06-01T00:00:00Z"
      }
    ]
  }
}
```

`400` if the subscription is not found.

> **Verified:** returned `404` against `appscode` — billing not enabled.
