---
title: SingleStore Horizontal Scaling Overview
menu:
  docs_v2025.5.30:
    identifier: guides-sdb-scaling-horizontal-overview
    name: Overview
    parent: guides-sdb-scaling-horizontal
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# SingleStore Horizontal Scaling

This guide will give an overview on how KubeDB Ops Manager scales up or down `SingleStore Cluster`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [SingleStore](/docs/v2025.5.30/guides/singlestore/concepts/singlestore)
  - [SingleStoreOpsRequest](/docs/v2025.5.30/guides/singlestore/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `SingleStore` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of SingleStore" src="/docs/v2025.5.30/guides/singlestore/scaling/horizontal-scaling/overview/images/horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of SingleStore</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `SingleStore` Custom Resource (CR).

2. `KubeDB` Provisioner operator watches the `SingleStore` CR.

3. When the operator finds a `SingleStore` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `SingleStore` database the user creates a `SingleStoreOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `SingleStoreOpsRequest` CR.

6. When it finds a `SingleStoreOpsRequest` CR, it pauses the `SingleStore` object which is referred from the `SingleStoreOpsRequest`. So, the `KubeDB` Provisioner operator doesn't perform any operations on the `SingleStore` object during the horizontal scaling process.  

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `SingleStoreOpsRequest` CR.

8. After the successfully scaling the replicas of the PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `SingleStore` object to reflect the updated state.

9. After the successful scaling of the `SingleStore` replicas, the `KubeDB` Ops-manager operator resumes the `SingleStore` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of SingleStore database using `SingleStoreOpsRequest` CRD.
