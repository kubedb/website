---
title: Weaviate Storage Migration Overview
menu:
  docs_v2026.10.12:
    identifier: weaviate-storage-migration-overview
    name: Overview
    parent: weaviate-storage-migration
    weight: 10
menu_name: docs_v2026.10.12
section_menu_id: guides
info:
  autoscaler: v0.53.0
  cli: v0.68.0
  dashboard: v0.44.0
  installer: v2026.10.12
  ops-manager: v0.55.0
  product: kubedb
  provisioner: v0.68.0
  schema-manager: v0.44.0
  ui-server: v0.44.0
  version: v2026.10.12
  webhook-server: v0.44.0
---

> New to KubeDB? Please start [here](/docs/v2026.10.12/README).

# Weaviate StorageClass Migration

This guide will give you an overview of how KubeDB Ops Manager migrates a `Weaviate` cluster from one `StorageClass` to another.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.10.12/guides/weaviate/concepts/weaviate)
  - [Weaviate Quickstart](/docs/v2026.10.12/guides/weaviate/quickstart/quickstart)

## How Storage Migration Process Works

Storage migration moves the data of a Weaviate cluster from its current `StorageClass` onto a new one — for example, migrating from a cloud-provider block storage to [Longhorn](https://longhorn.io/), or vice-versa.

The storage migration process consists of the following steps:

1. The user creates a `WeaviateOpsRequest` CR of type `StorageMigration` referencing the `Weaviate` database. The `spec.migration` field specifies the target `storageClassName` and the reclaim policy (`oldPVReclaimPolicy`) to apply to the old PersistentVolumes.

2. `KubeDB` Ops Manager watches for the `WeaviateOpsRequest` CR and halts the `Weaviate` object.

3. For each node, the Ops Manager provisions a new PVC on the target `StorageClass`, copies the data from the old volume to the new volume, and re-points the node at the new volume.

4. The old PersistentVolumes are handled according to `spec.migration.oldPVReclaimPolicy` (for example `Delete`).

5. The Ops Manager updates the `Weaviate` object's `spec.storage.storageClassName` to the new `StorageClass` and resumes the `Weaviate` object so that the `KubeDB` Provisioner operator resumes its usual operations.

> **Note:** The target `StorageClass` must be different from the current one. If the database is already running on the target `StorageClass`, there is nothing to migrate.

In the next doc, we are going to show a step-by-step guide on migrating the StorageClass of a Weaviate cluster.
