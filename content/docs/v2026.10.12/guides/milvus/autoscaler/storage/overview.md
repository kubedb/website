---
title: Milvus Storage Autoscaling Overview
menu:
  docs_v2026.10.12:
    identifier: milvus-autoscaler-storage-overview
    name: Overview
    parent: milvus-autoscaler-storage
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

# Milvus Storage Autoscaling

This guide will give an overview on how the KubeDB Autoscaler operator autoscales the persistent storage of a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.10.12/guides/milvus/concepts/milvus)
  - [MilvusAutoscaler](/docs/v2026.10.12/guides/milvus/concepts/milvusautoscaler)
  - [MilvusOpsRequest](/docs/v2026.10.12/guides/milvus/concepts/milvusopsrequest)

## How Storage Autoscaling Works

A `MilvusAutoscaler` of type `storage` watches PVC usage and, when a volume crosses the configured usage threshold, creates a `VolumeExpansion` `MilvusOpsRequest` to grow the volume.

`spec.storage` is keyed by the workload that carries persistent storage:

- **Standalone:** `node`.
- **Distributed:** `streamingnode` — among the distributed roles, only `streamingnode` has a persistent volume, so it is the sole storage-autoscaling target.

```yaml
spec:
  storage:
    streamingnode:                 # or 'node' for standalone
      trigger: "On"
      usageThreshold: 34
      expansionMode: "Online"
      scalingRules:
        - appliesUpto: "100Ti"
          threshold: "50%"
```

- **`trigger`** — `On`/`Off`.
- **`usageThreshold`** — percentage of disk usage that triggers expansion.
- **`expansionMode`** — `Online` or `Offline` (passed through to the generated `VolumeExpansion` ops request).
- **`scalingRules`** — how much to grow, optionally varying by current size.

The flow is:

1. A user creates a `MilvusAutoscaler` with `spec.storage`.
2. The autoscaler reads PVC usage from the `custom.metrics.k8s.io` API backed by the KubeDB storage-metrics apiserver.
3. When usage exceeds `usageThreshold`, the autoscaler creates a `VolumeExpansion` `MilvusOpsRequest` sized per `scalingRules`.
4. The Ops-manager operator performs the volume expansion as usual.

> **Prerequisites:** The KubeDB storage metrics server must be enabled and serving the `custom.metrics.k8s.io` API, and the PVC's `StorageClass` must have `allowVolumeExpansion: true`.

In the next doc, we will see a step-by-step guide on storage autoscaling of a Milvus database.
