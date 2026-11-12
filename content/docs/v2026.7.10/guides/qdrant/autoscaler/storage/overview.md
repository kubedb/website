---
title: Qdrant Storage Autoscaling Overview
menu:
  docs_v2026.7.10:
    identifier: qdrant-autoscaler-storage-overview
    name: Overview
    parent: qdrant-autoscaler-storage
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

# Qdrant Storage Autoscaling

This guide will give an overview on how KubeDB `Autoscaler` operator autoscales the database storage using `QdrantAutoscaler` CRD.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Qdrant](/docs/v2026.7.10/guides/qdrant/concepts/)
  - [QdrantAutoscaler](/docs/v2026.7.10/guides/qdrant/concepts/autoscaler)
  - [QdrantOpsRequest](/docs/v2026.7.10/guides/qdrant/concepts/opsrequest)
  

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Qdrant`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of Qdrant" src="/docs/v2026.7.10/guides/qdrant/images/qdrant-storage-autoscaling.png">
<figcaption align="center">Fig: Storage Auto Scaling process of Qdrant</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Qdrant` Custom Resource Object (CRO).

2. `KubeDB` Provisioner operator watches the `Qdrant` CRO.

3. When the operator finds a `Qdrant` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volumes according to the Volume Claim Template provided in the petset's configuration.

5. Then, in order to set up storage autoscaling of the `Qdrant` database the user creates a `QdrantAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `QdrantAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.

8. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `QdrantOpsRequest` to expand the storage of the database. 
   
9. `KubeDB` Ops-manager operator watches the `QdrantOpsRequest` CRO.

10. Then the `KubeDB` Ops-manager operator will expand the storage of the database as specified on the `QdrantOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of Qdrant database using `QdrantAutoscaler` CRD.
