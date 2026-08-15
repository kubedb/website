---
title: Weaviate Volume Expansion Overview
menu:
  docs_v2026.8.14-rc.0:
    identifier: weaviate-volume-expansion-overview
    name: Overview
    parent: weaviate-volume-expansion
    weight: 10
menu_name: docs_v2026.8.14-rc.0
section_menu_id: guides
info:
  autoscaler: v0.52.0-rc.0
  cli: v0.67.0-rc.0
  dashboard: v0.43.0-rc.0
  installer: v2026.8.14-rc.0
  ops-manager: v0.54.0-rc.0
  product: kubedb
  provisioner: v0.67.0-rc.0
  schema-manager: v0.43.0-rc.0
  ui-server: v0.43.0-rc.0
  version: v2026.8.14-rc.0
  webhook-server: v0.43.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2026.8.14-rc.0/README).

# Weaviate Volume Expansion

This guide will give you an overview of how KubeDB Ops Manager expands the volume of a `Weaviate` cluster.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.8.14-rc.0/guides/weaviate/concepts/weaviate)
  - [Weaviate Quickstart](/docs/v2026.8.14-rc.0/guides/weaviate/quickstart/quickstart)

## How Volume Expansion Process Works

The volume expansion process consists of the following steps:

1. At first, a user creates a `Weaviate` CR.

2. `KubeDB` provisioner operator watches for the `Weaviate` CR.

3. When the operator finds a `Weaviate` CR, it creates a `PetSet` and related necessary resources, and provisions a `PersistentVolumeClaim` (PVC) for each node.

4. Then, in order to expand the volume of the `Weaviate` cluster, the user creates a `WeaviateOpsRequest` CR with the desired volume size.

5. `KubeDB` Ops Manager watches for the `WeaviateOpsRequest` CR.

6. When it finds one, it halts the `Weaviate` object so that the `KubeDB` provisioner operator doesn't perform any operation on the `Weaviate` during the volume expansion process.

7. Then the `KubeDB` Ops Manager expands the PVCs to reach the desired size. Volume expansion requires a `StorageClass` that supports volume expansion (`allowVolumeExpansion: true`).

8. After successfully expanding the PVCs, the `KubeDB` Ops Manager updates the `Weaviate` object's storage to reflect the updated state.

9. After successfully updating the storage, the `KubeDB` Ops Manager resumes the `Weaviate` object so that the `KubeDB` Provisioner operator resumes its usual operations.

Volume expansion can be performed in two modes:

- **Online** — the volume is expanded without restarting the pods (requires a CSI driver that supports online expansion).
- **Offline** — the pods are recreated to apply the expanded volume.

In the next doc, we are going to show a step-by-step guide on expanding the volume of a Weaviate cluster using the volume expansion operation.
