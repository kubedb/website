---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-upgrade-platform-upgrade
    name: Platform Upgrade
    parent: api-ace-upgrade
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Platform Upgrade

Endpoints for upgrading the KubeDB Platform (the `ace-installer` Helm release) as a
whole and for inspecting its upgrade state. Paths below are relative to the API
root `/api/v1` (so `/upgrade` means `https://<akp-host>/api/v1/upgrade`).

**Authentication & authorization.** All routes require a personal access token
(`Authorization: token <YOUR_TOKEN>`). Platform upgrade routes are scoped to an
organization — pass `?org=<slug>` — and require **site-admin organization
authorization**:

- read routes (`GET`) require `view_upgrade_history:org`
  (`Organization_SiteAdminCanViewUpgradeHistory`);
- the trigger route (`POST /upgrade`) requires `upgrade_platform:org`
  (`Organization_SiteAdminCanUpgradePlatform`).

A request without the required site-admin authorization returns `403`.

The upgrade status and history responses are dynamic key/value maps read from the
latest upgrader `ConfigMap` — the exact keys depend on the installer and are not
a fixed schema.

## Query parameters

These apply to every endpoint on this page.

| Name | Type | Required | Description |
|---|---|---|---|
| `org` | string | yes | Organization slug providing the site-admin authorization context. |

---

## GET /upgrade

Returns the most recent KubeDB Platform upgrade status, taken from the latest
upgrader `ConfigMap` data. The response is a dynamic key/value map.

- **Auth:** token; site-admin org authz `view_upgrade_history:org`.
- **Query parameters:** `org` (see above).

**Response — `200 OK`.** A free-form JSON object (arbitrary Kubernetes
`ConfigMap` `data` keys). Example shape:

```json
{
  "status": "completed",
  "version": "v2026.6.19",
  "startedAt": "2026-06-19T10:02:11Z"
}
```

Returns `400` when no upgrade status is recorded yet.

> **Verified:** `GET /upgrade?org=appscode` returned `400` against `appscode`
> ("no upgrade status found") — no platform upgrade has been run on this
> environment, so there is no upgrader ConfigMap to report. On 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/upgrade?org=appscode"
```

---

## GET /upgrade/status

Returns the status of the most recent KubeDB Platform upgrade job — either `pending`
(with the target `version`) or `completed`.

- **Auth:** token; site-admin org authz `view_upgrade_history:org`.
- **Query parameters:** `org` (see above).

**Response — `200 OK`.**

```json
{
  "status": "completed"
}
```

| Field | Type | Description |
|---|---|---|
| `status` | string | Job status (`pending` or `completed`). |
| `version` | string | Target version; present when a job is `pending`. |

> **Verified:** `GET /upgrade/status?org=appscode` returned `200` against
> `appscode` (`{"status":"completed"}`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/upgrade/status?org=appscode"
```

---

## GET /upgrade/history

Returns the KubeDB Platform upgrade history as a list of `ConfigMap` data maps, each
augmented with a `status` field.

- **Auth:** token; site-admin org authz `view_upgrade_history:org`.
- **Query parameters:** `org` (see above).

**Response — `200 OK`.** A JSON array of dynamic key/value maps (each map's keys
are `ConfigMap` `data` entries plus a `status`). Example:

```json
[
  {
    "status": "completed",
    "version": "v2026.6.19",
    "startedAt": "2026-06-19T10:02:11Z"
  }
]
```

> **Verified:** `GET /upgrade/history?org=appscode` returned `200` against
> `appscode` (empty list `[]` — no upgrades recorded) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/upgrade/history?org=appscode"
```

---

## GET /upgrade/current-version

Returns the currently installed KubeDB Platform version (the `ace-installer` Helm
release version).

- **Auth:** token; site-admin org authz `view_upgrade_history:org`.
- **Query parameters:** `org` (see above).

**Response — `200 OK`.**

```json
{
  "version": "v2026.6.19"
}
```

| Field | Type | Description |
|---|---|---|
| `version` | string | Currently installed platform version. |

Returns `400` when no version can be determined.

> **Verified:** `GET /upgrade/current-version?org=appscode` returned `200`
> against `appscode` (`{"version":"v2026.6.19"}`) on 2026-07-14.

```
curl -H "Authorization: token $AKP_TOKEN" \
  "https://<akp-host>/api/v1/upgrade/current-version?org=appscode"
```

---

## POST /upgrade

Triggers an KubeDB Platform upgrade. The request is a `multipart/form-data` body
carrying the target version, a Helm values file, and an optional flag to use the
latest upgrader image. The upgrade runs asynchronously; poll `GET /upgrade/status`
for progress.

- **Auth:** token; site-admin org authz `upgrade_platform:org`.
- **Query parameters:** `org` (see above).

**Request body — `multipart/form-data` (`UpgradeOptions`):**

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string | yes | Target upgrade version. May be overridden by an `installerVersion` field inside the uploaded values file. |
| `valuesFile` | file (binary) | no | Helm values file (`values.yaml`) applied for the upgrade. |
| `useLatestImage` | boolean | no | When true, use the latest upgrader image for the target version. |

**Response.** `200` when the upgrade job is accepted and started. Returns `422`
for an invalid form or values file, and `403` when the caller lacks
`upgrade_platform:org` authorization.

```
curl -H "Authorization: token $AKP_TOKEN" \
  -F "version=v2026.6.19" \
  -F "valuesFile=@values.yaml" \
  -F "useLatestImage=false" \
  "https://<akp-host>/api/v1/upgrade?org=appscode"
```

> Not verified live: this is a mutating (`POST`) endpoint and is documented from
> the schema only.
