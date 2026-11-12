---
title: AppBinding CRD
menu:
  docs_v2026.6.19:
    identifier: hanadb-concepts-appbinding
    name: AppBinding
    parent: guides-hanadb-concepts
    weight: 25
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

An `AppBinding` is a Kubernetes `Custom Resource Definition` (CRD) that points to an application or
database. It lets other KubeDB components (and tools such as KubeStash) discover how to connect to a
database without hard-coding connection details. When KubeDB provisions a `HanaDB`, it automatically
creates an `AppBinding` with the same name in the same namespace.

## HanaDB AppBinding

Below is the `AppBinding` created by KubeDB for the `hanadb-quickstart` database from the
[Quickstart](/docs/v2026.6.19/guides/hanadb/quickstart/quickstart):

```yaml
apiVersion: appcatalog.appscode.com/v1alpha1
kind: AppBinding
metadata:
  name: hanadb-quickstart
  namespace: demo
  labels:
    app.kubernetes.io/component: database
    app.kubernetes.io/instance: hanadb-quickstart
    app.kubernetes.io/managed-by: kubedb.com
    app.kubernetes.io/name: hanadbs.kubedb.com
spec:
  type: kubedb.com/hanadb
  version: 2.0.82
  appRef:
    apiGroup: kubedb.com
    kind: HanaDB
    name: hanadb-quickstart
    namespace: demo
  clientConfig:
    service:
      name: hanadb-quickstart
      path: /
      port: 39017
      scheme: tcp
  secret:
    name: hanadb-quickstart-auth
```

### spec.type

`spec.type` identifies the kind of application. For HanaDB it is `kubedb.com/hanadb`.

### spec.clientConfig

`spec.clientConfig` describes how to reach the database. For HanaDB it points at the primary `Service`
on the SQL port `39017` (`scheme: tcp`).

### spec.secret

`spec.secret.name` references the authentication `Secret` (`<name>-auth`) that holds the `SYSTEM`
username and password. Consumers read the credentials from this secret.

### spec.appRef

`spec.appRef` is a back-reference to the owning `HanaDB` object.

## Retrieve the AppBinding

```bash
kubectl get appbinding -n demo hanadb-quickstart -o yaml
```

## Next Steps

- Learn about the [HanaDB CRD](/docs/v2026.6.19/guides/hanadb/concepts/hanadb).
- Read about [HanaDBOpsRequest](/docs/v2026.6.19/guides/hanadb/concepts/opsrequest).
