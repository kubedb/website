---
title: Milvus Vertical Scaling Overview
menu:
  docs_v2026.7.10:
    identifier: milvus-scaling-vertical-scaling-overview
    name: Overview
    parent: milvus-scaling-vertical-scaling
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# Vertical Scaling Milvus

This guide will give an overview on how the KubeDB Ops-manager operator vertically scales a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.7.10/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.7.10/guides/milvus/concepts/milvusopsrequest)

## How Vertical Scaling Process Works

Vertical scaling changes the CPU/memory **resources** of Milvus pods. A `MilvusOpsRequest` of type `VerticalScaling` carries the new resources under `spec.verticalScaling`, keyed by the component you want to scale:

- **Standalone:** use the `node` key.
- **Distributed:** use any of `proxy`, `mixcoord`, `datanode`, `querynode`, `streamingnode` (you can scale several at once).

```yaml
spec:
  type: VerticalScaling
  verticalScaling:
    node:                 # 'node' for standalone; role names for distributed
      resources:
        requests:
          cpu: "1"
          memory: "2Gi"
        limits:
          cpu: "1"
          memory: "2Gi"
```

The flow is:

1. A user creates a `MilvusOpsRequest` of type `VerticalScaling`.
2. The operator validates the request and pauses the `Milvus` database.
3. The operator updates the resources in the `Milvus` object's `spec.podTemplate` and the corresponding PetSets.
4. Pods are restarted (evicted and recreated) so they come up with the new resources.
5. The operator resumes the database and marks the `MilvusOpsRequest` as `Successful`.

## Vertical Scaling Modes

KubeDB actuates vertical scaling in one of two modes, selected through the `spec.verticalScaling.mode`
field of the `MilvusOpsRequest`:

- **`Restart`** (default): The operator patches the `PetSet` with the new resources and restarts the
  Pods (one at a time, honoring the database's failover rules) so they come back with the updated CPU
  and Memory. This works on every Kubernetes cluster.
- **`InPlace`**: The operator resizes the running containers in place using the Kubernetes
  [in-place Pod resize](https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/)
  (`pods/resize` subresource) — no Pod restart, so scaling happens without downtime or failover. If a
  Node cannot accommodate the new resources (the resize is reported `Infeasible`), the operator
  automatically falls back to the `Restart` behavior for that Pod.

If `spec.verticalScaling.mode` is omitted, it defaults to `Restart`.

> **Note:** `InPlace` mode relies on the Kubernetes `InPlacePodVerticalScaling` feature gate, which is
> enabled by default from Kubernetes v1.33. On older clusters, or when the feature gate is disabled,
> use `Restart` mode.

In the next doc, we will see a step-by-step guide on vertically scaling a Milvus database.
