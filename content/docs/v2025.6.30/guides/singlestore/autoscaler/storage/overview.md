---
title: SingleStore Storage Autoscaling Overview
menu:
  docs_v2025.6.30:
    identifier: sdn-storage-auto-scaling-overview
    name: Overview
    parent: sdb-storage-auto-scaling
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# SingleStore Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `singlestoreautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [SingleStore](/docs/v2025.6.30/guides/singlestore/concepts/singlestore)
    - [SingleStoreAutoscaler](/docs/v2025.6.30/guides/singlestore/concepts/autoscaler)
    - [SingleStoreOpsRequest](/docs/v2025.6.30/guides/singlestore/concepts/opsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `SingleStore` cluster components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of SingleStore" src="/docs/v2025.6.30/images/singlestore/storage-autoscaling.svg">
<figcaption align="center">Fig: Storage Auto Scaling process of SingleStore</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `SingleStore` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `SingleStore` CR.

3. When the operator finds a `SingleStore` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

- Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration.

4. Then, in order to set up storage autoscaling of the various components (ie. Aggregator, Leaf, Standalone.) of the `singlestore` cluster, the user creates a `SingleStoreAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `SingleStoreAutoscaler` CRO.

6. `KubeDB` Autoscaler operator continuously watches persistent volumes of the clusters to check if it exceeds the specified usage threshold.
- If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `SinglestoreOpsRequest` to expand the storage of the database.

7. `KubeDB` Ops-manager operator watches the `SinglestoreOpsRequest` CRO.

8. Then the `KubeDB` Ops-manager operator will expand the storage of the cluster component as specified on the `SinglestoreOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling storage of various Kafka cluster components using `SinglestoreAutoscaler` CRD.
