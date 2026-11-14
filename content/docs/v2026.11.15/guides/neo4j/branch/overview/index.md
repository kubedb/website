---
title: Neo4j Branching Overview
menu:
  docs_v2026.11.15:
    identifier: neo4j-branch-overview
    name: Overview
    parent: guides-neo4j-branch
    weight: 10
menu_name: docs_v2026.11.15
section_menu_id: guides
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

# Neo4j Branching Overview

KubeDB Courier creates independent Neo4j deployments from storage snapshots on copy-on-write storage such as Ceph RBD. Use branches for development, testing, and isolated data preparation. Changes on either side do not propagate to the other; optional refresh replaces branch data with a fresh source snapshot.

The tutorials use a three-server cluster. Courier clones the server data volumes, while KubeDB recovers a separate cluster. Routing connections reach the branch’s own writer.

Start with the common [branching architecture](/docs/v2026.11.15/operatormanual/branching/overview) and [Courier setup](/docs/v2026.11.15/operatormanual/branching/setup).

- [Branch into another namespace](/docs/v2026.11.15/guides/neo4j/branch/same-cluster/).
- [Branch across clusters](/docs/v2026.11.15/guides/neo4j/branch/cross-cluster/) sharing a network-reachable Ceph backend.

## The Branch resource

Create the namespaced `courier.kubedb.com/v1alpha1` Branch on the source cluster. This example selects a source in `demo` and a target in `dev`:

```yaml
apiVersion: courier.kubedb.com/v1alpha1
kind: Branch
metadata:
  name: neo4j-dev
  namespace: demo
spec:
  source:
    databaseRef:
      apiGroup: kubedb.com
      kind: Neo4j
      name: neo4j-source
    namespace: demo
  target:
    namespace: dev
    name: neo4j-dev
    storageClassName: ceph-rbd
    resources:
      requests:
        cpu: 500m
        memory: 2Gi
      limits:
        memory: 2Gi
  deletionPolicy: Delete
```

### Source and target

`source.databaseRef` selects the KubeDB resource; `source.namespace` locates it. `target.name` and `target.namespace` identify the new deployment. Omit `target.clusterName` for the same cluster; for OCM, use the target ManagedCluster name.

`target.storageClassName` must resolve the source snapshots on the same backend. `target.resources` controls the target database containers. Sources require durable storage.

### Optional behavior

- [Scheduled refresh](/docs/v2026.11.15/guides/neo4j/branch/refresh) periodically replaces branch data.
- [Root password reset](/docs/v2026.11.15/guides/neo4j/branch/reset-root-password) separates branch credentials from the source.
- [Post-actions](/docs/v2026.11.15/guides/neo4j/branch/post-actions) prepare branch data before readiness.
- [Configuration](/docs/v2026.11.15/guides/neo4j/branch/customization/) covers snapshot classes, TLS, and deletion policies.

## Status and readiness

Snapshot creation, target provisioning, optional credential preparation, and post-actions must finish before Branch readiness. Inspect the original Branch:

```shell
kubectl -n demo get branch neo4j-dev
kubectl -n demo get branch neo4j-dev -o yaml
```

`status.snapshot` records the snapshot strategy and generation; `status.resources` references the cloned PVCs, auth Secret, and action Job when present. During refresh the Branch temporarily leaves readiness while its target storage is replaced. The database becoming ready alone does not establish that its post-actions are complete.
