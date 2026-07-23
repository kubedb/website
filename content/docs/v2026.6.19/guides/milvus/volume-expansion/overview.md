---
title: Milvus Volume Expansion Overview
menu:
  docs_v2026.6.19:
    identifier: milvus-volume-expansion-overview
    name: Overview
    parent: milvus-volume-expansion
    weight: 10
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

# Milvus Volume Expansion

This guide will give an overview on how the KubeDB Ops-manager operator expands the persistent volumes of a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.6.19/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.6.19/guides/milvus/concepts/milvusopsrequest)

## How Volume Expansion Process Works

Volume expansion grows the persistent volumes backing Milvus. A `MilvusOpsRequest` of type `VolumeExpansion` carries the new size and an expansion `mode`:

```yaml
spec:
  type: VolumeExpansion
  volumeExpansion:
    mode: Online            # Online or Offline
    node: 4Gi               # standalone target
    # streamingnode: 4Gi    # distributed target
```

Which key you set depends on the topology, because only certain workloads carry persistent storage:

- **Standalone:** use `node` — the standalone workload's `spec.storage`.
- **Distributed:** use `streamingnode` — among the distributed roles, only `streamingnode` carries a persistent volume (`spec.topology.distributed.streamingnode.storage`). The other roles (`mixcoord`, `datanode`, `querynode`, `proxy`) are stateless and are not the focus of volume operations.

`mode` selects how the expansion is performed:

- **`Online`** — the volume is expanded without taking the pod down (where the storage class/CSI driver supports online resize).
- **`Offline`** — the pod is taken down, the volume is resized, and the pod is brought back up.

> **Storage class requirement:** the underlying `StorageClass` **must** have `allowVolumeExpansion: true`. The base examples use `local-path`, which does **not** support expansion. Use an expansion-capable class (for example `longhorn-custom`) for volume expansion.

The flow is:

1. A user creates a `MilvusOpsRequest` of type `VolumeExpansion`.
2. The operator validates the request and pauses the `Milvus` database.
3. The operator patches the PVCs to the new size and waits for the CSI driver to complete the resize.
4. The new size is reflected in `spec.storage` (standalone) or `spec.topology.distributed.streamingnode.storage` (distributed).
5. The operator resumes the database and marks the `MilvusOpsRequest` as `Successful`.

In the next doc, we will see a step-by-step guide on expanding the volume of a Milvus database.
