---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v1-helm
    name: Helm
    parent: api-cluster-management-v1
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Helm

Manage Helm on a member cluster: the Helm console (tiller) configuration, Helm v3
release lifecycle (list/install/upgrade/uninstall/rollback, plus content, status, and
history), chart bundle/package views, and the resource editor used to generate and
apply installations.

All paths on this page are relative to:

```
/api/v1/clusters/{owner}/{cluster}
```

All endpoints require a token (`Authorization: token <YOUR_TOKEN>`). Common path
parameters used throughout this page:

| Name | Type | Description |
|---|---|---|
| `owner` | string | Organization slug or username that owns the cluster. |
| `cluster` | string | Cluster name. |
| `name` | string | Helm release name (on release endpoints). |

Several install/upgrade/uninstall/rollback/editor operations are submitted as async
tasks and return a `TaskResponse` (`{ "id": "...", "subject": "..." }`) rather than
completing synchronously. Many request/response bodies are opaque Kubernetes-style or
Helm library objects, passed through verbatim; those are noted per endpoint.

A documented call looks like:

```
curl -H "Authorization: token $ACE_TOKEN" \
  https://<ace-host>/api/v1/clusters/appscode/ace/helm/v3/releases/
```

---

## Console (tiller) configuration

### GET /clusters/{owner}/{cluster}/helm/tiller-config

Get the Helm console (tiller/driver) config.

- **Auth:** token.
- **Response:** `200` with a `ConsoleConfig`.

```json
{
  "id": 1,
  "userID": 2,
  "clusterID": "<uid>",
  "type": 1,
  "data": { "driver": { "helm3": { "driverName": "Secret" } } },
  "createdUnix": 1783967505,
  "updatedUnix": 1783967505
}
```

| Field | Type | Description |
|---|---|---|
| `id` | integer | Config record ID. |
| `userID` | integer | Owning user ID. |
| `clusterID` | string | Cluster UID. |
| `type` | string/int | Setting type (`models.SettingType`). |
| `data` | object | Config payload (e.g. the Helm driver options). |
| `createdUnix` / `updatedUnix` | integer | Unix create/update timestamps. |

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) and
> `appscode/arnob-dev` (spoke) on 2026-07-14.

### PUT /clusters/{owner}/{cluster}/helm/tiller-config

Update the Helm console (tiller/driver) config.

- **Auth:** token.
- **Request body:** a `TillerOptions` object.

```json
{ "driver": { "helm3": { "driverName": "Secret" } } }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `driver.helm3.driverName` | string | no | Helm 3 storage driver (e.g. `Secret`, `ConfigMap`). |

- **Response:** `200` with the updated `ConsoleConfig`.

### GET /clusters/{owner}/{cluster}/helm/tiller-config/default

Get the default Helm console (tiller) config.

- **Auth:** token.
- **Response:** `200` with a `ConsoleConfig` (same shape as above).

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) on 2026-07-14.

---

## Helm v3 releases

### GET /clusters/{owner}/{cluster}/helm/v3/releases/

List Helm v3 releases in the cluster.

- **Auth:** token.
- **Request body:** optional Helm list options (`action.ListOptions`), passed as an
  opaque object.
- **Response:** `200` with an array of Helm `release.Release` objects.

```json
[
  {
    "name": "ace",
    "info": {
      "first_deployed": "2026-07-05T06:42:46Z",
      "last_deployed": "2026-07-05T06:49:03Z",
      "status": "deployed",
      "description": "Upgrade complete"
    },
    "chart": { "metadata": { "name": "ace" } }
  }
]
```

> **Verified:** `GET` returned `200` against `appscode/ace` (hub) and
> `appscode/arnob-dev` (spoke) on 2026-07-14.

### POST /clusters/{owner}/{cluster}/helm/v3/releases/

Install a Helm v3 release. Submitted as an async task.

- **Auth:** token.
- **Request body:** Helm install options (`action.InstallOptions`), passed as an
  opaque object.
- **Response:** `200` with a `TaskResponse`.

```json
{ "id": "task-9f8e7d", "subject": "tasks.helm.install" }
```

### GET /clusters/{owner}/{cluster}/helm/v3/releases/{name}/

Get the revision history of a Helm release.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `max` | integer | no | Maximum number of history revisions to return. |

- **Response:** `200` with an array of Helm `release.Release` objects (one per
  revision); `404` if the release is not found.

### PUT /clusters/{owner}/{cluster}/helm/v3/releases/{name}/

Upgrade a Helm v3 release. Submitted as an async task.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Request body:** Helm upgrade options (`action.UpgradeOptions`), passed as an
  opaque object.
- **Response:** `200` with a `TaskResponse`; `404` if the release is not found.

### DELETE /clusters/{owner}/{cluster}/helm/v3/releases/{name}/

Uninstall a Helm v3 release. Submitted as an async task.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Request body:** an `UninstallReleaseRequest`.

```json
{
  "namespace": "default",
  "disable_hooks": false,
  "purge": true,
  "timeout": 300
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | no | Namespace of the release. |
| `disable_hooks` | boolean | no | Skip running lifecycle hooks. |
| `purge` | boolean | no | Remove the release history. |
| `timeout` | integer (int64) | no | Operation timeout (seconds). |

- **Response:** `200` with a `TaskResponse`; `404` if the release is not found.

### GET /clusters/{owner}/{cluster}/helm/v3/releases/{name}/content

Get the content (manifest and metadata) of a Helm release.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Query parameters:**

| Name | Type | Required | Description |
|---|---|---|---|
| `version` | integer | no | Specific release revision. |
| `namespace` | string | no | Namespace of the release. |

- **Response:** `200` with the Helm `release.Release` object.

### GET /clusters/{owner}/{cluster}/helm/v3/releases/{name}/status

Get the status of a Helm release.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Query parameters:** `version` (integer, optional revision) and `namespace`
  (string, optional).
- **Response:** `200` with the Helm `release.Release` object.

### POST /clusters/{owner}/{cluster}/helm/v3/releases/{name}/rollback

Roll back a Helm v3 release to a previous revision. Submitted as an async task.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `name` (release name).
- **Request body:** a `RollbackReleaseRequest`.

```json
{
  "namespace": "default",
  "version": 2,
  "dry_run": false,
  "recreate": false,
  "wait": true,
  "force": false,
  "timeout": 300,
  "description": "rollback to v2"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `namespace` | string | no | Namespace of the release. |
| `version` | integer (int32) | no | Target revision to roll back to. |
| `dry_run` | boolean | no | Simulate the rollback. |
| `disable_hooks` | boolean | no | Skip lifecycle hooks. |
| `recreate` | boolean | no | Recreate pods. |
| `wait` | boolean | no | Wait until resources are ready. |
| `force` | boolean | no | Force resource updates. |
| `cleanup_on_fail` | boolean | no | Delete new resources on failure. |
| `timeout` | integer (int64) | no | Operation timeout (seconds). |
| `description` | string | no | Rollback description. |

- **Response:** `200` with a `TaskResponse`; `404` if the release is not found.

---

## Bundle & package views

These endpoints let you inspect a chart before installing it. The bundle/package
request and response bodies are `releasesapi`/`chartsapi` objects passed through as
opaque objects.

### GET /clusters/{owner}/{cluster}/helm/bundleview

Get the bundle view for a chart.

- **Auth:** token.
- **Request body:** a chart source reference (`releasesapi.ChartSourceFlatRef`).
- **Response:** `200` with the bundle view (`releasesapi.BundleView`).

### POST /clusters/{owner}/{cluster}/helm/bundleview/orders

Create an order for a bundle view.

- **Auth:** token.
- **Request body:** a bundle view (`releasesapi.BundleView`).
- **Response:** `200` with the generated order (`releasesapi.Order`).

### GET /clusters/{owner}/{cluster}/helm/packageview

Get the package view for a chart.

- **Auth:** token.
- **Request body:** a chart source reference (`releasesapi.ChartSourceFlatRef`).
- **Response:** `200` with the package view (`releasesapi.PackageView`).

### GET /clusters/{owner}/{cluster}/helm/packageview/files

List the files inside a chart package.

- **Auth:** token.
- **Request body:** a chart source reference (`releasesapi.ChartSourceFlatRef`).
- **Response:** `200` with an array of file-path strings.

```json
["Chart.yaml", "values.yaml", "templates/deployment.yaml"]
```

### GET /clusters/{owner}/{cluster}/helm/packageview/files/{path}

Get a single file from a chart package.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `path` (the file path within the chart
  package).
- **Request body:** a chart source reference (`releasesapi.ChartSourceFlatRef`).
- **Response:** `200` with the raw file content (`application/octet-stream`;
  content-type varies); `404` if the file is not found.

### POST /clusters/{owner}/{cluster}/helm/packageview/orders

Create an order for an editor package view / chart.

- **Auth:** token.
- **Request body:** a chart order (`releasesapi.ChartOrder`).
- **Response:** `200` with the generated order (`releasesapi.Order`).

### GET /clusters/{owner}/{cluster}/helm/packageview/values

Get the merged values file for a chart preset.

- **Auth:** token.
- **Request body:** a chart preset reference (`chartsapi.ChartPresetFlatRef`).
- **Response:** `200` with the merged chart values (a dynamic map).

---

## Resource editor

The editor generates an editor model from options, previews the resulting manifest
and resources, applies (installs/updates) or deletes an installation, and loads state
back from an existing install. The `options` bodies are arbitrary JSON objects; the
load/apply bodies are `releasesapi` objects passed through opaquely.

### PUT /clusters/{owner}/{cluster}/helm/options/model

Generate an editor model from options.

- **Auth:** token.
- **Request body:** an arbitrary JSON options object.
- **Response:** `200` with the generated editor model (unstructured object; YAML when
  requested).

### PUT /clusters/{owner}/{cluster}/helm/options/manifest

Preview the editor manifest from options.

- **Auth:** token.
- **Request body:** an arbitrary JSON options object.
- **Response:** `200` with the rendered manifest as raw `text/plain` YAML.

### PUT /clusters/{owner}/{cluster}/helm/options/resources

Preview the editor resources from options.

- **Auth:** token.
- **Request body:** an arbitrary JSON options object.
- **Response:** `200` with the rendered resources (`releasesapi.ResourceOutput`).

### PUT /clusters/{owner}/{cluster}/helm/editor/

Apply (create/update/install) a resource editor model. Submitted as an async task.

- **Auth:** token.
- **Request body:** an arbitrary JSON editor model object.
- **Response:** `200` with a `TaskResponse`.

### DELETE /clusters/{owner}/{cluster}/helm/editor/

Delete a resource editor installation. Submitted as an async task.

- **Auth:** token.
- **Request body:** resource metadata (`releasesapi.MetadataFlat`).
- **Response:** `200` with a `TaskResponse`.

### PUT /clusters/{owner}/{cluster}/helm/editor/model

Load an editor model from an existing installation.

- **Auth:** token.
- **Request body:** an editor model (`releasesapi.Model`).
- **Response:** `200` with the editor model values (raw JSON/YAML).

### PUT /clusters/{owner}/{cluster}/helm/editor/manifest

Load the editor manifest from an existing installation.

- **Auth:** token.
- **Request body:** an editor model (`releasesapi.Model`).
- **Response:** `200` with the rendered manifest as raw `text/plain` YAML.

### PUT /clusters/{owner}/{cluster}/helm/editor/resources

Load the editor resources from an existing installation.

- **Auth:** token.
- **Request body:** editor model metadata (`releasesapi.ModelMetadata`).
- **Response:** `200` with the rendered resources (`releasesapi.ResourceOutput`).
