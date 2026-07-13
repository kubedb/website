---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-marketplace-metered-billing
    name: Metered Billing
    parent: api-marketplace
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Metered Billing Proxy

These endpoints live on the **main** API server under
`/api/v1/proxy/metered-billing/marketplaces/*`. Paths on this page are shown
relative to the `/api/v1` prefix. They proxy metered-usage reports and readiness
probes to the underlying cloud metering APIs — **AWS Marketplace Metering** and
**GCP Service Control**.

**Authentication & authorization.** All four endpoints require a **site-admin**
token. Send it as `Authorization: token <YOUR_TOKEN>` (or as a `token` /
`access_token` query parameter). Non-site-admin callers receive `403`;
unauthenticated callers receive `401`.

> **Deployment gating.** Each provider's routes are registered **only** for the
> matching b3 deployment type:
> - `aws/*` → `AWSMarketplaceDeployment`
> - `gcp/*` → `GCPMarketplaceDeployment`
>
> On any other deployment the routes **do not exist** and requests return `404`.
> Azure has no metering proxy wired up (Azure metering is handled via the webhook's
> `billingDetails.resourceUsageId` on the subscription side instead).

> **Availability on this platform.** The reference deployment (`appscode`) is a
> standard, non-marketplace install, so none of these routes are registered — the
> GET readiness probes below both returned `404`. The endpoints are documented from
> the OpenAPI schema.

---

## AWS metering

### POST /proxy/metered-billing/marketplaces/aws/report-usage

Forward a usage report to the AWS Marketplace Metering `MeterUsage` API.

- **Auth:** token, **site-admin** required.
- **Gated by:** `AWSMarketplaceDeployment`.

**Request body** (`MeterUsageInput`):

```json
{
  "DryRun": false,
  "ProductCode": "<aws-product-code>",
  "Timestamp": "2026-07-14T10:00:00Z",
  "UsageDimension": "nodes",
  "UsageQuantity": 3,
  "UsageAllocations": [
    {
      "AllocatedUsageQuantity": 3,
      "Tags": [
        { "Key": "cluster", "Value": "ace" }
      ]
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `ProductCode` | string | yes | AWS Marketplace product code. |
| `Timestamp` | string (date-time) | yes | Timestamp of the metering record. |
| `UsageDimension` | string | yes | The metered dimension being reported. |
| `DryRun` | boolean | no | If true, validate without recording usage. |
| `UsageQuantity` | integer (int64) | no | Quantity of the dimension consumed. |
| `UsageAllocations` | array (`UsageAllocation`) | no | Per-bucket allocation of the usage. |

**`UsageAllocation` fields:** `AllocatedUsageQuantity` (integer, required) and an
optional `Tags` array of `{ "Key", "Value" }` pairs.

**Response — `200`** (`MeterUsageOutput`):

```json
{ "MeteringRecordId": "<metering-record-id>" }
```

**Other statuses:** `400` AWS rejected the request — e.g. customer not entitled,
duplicate request, invalid product code, or throttling (`AwsMeteringProxyErr`
body); `401` auth required; `403` site-admin required; `422` unprocessable body;
`500` failed to report / unmapped AWS error code (`AwsMeteringProxyErr`).

`AwsMeteringProxyErr` shape:

```json
{
  "code": "CustomerNotEntitledException",
  "message": "the customer is not entitled to the product",
  "origErr": {}
}
```

### GET /proxy/metered-billing/marketplaces/aws/check/readiness

Readiness probe for the AWS metering proxy.

- **Auth:** token, **site-admin** required.
- **Gated by:** `AWSMarketplaceDeployment`.

**Response:** `200` proxy ready (empty body). `401` auth required; `403` site-admin
required.

**Example**

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/proxy/metered-billing/marketplaces/aws/check/readiness?org=appscode"
```

> **Verified:** returned `404` against `appscode` on 2026-07-14 — the AWS metering
> proxy route is not registered (this is not an `AWSMarketplaceDeployment`).

---

## GCP metering

### POST /proxy/metered-billing/marketplaces/gcp/report-usage

Forward a usage report to the GCP Service Control reporting API.

- **Auth:** token, **site-admin** required.
- **Gated by:** `GCPMarketplaceDeployment`.

**Request body** (`GcpUsageReport`):

```json
{
  "name": "services/ace.endpoints.<project>.cloud.goog",
  "startTime": "2026-07-14T09:00:00Z",
  "endTime": "2026-07-14T10:00:00Z",
  "labels": { "cluster": "ace" },
  "value": { "int64Value": 3 },
  "dimension": "nodes",
  "serviceName": "ace.endpoints.<project>.cloud.goog"
}
```

| Field | Type | Description |
|---|---|---|
| `name` | string | Operation / consumer resource name. |
| `startTime` | string (date-time) | Start of the usage window. |
| `endTime` | string (date-time) | End of the usage window. |
| `labels` | object (string→string) | Metric labels. |
| `value` | object (`GcpUsageValue`) | Usage value: `int64Value` and/or `doubleValue`. |
| `dimension` | string | The metered dimension. |
| `serviceName` | string | GCP managed service name. |

**Response — `200`:** the GCP Service Control report response (an arbitrary
Kubernetes-style / free-form object — passed through as-is).

**Other statuses:** `401` auth required; `403` site-admin required; `422`
unprocessable body; `500` failed to report to GCP Service Control.

### GET /proxy/metered-billing/marketplaces/gcp/check/readiness

Readiness probe for the GCP metering proxy.

- **Auth:** token, **site-admin** required.
- **Gated by:** `GCPMarketplaceDeployment`.

**Response:** `200` proxy ready (empty body). `401` auth required; `403` site-admin
required.

**Example**

```
curl -H "Authorization: token $ACE_TOKEN" \
  "https://<ace-host>/api/v1/proxy/metered-billing/marketplaces/gcp/check/readiness?org=appscode"
```

> **Verified:** returned `404` against `appscode` on 2026-07-14 — the GCP metering
> proxy route is not registered (this is not a `GCPMarketplaceDeployment`).
