---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-marketplace-webhook-service
    name: Webhook Service
    parent: api-marketplace
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Marketplace Webhook Service

> **Separate listener.** Unlike every other page in this reference, these routes are
> **not** served under `/api/v1`. They live on a dedicated marketplace webhook
> listener rooted at **`/marketplace/api/v1`**, run by the b3 `marketplace`
> subcommand. Paths below are relative to that root
> (`/marketplace/api/v1/...`). This listener exists only on marketplace
> deployments (AWS / Azure / GCP marketplace modes).

The webhook service handles inbound subscription lifecycle events pushed by the cloud
marketplaces, answers the public "is this standalone org claimable?" check used by
the claim flow, and exposes a version endpoint identical in shape to the main
server's `/api/v1/version`.

**Authentication model.** None of these endpoints use a platform bearer token. The
claimable check and version endpoint are **public**. The three notification
endpoints are authenticated by the **webhook itself** — by verifying the payload and
either the source IP range (AWS) or a per-installer `secret` query parameter
(Azure / GCP) — not by ACE token/session security.

> **Availability on this platform.** The `/marketplace/api/v1/*` root is **not
> served** on the reference deployment (`appscode`, a standard non-marketplace
> install). Requests to it fall through to the web frontend and return HTTP `200`
> with `Content-Type: text/html` (the SPA), rather than the JSON documented here.
> The endpoints below are therefore documented from the OpenAPI schema and marked
> as not deployed; treat the JSON examples as the shapes returned by an actual
> marketplace deployment.

---

## Claimable check

### GET /marketplaces/standalone-organizations/{claimID}/claimable

Evaluate the claim-rules flags of a standalone (marketplace-created) organization,
identified by its claim ID, and report whether it can currently be claimed. The
check is proxied to the central marketplace server.

- **Auth:** public (`security: []`). No token required.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| `claimID` | string | The claim ID of the standalone organization. |

**Response — `200`** (`OrgClaimableCheckResp`). Returned both when the org is
claimable and when the retry backoff has not yet expired but the org is already
flagged claimable.

```json
{
  "isClaimable": true,
  "claimID": "01HZK9<claim-id>"
}
```

| Field | Type | Description |
|---|---|---|
| `isClaimable` | boolean | Whether the standalone organization can currently be claimed. |
| `claimID` | string | Echo of the claim ID that was checked. |

**Other statuses:** `404` standalone org not found; `409` already claimed; `429`
retry backoff not yet expired — try again later; `500` error while evaluating claim
rules. Error bodies use the marketplace `ApiError` shape:

```json
{ "message": "standalone organization already claimed" }
```

**Example**

```
curl https://<ace-host>/marketplace/api/v1/marketplaces/standalone-organizations/<claimID>/claimable
```

> **Verified:** returned `200` with `Content-Type: text/html` against the reference
> host on 2026-07-14 — i.e. the marketplace webhook listener is **not deployed**
> here and the request was served by the web frontend SPA (catch-all), not the
> webhook service. Documented from schema.

---

## Subscription notifications (webhook callbacks)

These three endpoints are the callback targets registered with each cloud
marketplace. They are **POST** only and are called by the marketplace, not by
platform clients — they are documented here for completeness. On a successful bind
they return the generated installer archive **download link**.

### POST /marketplaces/aws/notification/resource

Handle an AWS Marketplace bind-event notification.

- **Auth:** enforced by the webhook. The payload is verified (`marketplace` must be
  `Aws`; cluster ID and options validated) and, outside dev run mode, the source IP
  must fall within the allowed AWS EC2 IP ranges. No platform bearer-token security.

**Request body** (`AwsWebhookNotification`):

```json
{
  "eventType": "subscribe-success",
  "eventTime": "2026-07-14T10:00:00Z",
  "bindingInfo": {
    "marketplace": "Aws",
    "installerId": "inst-abc123",
    "clusterId": "cls-abc123",
    "AWSAccountID": "111122223333",
    "adminUsername": "admin",
    "adminPassword": "<redacted>",
    "domainWhiteList": ["example.com"],
    "options": {}
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `eventType` | string | no | Marketplace event type. |
| `eventTime` | string (date-time) | no | Time the event was emitted. |
| `bindingInfo` | object (`BindingInfo`) | yes | Subscription binding details (see below). |

**`BindingInfo` fields** (shared by AWS/Azure/GCP; embeds `InitialInput`):

| Field | Type | Description |
|---|---|---|
| `marketplace` | string (`Aws`/`Azure`/`Gcp`) | Marketplace identifier. |
| `installerId` | string | Installer this subscription binds to. |
| `clusterId` | string | Target cluster ID. |
| `AWSAccountID` | string | AWS account ID (AWS only). |
| `adminUsername` | string | Initial admin username for the deployment. |
| `adminPassword` | string | Initial admin password (sensitive). |
| `domainWhiteList` | string[] | Allowed email/login domains. |
| `options` | object | Free-form installer options. |

**Response — `200`:** subscription bound; returns the installer archive link.

```json
{ "link": "https://<ace-host>/.../installer-archive.tgz" }
```

**Other statuses:** `400` payload / binding-info / option processing failed; `403`
request from an unauthorized IP; `500` provisioning error (`ApiError` body).

### POST /marketplaces/azure/notification/resource

Handle an Azure Marketplace lifecycle notification (`PUT`, `DELETE`, `BIND`).

- **Auth:** enforced by the webhook via a per-installer `secret` query parameter
  that must match the configured marketplace API secret. No platform bearer-token
  security.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `secret` | string | no | Marketplace API secret used to authenticate the Azure webhook call. |

**Request body** (`AzureWebhookNotification`). Note: `managedResourceGroupId` and
`resourceIdParts` are populated server-side and are **not** part of the incoming
JSON payload.

```json
{
  "eventType": "BIND",
  "applicationId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/...",
  "eventTime": "2026-07-14T10:00:00Z",
  "provisioningState": "Succeeded",
  "billingDetails": { "resourceUsageId": "<usage-id>" },
  "plan": {
    "publisher": "appscode",
    "product": "ace",
    "name": "standard",
    "version": "v2026.6.19"
  },
  "bindingInfo": {
    "marketplace": "Azure",
    "installerId": "inst-abc123",
    "clusterId": "cls-abc123"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `eventType` | string | Lifecycle event (`PUT`, `DELETE`, `BIND`). |
| `applicationId` | string | Azure application resource ID. |
| `managedResourceGroupId` | string | Managed resource group (server-populated). |
| `resourceIdParts` | object | Parsed resource-ID parts (server-populated). |
| `eventTime` | string (date-time) | Event time. |
| `provisioningState` | string | Azure provisioning state. |
| `billingDetails.resourceUsageId` | string | Azure metered-billing resource usage ID. |
| `plan` | object | Publisher / product / name / version of the plan. |
| `error` | object | Error code/message/details, when the event reports a failure. |
| `bindingInfo` | object (`BindingInfo`) | Subscription binding details. |

**Response — `200`:** notification processed. For `PUT`/`DELETE` an empty body with
status `200`; for `BIND` the installer archive `link` is returned.

**Other statuses:** `400` invalid subscription ID / unknown event type / invalid
binding info; `403` secret mismatch (or subscription not found while revoking
contracts on delete); `500` processing error.

### POST /marketplaces/gcp/notification/resource

Handle a GCP Marketplace bind-event notification.

- **Auth:** enforced by the webhook via a per-installer `secret` query parameter
  that must match the configured marketplace API secret (bypassed only for the
  designated GCP Marketplace test installer). No platform bearer-token security.

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `secret` | string | no | Marketplace API secret used to authenticate the GCP webhook call. |

**Request body** (`GcpWebhookNotification`):

```json
{
  "eventType": "subscribe-success",
  "eventTime": "2026-07-14T10:00:00Z",
  "bindingInfo": {
    "marketplace": "Gcp",
    "installerId": "inst-abc123",
    "clusterId": "cls-abc123"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `eventType` | string | no | Marketplace event type. |
| `eventTime` | string (date-time) | no | Event time. |
| `bindingInfo` | object (`BindingInfo`) | yes | Subscription binding details. |

**Response — `200`:** subscription bound; returns the installer archive link.

```json
{ "link": "https://<ace-host>/.../installer-archive.tgz" }
```

**Other statuses:** `400` invalid binding info / installer lookup failure; `403`
secret mismatch or installer already bound; `500` provisioning error.

---

## Version

### GET /version

Return the version of the marketplace webhook service. Identical in shape to the
main server's `GET /api/v1/version`.

- **Auth:** public (`security: []`).

**Response — `200`** (`ServerVersion`):

```json
{ "version": "v2026.6.19" }
```

| Field | Type | Description |
|---|---|---|
| `version` | string | Server application version. |

**Example**

```
curl https://<ace-host>/marketplace/api/v1/version
```

> **Verified:** returned `200` with `Content-Type: text/html` against the reference
> host on 2026-07-14 — the `/marketplace/api/v1` listener is **not deployed** here,
> so the request was served by the web frontend SPA, not the webhook service. For
> comparison, the main server's `GET /api/v1/version` returned `200` with
> `{"version":"v2026.6.19"}` (`application/json`) — that is the shape this endpoint
> returns on an actual marketplace deployment.
