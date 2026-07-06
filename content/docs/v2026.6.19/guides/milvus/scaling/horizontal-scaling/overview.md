---
title: Milvus Horizontal Scaling Overview
menu:
  docs_v2026.6.19:
    identifier: milvus-scaling-horizontal-scaling-overview
    name: Overview
    parent: milvus-scaling-horizontal-scaling
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

# Horizontal Scaling Milvus

This guide will give an overview on how the KubeDB Ops-manager operator horizontally scales a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.6.19/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.6.19/guides/milvus/concepts/milvusopsrequest)

## How Horizontal Scaling Process Works

Horizontal scaling changes the **number of replicas** of the Milvus distributed roles.

> **Horizontal scaling is distributed-only.** A `Standalone` Milvus is a single all-in-one workload and cannot be horizontally scaled — there is exactly one PetSet with one replica. To distribute load horizontally, deploy Milvus in `Distributed` mode.

A `MilvusOpsRequest` of type `HorizontalScaling` carries the desired replica counts under `spec.horizontalScaling.topology`, keyed by role:

```yaml
spec:
  type: HorizontalScaling
  horizontalScaling:
    topology:
      proxy: 1
      streamingnode: 1
      # mixcoord / querynode / datanode are also supported by the API
```

The flow is:

1. A user creates a `MilvusOpsRequest` of type `HorizontalScaling`.
2. The operator validates the request and pauses the `Milvus` database.
3. The operator updates the replica counts on the `Milvus` object and the per-role PetSets, then adds or removes pods to match.
4. The operator waits for the affected roles to become healthy.
5. The operator resumes the database and marks the `MilvusOpsRequest` as `Successful`.

The `spec.horizontalScaling.topology` API accepts `proxy`, `mixcoord`, `querynode`, `streamingnode` and `dataNode`. The sample used in the guide only scales `proxy` and `streamingnode`; the other roles are scaled the same way.

In the next doc, we will see a step-by-step guide on horizontally scaling a distributed Milvus database.
