---
title: Qdrant Horizontal Scaling Overview
menu:
  docs_v2026.7.10:
    identifier: qdrant-horizontal-scaling-overview
    name: Overview
    parent: qdrant-horizontal-scaling
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

# Horizontal Scaling Overview

This guide will give you an overview of how `KubeDB` Ops Manager scales up/down the number of members of a `Qdrant`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Qdrant](/docs/v2026.7.10/guides/qdrant/concepts/qdrant)
  - [QdrantOpsRequest](/docs/v2026.7.10/guides/qdrant/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how `KubeDB` Ops Manager used to scale up the number of members of a `Qdrant` cluster. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling Flow" src="/docs/v2026.7.10/guides/qdrant/images/qdrant-horizontal-scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of Qdrant</figcaption>
</figure>

The horizontal scaling process consists of the following steps:

1. At first, a user creates a `Qdrant` CR.

2. `KubeDB` provisioner operator watches for the `Qdrant` CR.

3. When it finds one, it creates a `PetSet` and related necessary stuff like secret, service, etc.

4. Then, in order to scale the cluster up or down, the user creates a `QdrantOpsRequest` CR with the desired number of replicas after scaling.

5. `KubeDB` Ops Manager watches for `QdrantOpsRequest`.

6. When it finds one, it halts the `Qdrant` object so that the `KubeDB` provisioner operator doesn't perform any operation on the `Qdrant` during the scaling process.

7. Then `KubeDB` Ops Manager will add nodes in case of scale up or remove nodes in case of scale down.

8. Then the `KubeDB` Ops Manager will scale the PetSet replicas to reach the expected number of replicas for the cluster.

9. After successful scaling of the PetSet's replica, the `KubeDB` Ops Manager updates the `spec.replicas` field of `Qdrant` object to reflect the updated cluster state.

10. After successful scaling of the `Qdrant` replicas, the `KubeDB` Ops Manager resumes the `Qdrant` object so that the `KubeDB` provisioner operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on scaling of a Qdrant cluster using Horizontal Scaling.
