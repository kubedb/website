---
title: Milvus Compute Autoscaling Overview
menu:
  docs_v2026.8.26-rc.2:
    identifier: milvus-autoscaler-compute-overview
    name: Overview
    parent: milvus-autoscaler-compute
    weight: 10
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

# Milvus Compute Resource Autoscaling

This guide will give an overview on how the KubeDB Autoscaler operator autoscales the compute resources (CPU/memory) of a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvus)
  - [MilvusAutoscaler](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvusautoscaler)
  - [MilvusOpsRequest](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvusopsrequest)

## How Compute Autoscaling Works

A `MilvusAutoscaler` of type `compute` watches the resource usage of the Milvus pods (via the metrics server / VPA recommender) and, when usage drifts far enough from the requested resources, it creates a `VerticalScaling` `MilvusOpsRequest` to right-size the pods.

`spec.compute` is keyed by component:

- **Standalone:** `node`.
- **Distributed:** `proxy`, `mixcoord`, `datanode`, `querynode`, `streamingnode`.

Each block supports:

```yaml
spec:
  compute:
    node:                          # or proxy/mixcoord/datanode/querynode/streamingnode
      trigger: "On"
      podLifeTimeThreshold: 1m
      resourceDiffPercentage: 10
      minAllowed:
        cpu: 100m
        memory: 256Mi
      maxAllowed:
        cpu: 1000m
        memory: 2Gi
      controlledResources: ["cpu", "memory"]
```

- **`trigger`** — `On`/`Off`; enables autoscaling for the component.
- **`minAllowed`/`maxAllowed`** — the bounds the autoscaler stays within.
- **`resourceDiffPercentage`** — how far current resources must drift from the recommendation before an ops request is created.
- **`podLifeTimeThreshold`** — minimum pod age before it is considered for scaling.
- **`controlledResources`** — which resources are managed.

The flow is:

1. A user creates a `MilvusAutoscaler` with `spec.compute`.
2. The autoscaler creates a `VerticalPodAutoscaler` (VPA) object which produces resource recommendations.
3. When the recommendation differs from the current resources by more than `resourceDiffPercentage`, the autoscaler creates a `VerticalScaling` `MilvusOpsRequest` (subject to `spec.opsRequestOptions`).
4. The Ops-manager operator applies the vertical scaling as usual.

> **Prerequisite:** a **metrics server** must be installed in the cluster for the VPA recommender to produce recommendations.

In the next doc, we will see a step-by-step guide on compute autoscaling of a Milvus database.
