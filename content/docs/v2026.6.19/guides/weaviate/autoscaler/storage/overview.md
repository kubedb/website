---
title: Weaviate Storage Autoscaling Overview
menu:
  docs_v2026.6.19:
    identifier: weaviate-autoscaler-storage-overview
    name: Overview
    parent: weaviate-autoscaler-storage
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

# Weaviate Storage Autoscaling

This guide will give you an overview of how KubeDB autoscales the storage of a `Weaviate` cluster using a `WeaviateAutoscaler`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.6.19/guides/weaviate/concepts/weaviate)
  - [Volume Expansion](/docs/v2026.6.19/guides/weaviate/volume-expansion/overview)

## How Storage Autoscaling Works

KubeDB provides a `WeaviateAutoscaler` CRD to automatically expand the storage of a Weaviate cluster when the volumes start filling up. Storage autoscaling requires a `StorageClass` that supports volume expansion (`allowVolumeExpansion: true`).

The storage autoscaling process consists of the following steps:

1. The user creates a `WeaviateAutoscaler` CR with a `spec.storage.weaviate` block describing the trigger, the usage threshold, and the scaling factor.

2. The `KubeDB` Autoscaler operator watches the PVC usage of the Weaviate pods.

3. When a volume's used space crosses `usageThreshold` (a percentage of the volume capacity), the Autoscaler operator creates a `WeaviateOpsRequest` of type `VolumeExpansion`, increasing the volume size by `scalingThreshold` percent.

4. The `KubeDB` Ops Manager applies the `VolumeExpansion` ops request, expanding the PVCs.

The relevant fields under `spec.storage.weaviate` are:

- `trigger` — `On` or `Off`, enables/disables storage autoscaling.
- `usageThreshold` — the percentage of used space that triggers expansion.
- `scalingThreshold` — the percentage by which the volume is expanded each time.
- `expansionMode` — `Online` or `Offline`.

In the next doc, we are going to show a step-by-step guide on autoscaling the storage of a Weaviate cluster.
