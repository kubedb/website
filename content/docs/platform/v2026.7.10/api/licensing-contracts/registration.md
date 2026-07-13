---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-licensing-contracts-registration
    name: License Registration
    parent: api-licensing-contracts
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# License Registration

Endpoints that member clusters (via `license-proxyserver`) and the console use to
validate a license, obtain a fresh license, and generate a proxy-server installer.

All paths on this page are relative to `/api/v1` (for example, `POST /register` is
`POST /api/v1/register`).

---

## `POST /register`

Register / validate a licensed user against a previously issued license. Used by
on-prem / air-gapped deployments; only available when self-registration is permitted
for the deployment type.

- **Auth:** public — no token required. The request must carry a valid `license`
  payload, which is cryptographically verified; a license-validation middleware also
  gates the request.

**Request body** (`application/json`):

```json
{
  "clusterUID": "c122d5e0-8d6b-4025-a2ff-63f5716053b1",
  "features": "kubedb",
  "caCert": "<base64-encoded CA certificate>",
  "license": "<base64-encoded license payload>"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterUID` | string | yes | UUID of the cluster being registered. |
| `features` | string | yes | Feature/product the license covers (empty value is rejected). |
| `caCert` | string (base64 bytes) | no | CA certificate used to verify the license chain. |
| `license` | string (base64 bytes) | yes | The license payload to validate. |

**Response:** `200 OK` — user registered (no body). Error responses:

| Status | Meaning |
|---|---|
| `400` | Bad request (empty `features` or unregistered `clusterUID`). |
| `403` | Registration not supported for this deployment type. |
| `422` | Unprocessable entity (invalid request body or license). |
| `500` | License verification or user creation failed. |

```bash
curl -X POST https://<ace-host>/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"clusterUID":"<uid>","features":"kubedb","license":"<base64>"}'
```

---

## `POST /license/issue`

Issue a license for the caller's cluster/product based on the caller's active contract.

- **Auth:** token (`Authorization: token <token>`, or `token`/`access_token` query
  parameter).

**Request body** (`application/json`):

```json
{
  "cluster": "c122d5e0-8d6b-4025-a2ff-63f5716053b1",
  "features": ["kubedb", "kubedb-provisioner"]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `cluster` | string | no | Cluster UUID the license is issued for. |
| `features` | array of string | no | Features to include on the license. |

**Response:** `200 OK` — the issued license.

```json
{
  "contract": {
    "id": "42",
    "startTimestamp": "2026-01-01T00:00:00Z",
    "expiryTimestamp": "2027-01-01T00:00:00Z"
  },
  "license": "<base64-encoded license certificate>"
}
```

`contract` echoes the contract the license was issued under; `license` is the license
certificate bytes (base64-encoded in JSON). Error responses:

| Status | Meaning |
|---|---|
| `401` | Unauthorized. |
| `403` | Forbidden (contract quota exceeded). |
| `405` | Contract invalid (revoked or expired). |
| `422` | Unprocessable entity (invalid request body). |
| `500` | Internal server error. |

```bash
curl -X POST -H "Authorization: token $ACE_TOKEN" \
  -H "Content-Type: application/json" \
  https://<ace-host>/api/v1/license/issue \
  -d '{"cluster":"<uid>","features":["kubedb"]}'
```

---

## `POST /user/license-proxy`

Generate a `license-proxyserver` installer script for the resolved organization. When
`clusterID` / `contractIDs` are supplied an **offline** installer is generated;
otherwise an **online** installer.

- **Auth:** token plus dynamic authorization on the organization. **AppsCode-hosted only.**

**Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | no | Owner (organization) context. Defaults to the caller. |

**Request body** (`application/json`):

```json
{
  "clusterID": "c122d5e0-8d6b-4025-a2ff-63f5716053b1",
  "contractIDs": [42, 43]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `clusterID` | string | no | Cluster UUID; presence selects the offline installer. |
| `contractIDs` | array of int64 | no | Contract IDs to bake into the offline installer. |

**Response:** `200 OK` — a dynamic JSON object (`map[string]any`) containing the
generated YAML / Helm 3 installer scripts (free-form object; keys depend on the
installer flavor). Error responses: `401` Unauthorized, `403` Forbidden, `422`
Unprocessable entity, `500` Internal server error.
