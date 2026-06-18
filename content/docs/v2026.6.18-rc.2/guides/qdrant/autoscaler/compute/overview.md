---
title: Qdrant Compute Autoscaling Overview
menu:
  docs_v2026.6.18-rc.2:
    identifier: qdrant-autoscaler-compute-overview
    name: Overview
    parent: qdrant-autoscaler-compute
    weight: 10
menu_name: docs_v2026.6.18-rc.2
section_menu_id: guides
info:
  autoscaler: v0.50.0-rc.2
  cli: v0.65.0-rc.2
  dashboard: v0.41.0-rc.2
  installer: v2026.6.18-rc.2
  ops-manager: v0.52.0-rc.2
  product: kubedb
  provisioner: v0.65.0-rc.2
  schema-manager: v0.41.0-rc.2
  ui-server: v0.41.0-rc.2
  version: v2026.6.18-rc.2
  webhook-server: v0.41.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.6.18-rc.2/README).

# Qdrant Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `QdrantAutoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Qdrant](/docs/v2026.6.18-rc.2/guides/qdrant/concepts/)
  - [QdrantOpsRequest](/docs/v2026.6.18-rc.2/guides/qdrant/concepts/opsrequest)
  - [QdrantAutoscaler](/docs/v2026.6.18-rc.2/guides/qdrant/concepts/autoscaler)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Qdrant` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Compute Auto Scaling process of Qdrant" src="/docs/v2026.6.18-rc.2/guides/qdrant/images/qdrant-compute-autoscaling.png">
<figcaption align="center">Fig: Compute Auto Scaling process of Qdrant</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Qdrant` Custom Resource Object (CRO).

2. `KubeDB` Provisioner operator watches the `Qdrant` CRO.

3. When the operator finds a `Qdrant` CRO, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the `Qdrant` database the user creates a `QdrantAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `QdrantAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `QdrantAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `QdrantOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `QdrantOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `QdrantOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling of various Qdrant database using `QdrantAutoscaler` CRD.
