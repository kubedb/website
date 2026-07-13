---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v2-subscriptions
    name: Subscriptions & Inbox
    parent: api-cluster-management-v2
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Subscriptions & Inbox

Inbox notification subscriptions let the current user opt in to receive notifications
about a cluster, a namespace, or a specific resource. A companion endpoint issues an
**inbox agent token** that a cluster's inbox agent uses to authenticate.

All paths on this page are relative to `/api/v1` (the subscription routes live under
`/api/v1/clustersv2/...`; the agent-token route is `/api/v1/agent/...`). Every endpoint
requires a token (`Authorization: token <YOUR_TOKEN>`).

Common conventions:

- **owner** — the organization slug or username that owns the cluster (e.g. `appscode`).
- **cluster** — the cluster name within that owner's scope (e.g. `ace`, `arnob-dev`).
- Subscriptions are **per current user** — the authenticated caller is the subscriber.
- Each subscription resource supports three verbs on the same path: `POST` to subscribe,
  `GET` to check the subscription, and `DELETE` to unsubscribe. All return `200` on
  success (with no body).

Example request:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clustersv2/appscode/ace/subscriptions/
```

---

## Cluster-level subscription

Subscribe to inbox notifications for the entire cluster.

Path: `/clustersv2/{owner}/{cluster}/subscriptions/`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |

### POST /clustersv2/{owner}/{cluster}/subscriptions/

Subscribe the current user to cluster-level inbox notifications.

**Auth:** token. **Response:** `200` — subscription created (no body).

### GET /clustersv2/{owner}/{cluster}/subscriptions/

Check the current user's cluster-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription exists (no body).

> **Verified:** `GET` returned `500` against `appscode/ace` on 2026-07-14 — checking a
> subscription requires the inbox/notification backend, which is not provisioned on this
> test instance. The route is reachable and authorized (no 401/403).

### DELETE /clustersv2/{owner}/{cluster}/subscriptions/

Remove the cluster-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription removed (no body).

---

## Namespace-level subscription

Subscribe to inbox notifications for a single namespace in the cluster.

Path: `/clustersv2/{owner}/{cluster}/subscriptions/namespaces/{namespace}/`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |
| namespace | string | Namespace to subscribe to / check / unsubscribe from. |

### POST /clustersv2/{owner}/{cluster}/subscriptions/namespaces/{namespace}/

Subscribe the current user to namespace-level inbox notifications.

**Auth:** token. **Response:** `200` — subscription created (no body).

### GET /clustersv2/{owner}/{cluster}/subscriptions/namespaces/{namespace}/

Check the current user's namespace-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription exists (no body).

### DELETE /clustersv2/{owner}/{cluster}/subscriptions/namespaces/{namespace}/

Remove the namespace-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription removed (no body).

---

## Resource-level subscription

Subscribe to inbox notifications for one specific Kubernetes resource object, identified
by its group/version/resource and name within a namespace.

Path:
`/clustersv2/{owner}/{cluster}/subscriptions/namespaces/{namespace}/{group}/{version}/{resource}/{resourceName}`

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| owner | string | Organization slug or username. |
| cluster | string | Cluster name. |
| namespace | string | Namespace of the resource. |
| group | string | API group of the resource (use `core` or an empty-equivalent for the core group, per the resource's GVR). |
| version | string | API version of the resource (e.g. `v1`, `v1alpha2`). |
| resource | string | Resource plural name (e.g. `mongodbs`, `deployments`). |
| resourceName | string | Name of the specific resource object. |

Example path for a KubeDB MongoDB named `mg-shard` in namespace `demo`:

```
/clustersv2/appscode/arnob-dev/subscriptions/namespaces/demo/kubedb.com/v1/mongodbs/mg-shard
```

### POST .../{group}/{version}/{resource}/{resourceName}

Subscribe the current user to resource-level inbox notifications.

**Auth:** token. **Response:** `200` — subscription created (no body).

### GET .../{group}/{version}/{resource}/{resourceName}

Check the current user's resource-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription exists (no body).

### DELETE .../{group}/{version}/{resource}/{resourceName}

Remove the resource-level inbox subscription.

**Auth:** token. **Response:** `200` — subscription removed (no body).

---

## Inbox agent token

### GET /agent/{clusterName}/{clusterID}/token

Get an inbox agent JWT token for a cluster. The cluster's inbox agent uses this token
(and CA bundle) to authenticate when delivering notifications.

**Auth:** token.

> **Note:** this route lives under `/api/v1/agent/...`, not `/api/v1/clustersv2/...`, but
> it belongs to the Cluster Management v2 group.

**Path parameters:**

| Name | Type | Description |
|---|---|---|
| clusterName | string | Cluster name. |
| clusterID | string | Cluster UID. |

**Response:** `200` — an `InboxTokenRequestResponse`:

```json
{
  "agentJwtToken": "<jwt>",
  "caBundle": "<base64-ca>"
}
```

| Field | Type | Description |
|---|---|---|
| agentJwtToken | string | JWT the inbox agent uses to authenticate. Treat as a secret. |
| caBundle | string | Base64-encoded CA bundle for verifying the endpoint. |
