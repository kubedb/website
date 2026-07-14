---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cluster-management-v1-kubernetes-proxy
    name: Kubernetes Proxy
    parent: api-cluster-management-v1
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Kubernetes Proxy

A generic passthrough to a member cluster's Kubernetes API, powering the KubeDB Platform
console's resource pages. You can perform CRUD on any group/version/resource (GVR),
read subresources (status, scale, events, controller), stream pod logs, exec into
pods, read node/pod metrics, run access reviews, drive the `meta.k8s.appscode.com`
render/report endpoints, and batch-delete resources.

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
| `group` | string | Kubernetes API group. Use `core` for the legacy core group. |
| `version` | string | Kubernetes API version (e.g. `v1`). |
| `resource` | string | Kubernetes resource (plural, e.g. `deployments`). |
| `namespace` | string | Namespace (for namespaced paths). |
| `name` | string | Object name. |

Request and response bodies are arbitrary Kubernetes objects (`K8sObject`) —
free-form objects with an arbitrary group/version/kind, passed to and from the member
cluster verbatim. List responses are Kubernetes list objects; when `convertToTable`
is set they are returned as a `Table`. Most list/get endpoints support standard
Kubernetes label/field selectors as query parameters, plus a `filter` query for
content filtering and `convertToTable` for table output.

A documented list call looks like:

```
curl -H "Authorization: token $AKP_TOKEN" \
  https://<akp-host>/api/v1/clusters/appscode/ace/proxy/apps/v1/namespaces/kube-system/deployments/
```

---

## Cluster-scoped resources

### POST /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/

Create a cluster-scoped Kubernetes object of the given GVR.

- **Auth:** token.
- **Request body:** an arbitrary Kubernetes object.
- **Response:** `200` with the created object.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/

List cluster-scoped resources of the given GVR. Supports label/field selectors,
`filter`, and `convertToTable`.

- **Auth:** token.
- **Response:** `200` with a Kubernetes list (or a `Table`); `304` when the ETag
  matches.

```json
{
  "apiVersion": "v1",
  "kind": "NodeList",
  "items": [
    { "apiVersion": "v1", "kind": "Node", "metadata": { "name": "node-1" } }
  ]
}
```

> **Verified:** `GET .../proxy/core/v1/nodes/` returned `200` against `appscode/ace`
> (hub) on 2026-07-14.

### DELETE /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/

Delete a collection of cluster-scoped resources. The optional request body carries a
`metav1.DeleteOptions` object.

- **Auth:** token.
- **Response:** `200` on success.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}

Get a single cluster-scoped resource by name.

- **Auth:** token.
- **Response:** `200` with the object (or a `Table`); `304` when the ETag matches;
  `404` if not found.

### PUT /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}

Replace a cluster-scoped resource.

- **Auth:** token.
- **Request body:** the full replacement Kubernetes object.
- **Response:** `200` with the updated object.

### PATCH /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}

Patch a cluster-scoped resource. Supports JSON/merge/strategic-merge patch types via
the `Content-Type` header; a plain JSON body is diffed against the current object to
build a JSON patch.

- **Auth:** token.
- **Request body:** the patch (or a desired object to diff).
- **Response:** `200` with the patched object.

### DELETE /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}

Delete a cluster-scoped resource by name. The optional request body carries
`metav1.DeleteOptions`.

- **Auth:** token.
- **Response:** `200` on success.

### PUT · PATCH /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}/status

Update (PUT) or patch (PATCH) the `status` subresource of a cluster-scoped object.

- **Auth:** token.
- **Request body:** the object (or patch) carrying the new status.
- **Response:** `200` with the object with updated status.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}/events

List Kubernetes events referencing the named cluster-scoped object.

- **Auth:** token.
- **Response:** `200` with an event list.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/{resource}/{name}/controller

Get the controlling owner object of the named cluster-scoped object.

- **Auth:** token.
- **Response:** `200` with the controller object; `404` if none.

---

## Namespaced resources

These mirror the cluster-scoped operations under a `namespaces/{namespace}` segment.

### POST /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/

Create a namespaced resource of the given GVR.

- **Auth:** token.
- **Request body:** an arbitrary Kubernetes object.
- **Response:** `200` with the created object.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/

List namespaced resources. Supports label/field selectors, `filter`, and
`convertToTable`.

- **Auth:** token.
- **Response:** `200` with a Kubernetes list (or a `Table`); `304` when the ETag
  matches.

```json
{
  "apiVersion": "apps/v1",
  "kind": "DeploymentList",
  "items": [
    {
      "apiVersion": "apps/v1",
      "kind": "Deployment",
      "metadata": { "name": "coredns", "namespace": "kube-system" }
    }
  ]
}
```

> **Verified:** `GET .../proxy/apps/v1/namespaces/kube-system/deployments/` returned
> `200` against `appscode/ace` (hub) and `appscode/arnob-dev` (spoke) on 2026-07-14.

### DELETE /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/

Delete a collection of namespaced resources. Optional body carries
`metav1.DeleteOptions`.

- **Auth:** token.
- **Response:** `200` on success.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}

Get a namespaced resource by name.

- **Auth:** token.
- **Response:** `200` with the object (or a `Table`); `304` when the ETag matches;
  `404` if not found.

> **Verified:** `GET .../deployments/coredns` returned `200` against `appscode/ace`
> (hub) on 2026-07-14.

### PUT /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}

Replace a namespaced resource.

- **Auth:** token.
- **Request body:** the full replacement Kubernetes object.
- **Response:** `200` with the updated object.

### PATCH /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}

Patch a namespaced resource (JSON/merge/strategic-merge, or a plain JSON body diffed
against the current object).

- **Auth:** token.
- **Response:** `200` with the patched object.

### DELETE /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}

Delete a namespaced resource by name. Optional body carries `metav1.DeleteOptions`.

- **Auth:** token.
- **Response:** `200` on success.

### PUT · PATCH /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/status

Update (PUT) or patch (PATCH) the `status` subresource of a namespaced object.

- **Auth:** token.
- **Response:** `200` with the object with updated status.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/events

List Kubernetes events referencing the named namespaced object.

- **Auth:** token.
- **Response:** `200` with an event list.

> **Verified:** `GET .../deployments/coredns/events` returned `200` against
> `appscode/ace` (hub) on 2026-07-14.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/controller

Get the controlling owner object of the named namespaced object.

- **Auth:** token.
- **Response:** `200` with the controller object; `404` if none.

---

## Scale & autoscaling

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/scale

Read the `scale` subresource of a namespaced object.

- **Auth:** token.
- **Response:** `200` with the scale object.

> **Verified:** `GET .../deployments/coredns/scale` returned `200` against
> `appscode/ace` (hub) on 2026-07-14.

### PUT /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/scale

Update the replica count of a namespaced object via its `scale` subresource.

- **Auth:** token.
- **Request body:**

```json
{ "replicas": 3 }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `replicas` | integer (int32) | yes | Desired replica count. |

- **Response:** `200` with the updated scale object.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/namespaces/{namespace}/{resource}/{name}/horizontalpodautoscalers

List the HorizontalPodAutoscalers whose scale target matches the named namespaced
object.

- **Auth:** token.
- **Response:** `200` with a filtered HPA list.

---

## Pods: logs, exec & metrics

### GET /clusters/{owner}/{cluster}/proxy/core/v1/namespaces/{namespace}/{resource}/{name}/log

Stream container logs for the named pod. The response is a streaming plain-text body.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, `namespace`, `resource` (`pods`), `name`.
- **Response:** `200` streaming `text/plain` log output; `404` if the pod is not
  found.

### GET /clusters/{owner}/{cluster}/proxy/core/v1/namespaces/{namespace}/{resource}/{name}/exec

Establish an interactive exec session into a container of the named pod. This
endpoint is upgraded to a **WebSocket** connection — it is not a plain HTTP
request/response.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, `namespace`, `resource` (`pods`), `name`.
- **Response:** `101` Switching Protocols (WebSocket exec stream); `404` if the pod is
  not found.

### GET /clusters/{owner}/{cluster}/proxy/core/v1/nodes/{name}/metrics

Get resource-usage metrics for the named node.

- **Auth:** token.
- **Response:** `200` with a metrics object; `404` if the node is not found.

### GET /clusters/{owner}/{cluster}/proxy/core/v1/namespaces/{namespace}/pods/{name}/metrics

Get resource-usage metrics for the named pod.

- **Auth:** token.
- **Response:** `200` with a metrics object; `404` if the pod is not found.

---

## Access reviews & discovery

### POST /clusters/{owner}/{cluster}/proxy/authorization.k8s.io/v1/selfsubjectaccessreviews

Submit a `SelfSubjectAccessReview` to check whether the current user can perform an
action ("can I" check).

- **Auth:** token.
- **Request body:** a `SelfSubjectAccessReview` Kubernetes object.

```json
{
  "apiVersion": "authorization.k8s.io/v1",
  "kind": "SelfSubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "default",
      "verb": "list",
      "resource": "pods"
    }
  }
}
```

- **Response:** `200` with the review and its populated `status`.

### GET /clusters/{owner}/{cluster}/proxy/{group}/{version}/all-available

Discover all resources under the given API group/version and return, per Kind, the
list of object names available in the cluster.

- **Auth:** token.
- **Response:** `200` with a map of Kind to an array of object names.

```json
{
  "Deployment": ["coredns", "metrics-server"],
  "StatefulSet": ["prometheus"]
}
```

> **Verified:** returned `404` against `appscode/ace` for `apps/v1` and `core/v1` —
> this discovery endpoint was not available/enabled on the verification cluster.

---

## Render endpoints (meta.k8s.appscode.com)

These endpoints render `meta.k8s.appscode.com/v1alpha1` UI objects. They are
implemented as **cacheable creates**: the request object is passed JSON-encoded via
the `q` query parameter so the response can be cached (supporting `304 Not Modified`
via ETags).

Common query parameter:

| Name | Type | Required | Description |
|---|---|---|---|
| `q` | string | yes | JSON-encoded request object for the render. |

### GET /clusters/{owner}/{cluster}/proxy/meta.k8s.appscode.com/v1alpha1/renders

Render a `Render` object (resource layout).

- **Auth:** token.
- **Response:** `200` with the rendered object; `304` when the ETag matches.

### GET /clusters/{owner}/{cluster}/proxy/meta.k8s.appscode.com/v1alpha1/renderdashboards

Render a `RenderDashboard` object.

- **Auth:** token.
- **Response:** `200` with the rendered dashboards object; `304` when the ETag
  matches.

### GET /clusters/{owner}/{cluster}/proxy/meta.k8s.appscode.com/v1alpha1/rendermenus

Render a `RenderMenu` object.

- **Auth:** token.
- **Response:** `200` with the rendered menus object; `304` when the ETag matches.

> **Verified:** returned `400` against `appscode/ace` when passed a minimal `q`
> object — the endpoint is reachable but requires a fully-formed `RenderMenu` request
> object; only GET was exercised.

### GET /clusters/{owner}/{cluster}/proxy/meta.k8s.appscode.com/v1alpha1/resourcegraphs

Render a `ResourceGraph` object.

- **Auth:** token.
- **Response:** `200` with the rendered resource-graph object; `304` when the ETag
  matches.

### GET /clusters/{owner}/{cluster}/proxy/meta.k8s.appscode.com/v1alpha1/{resource}/{menu}/available

Get the available user menu entries for the given `meta.k8s.appscode.com` resource and
menu.

- **Auth:** token.
- **Path parameters:** `owner`, `cluster`, plus `resource` (the
  `meta.k8s.appscode.com` resource name) and `menu` (menu identifier).
- **Response:** `200` with an available-user-menus object.

---

## Scanner & policy reports

Like the render endpoints, these are cacheable creates driven by a JSON-encoded `q`
query parameter.

| Name | Type | Required | Description |
|---|---|---|---|
| `q` | string | yes | JSON-encoded report request object. |

### GET /clusters/{owner}/{cluster}/proxy/reports.scanner.appscode.com/v1alpha1/images

Produce a `reports.scanner.appscode.com` `Image` report.

- **Auth:** token.
- **Response:** `200` with the image report object; `304` when the ETag matches.

> **Verified:** returned `500` against `appscode/ace` when the `q` query parameter is
> omitted — the endpoint requires a JSON-encoded `Image` report request object; only
> GET was exercised.

### GET /clusters/{owner}/{cluster}/proxy/reports.scanner.appscode.com/v1alpha1/cvereports

Produce a `reports.scanner.appscode.com` `CVEReport`.

- **Auth:** token.
- **Response:** `200` with the CVE report object; `304` when the ETag matches.

### GET /clusters/{owner}/{cluster}/proxy/policy.k8s.appscode.com/v1alpha1/policyreports

Produce a `policy.k8s.appscode.com` `PolicyReport`.

- **Auth:** token.
- **Response:** `200` with the policy report object; `304` when the ETag matches.

> **Verified:** returned `500` against `appscode/ace` when the `q` query parameter is
> omitted — the endpoint requires a JSON-encoded `PolicyReport` request object; only
> GET was exercised.

---

## Batch delete

### POST /clusters/{owner}/{cluster}/proxy/batch-delete

Delete multiple Kubernetes objects in a single request. Each entry is deleted
independently; the response reports the per-resource deletion status for any that
failed.

- **Auth:** token.
- **Request body:** a `BatchDeleteRequest`.

```json
{
  "resources": [
    {
      "namespace": "default",
      "name": "example",
      "group": "",
      "version": "v1",
      "resource": "configmaps"
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resources` | array | yes | The resources to delete. |
| `resources[].namespace` | string | no | Namespace (empty for cluster-scoped resources). |
| `resources[].name` | string | no | Object name. |
| `resources[].group` | string | no | Kubernetes API group. |
| `resources[].version` | string | no | Kubernetes API version. |
| `resources[].resource` | string | no | Kubernetes resource (plural). |

- **Response:** `200` with a `BatchDeleteResponse`. The `resourcesStatus` array is
  populated for resources whose deletion failed, each carrying its identifiers plus a
  `metav1.Status` describing the result.

```json
{
  "resourcesStatus": [
    {
      "namespace": "default",
      "name": "example",
      "group": "",
      "version": "v1",
      "resource": "configmaps",
      "status": { "kind": "Status", "status": "Failure", "message": "not found" }
    }
  ]
}
```
