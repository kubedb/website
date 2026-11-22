---
title: AppBinding CRD
menu:
  docs_v2026.6.19:
    identifier: neo4j-appbinding-concepts
    name: AppBinding
    parent: neo4j-concepts
    weight: 20
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# AppBinding

## What is AppBinding

An `AppBinding` is a Kubernetes `CustomResourceDefinition` (CRD) that points to an application endpoint and its access credentials.

If you deploy a Neo4j database using KubeDB, KubeDB automatically creates an `AppBinding` for that database. This object is used by tools like KubeStash to discover connection information and database credentials.

## AppBinding CRD Specification

Like other Kubernetes resources, an `AppBinding` has `TypeMeta`, `ObjectMeta`, and `Spec` sections. It does not have a `Status` section.

An `AppBinding` created by KubeDB for a Neo4j database looks like this:

```yaml
apiVersion: appcatalog.appscode.com/v1alpha1
kind: AppBinding
metadata:
  name: neo4j-test
  namespace: demo
  labels:
    app.kubernetes.io/component: database
    app.kubernetes.io/instance: neo4j-test
    app.kubernetes.io/managed-by: kubedb.com
    app.kubernetes.io/name: neo4js.kubedb.com
spec:
  appRef:
    apiGroup: kubedb.com
    kind: Neo4j
    name: neo4j-test
    namespace: demo
  clientConfig:
    service:
      name: neo4j-test
      port: 7687
      scheme: neo4j
  secret:
    name: neo4j-test-auth
  type: kubedb.com/Neo4j
  version: 2025.12.1-enterprise
```

Here, we describe the important sections of this AppBinding.

### spec.type

`spec.type` identifies the app type represented by this AppBinding.

Format: `<group>/<kind>`.

For Neo4j managed by KubeDB, it is typically:

- `kubedb.com/Neo4j`

### spec.appRef

`spec.appRef` points back to the source database object that owns this binding.

For Neo4j, this includes:

- `apiGroup: kubedb.com`
- `kind: Neo4j`
- `name: <neo4j-name>`
- `namespace: <namespace>`

### spec.secret

`spec.secret` references the Secret that stores credentials required to connect to the database. The Secret must be in the same namespace.

For Neo4j, KubeDB-generated auth secret typically contains:

| Key | Usage |
|-----|-------|
| `username` | Neo4j user name |
| `password` | Password for that user |

### spec.clientConfig

`spec.clientConfig` defines how clients should connect to the target database.

For in-cluster Neo4j deployments, KubeDB sets `spec.clientConfig.service`.

#### spec.clientConfig.service

- `name`: Kubernetes Service name for the database.
- `port`: Service port used for client connection (Neo4j Bolt is commonly `7687`).
- `scheme`: Connection scheme (for example, `neo4j`).

## Verify AppBinding

You can inspect the generated AppBinding with:

```bash
$ kubectl get appbinding -n demo neo4j-test -o yaml
```

## Next Steps

- Read the [Neo4j CRD concept](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- Learn Neo4j operations from [Neo4j OpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).
- Run the [Neo4j quickstart](/docs/v2026.6.19/guides/neo4j/quickstart/quickstart).

