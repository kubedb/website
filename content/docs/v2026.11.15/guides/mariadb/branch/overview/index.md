---
title: MariaDB Branching Overview
menu:
  docs_v2026.11.15:
    identifier: mariadb-branch-overview
    name: Overview
    parent: guides-mariadb-branch
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

# MariaDB Branching Overview

KubeDB Courier creates MariaDB branches from CSI snapshots on CoW storage such as Ceph RBD. Each branch has its own database resource, Service, storage, and auth Secret. Use a branch for development, testing, or data preparation, and optionally refresh it from its source.

Read the common [branching overview](/docs/v2026.11.15/operatormanual/branching/overview) for the architecture and storage requirements. Start with [Courier setup](/docs/v2026.11.15/operatormanual/branching/setup#single-cluster-installation) or [Courier cross-cluster setup](/docs/v2026.11.15/operatormanual/branching/setup#cross-cluster-installation-with-ocm). The tutorials demonstrate:

- [Same-cluster branching into another namespace](/docs/v2026.11.15/guides/mariadb/branch/same-cluster/).
- [Cross-cluster branching](/docs/v2026.11.15/guides/mariadb/branch/cross-cluster/) using the same network-reachable Ceph backend.

## The Branch resource

A Branch is a namespaced `courier.kubedb.com/v1alpha1` resource created on the source cluster. This example copies `demo/mariadb-source` to `dev/mariadb-dev`:

```yaml
apiVersion: courier.kubedb.com/v1alpha1
kind: Branch
metadata:
  name: mariadb-dev
  namespace: demo
spec:
  source:
    databaseRef:
      apiGroup: kubedb.com
      kind: MariaDB
      name: mariadb-source
    namespace: demo
  target:
    namespace: dev
    name: mariadb-dev
    storageClassName: ceph-rbd
    resources:
      requests:
        cpu: 500m
        memory: 1Gi
  deletionPolicy: Delete
```

### Source

| Field | Meaning |
|---|---|
| `spec.source.databaseRef.apiGroup` | `kubedb.com` for a KubeDB MariaDB database. |
| `spec.source.databaseRef.kind` | `MariaDB`. |
| `spec.source.databaseRef.name` | Name of the source database. |
| `spec.source.namespace` | Source namespace; defaults to the Branch's namespace when omitted. |

The source must be a ready, durable KubeDB MariaDB database with snapshot-capable Ceph storage. Put the Branch in the source namespace, as the tutorials do, to keep requests and source status together.

### Target

| Field | Meaning |
|---|---|
| `spec.target.name` | Name of the new MariaDB database. Choose an unused name in the target namespace. |
| `spec.target.namespace` | Namespace of the branch database. |
| `spec.target.clusterName` | OCM managed-cluster name for cross-cluster branching. Omit for same-cluster branching. |
| `spec.target.storageClassName` | StorageClass on the target cluster; the examples use `ceph-rbd`. It must resolve compatible snapshot handles. |
| `spec.target.resources` | MariaDB container CPU/memory requests and limits for the target. |
| `spec.target.issuerRef` | Target cert-manager Issuer or ClusterIssuer required when the source has `spec.tls` configured. |

Courier prepares target configuration and copies applicable source configuration Secrets. An external ServiceAccount, Secret, or other dependency referenced by your configuration must also be available in the target environment. See [MariaDB branch configuration](/docs/v2026.11.15/guides/mariadb/branch/customization/) for TLS and overrides.

### Optional behavior

Use the following independent tutorials to prepare and maintain the branch:

- [Refresh](/docs/v2026.11.15/guides/mariadb/branch/refresh): replace branch data periodically using `spec.schedule.cron` and retain run history with `spec.historyLimit`.
- [Reset root password](/docs/v2026.11.15/guides/mariadb/branch/reset-root-password): set `spec.resetRootPassword: true` to rotate the branch credential before readiness.
- [Post-actions](/docs/v2026.11.15/guides/mariadb/branch/post-actions): use `spec.postActions` to mask or remove sensitive data before the Branch becomes ready.

See [configuration](/docs/v2026.11.15/guides/mariadb/branch/customization/) for snapshot selection, TLS, resource overrides, and deletion policies. The feature tutorials link the common references for field definitions and defaults.

## Status and readiness

Wait for the **Branch** to become `Ready`, even if the MariaDB resource becomes ready earlier. Credential isolation and post-actions must finish first.

```shell
kubectl -n demo wait branch/mariadb-dev \
  --for=jsonpath='{.status.phase}'=Ready --timeout=15m
kubectl -n demo get branch mariadb-dev -o yaml
```

The status reports execution progress through `phase`, `conditions`, and managed `resources`. Same-cluster execution uses `mode: Local`; cross-cluster execution uses `Initiator` on the source and `Creator` on the target. See the common [branch lifecycle](/docs/v2026.11.15/operatormanual/branching/overview#branch-lifecycle) and [refresh status reference](/docs/v2026.11.15/operatormanual/branching/refresh#refresh-status-reference) for details.

For cross-cluster branches, inspect the requested Branch on the source cluster and database resources on the target. The target also has a delivered Branch used by Courier; manage the lifecycle through the original source Branch.
