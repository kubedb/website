---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v1-overview
    name: Overview
    parent: api-cluster-management-v1
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cluster Management v1

The core cluster API. Every endpoint is scoped to a single cluster identified by
`{owner}` (the organization slug or username that owns the cluster) and `{cluster}`
(the cluster name), and is served under:

```
/api/v1/clusters/{owner}/{cluster}/...
```

All routes require a personal access token sent as
`Authorization: token <YOUR_TOKEN>` (it may also be supplied as a `token` or
`access_token` query parameter). Cluster routes additionally resolve the cluster's
stored credentials and build a Kubernetes client for it ("cluster assignment"); a
few routes layer on extra authorization checks, which are called out per endpoint.

This group covers three related surfaces:

`/api/v1/clusters/:owner/:cluster`

The core cluster API: lifecycle, a generic Kubernetes resource proxy, and Helm release management.
All routes require Token; cluster routes resolve credentials and build a Kubernetes client
("Cluster assignment").

## Lifecycle & info

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get cluster details |
| PUT | `/` | Update cluster (import options) |
| DELETE | `/` | Delete cluster (returns deletion command) |
| POST | `/remove` | Remove cluster registration |
| GET | `/client-config` | Get client kubeconfig |
| GET | `/available-types` | Discover available resource types |
| GET | `/db-status`, `/db-bundle` | Database status / bundle |
| POST | `/update-presets/:preset` | Update presets in a spoke cluster |
| GET | `/is-server` | Check if this is the hub cluster |
| GET | `/feature/factory-values` | Default feature values |
| POST | `/execute-command` | Execute a command against the cluster |
| POST | `/resources` | Create an arbitrary resource |
| POST/DELETE | `/deploy/:id` | Install / uninstall a product order |
| GET | `/resource-history` | Resource history (from NATS) |

## Kubernetes API proxy (`/proxy`)

Generic passthrough for any group/version/resource, powering the KubeDB Platform console's resource pages:

| Method | Path pattern | Description |
|--------|--------------|-------------|
| POST/GET/DELETE | `/proxy/:group/:version/:resource/` | Create / list / delete-collection (cluster-scoped) |
| GET/PUT/PATCH/DELETE | `/proxy/:group/:version/:resource/:name` | CRUD on a resource |
| PUT/PATCH | `/proxy/:group/:version/:resource/:name/status` | Update resource status |
| GET | `/proxy/:group/:version/:resource/:name/events`, `/controller` | Events / owning controller |
| POST/GET/DELETE | `/proxy/:group/:version/namespaces/:namespace/:resource/` | Namespaced create / list / delete-collection |
| GET/PUT/PATCH/DELETE | `/proxy/:group/:version/namespaces/:namespace/:resource/:name` | Namespaced CRUD (+ `/status`, `/events`, `/controller`) |
| GET/PUT | `/proxy/.../:name/scale` | Get / update scale subresource |
| GET | `/proxy/.../:name/horizontalpodautoscalers` | HPAs for a resource |
| GET | `/proxy/core/v1/namespaces/:namespace/:resource/:name/log` | Stream pod logs |
| GET | `/proxy/core/v1/namespaces/:namespace/:resource/:name/exec` | Exec into a pod (websocket) |
| GET | `/proxy/core/v1/nodes/:name/metrics`, `.../pods/:name/metrics` | Node / pod metrics |
| POST | `/proxy/authorization.k8s.io/v1/selfsubjectaccessreviews` | "Can I" checks |
| GET | `/proxy/:group/:version/all-available` | All available objects for a group/version |
| GET | `/proxy/meta.k8s.appscode.com/v1alpha1/{renders,renderdashboards,rendermenus,resourcegraphs}` | UI render endpoints (cached) |
| GET | `/proxy/meta.k8s.appscode.com/v1alpha1/:resource/:menu/available` | Available user menus |
| GET | `/proxy/reports.scanner.appscode.com/v1alpha1/{images,cvereports}` | Image scan / CVE reports |
| GET | `/proxy/policy.k8s.appscode.com/v1alpha1/policyreports` | Policy reports |
| POST | `/proxy/batch-delete` | Batch-delete multiple resources |

## Helm (`/helm`)

| Method | Path | Description |
|--------|------|-------------|
| GET/PUT | `/helm/tiller-config`, GET `/helm/tiller-config/default` | Helm console configuration |
| GET/POST | `/helm/v3/releases/` | List / install Helm v3 releases |
| GET/PUT/DELETE | `/helm/v3/releases/:name/` | History / upgrade / uninstall a release |
| GET | `/helm/v3/releases/:name/content`, `/status` | Release manifest / status |
| POST | `/helm/v3/releases/:name/rollback` | Rollback a release |
| GET | `/helm/bundleview`, POST `/helm/bundleview/orders` | Bundle view / order for a chart bundle |
| GET | `/helm/packageview` (+`/files`, `/files/*`, `/values`) | Package view, files, values of a chart |
| POST | `/helm/packageview/orders` | Create an order for an editor chart |
| PUT | `/helm/options/{model,manifest,resources}` | Generate editor model / preview manifest & resources |
| PUT/DELETE | `/helm/editor/` | Apply (install/update) / delete resources via the editor |
| PUT | `/helm/editor/{model,manifest,resources}` | Load editor state from an existing install |

## Pages

- [Cluster Lifecycle & Info](../lifecycle) — get, update, and
  delete a cluster; fetch its kubeconfig; discover available resource types; database
  status/bundle; feature values; execute whitelisted commands; create resources;
  install/uninstall deploy orders; and read resource history.
- [Kubernetes Proxy](../kubernetes-proxy) — the generic
  `/proxy/*` passthrough for any Kubernetes group/version/resource (CRUD, status,
  events, controller, scale, HPAs), plus pod logs/exec, node/pod metrics, access
  reviews, the `meta.k8s.appscode.com` render endpoints, scanner/policy reports, and
  batch delete.
- [Helm](../helm) — Helm console (tiller) configuration, Helm
  v3 release management (list/install/upgrade/uninstall/rollback, content, status,
  history), bundle/package views, and the resource editor.
