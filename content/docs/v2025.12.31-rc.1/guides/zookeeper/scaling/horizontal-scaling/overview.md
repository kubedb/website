---
title: ZooKeeper Horizontal Scaling Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: zk-horizontal-scaling-overview
    name: Overview
    parent: zk-horizontal-scaling
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# ZooKeeper Horizontal Scaling

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `ZooKeeper` cluster.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ZooKeeper](/docs/v2025.12.31-rc.1/guides/zookeeper/concepts/zookeeper)
    - [ZooKeeperOpsRequest](/docs/v2025.12.31-rc.1/guides/zookeeper/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator scales up or down `ZooKeeper` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of ZooKeeper" src="/docs/v2025.12.31-rc.1/images/day-2-operation/zookeeper/zk-horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of ZooKeeper</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `ZooKeeper` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `ZooKeeper` CR.

3. When the operator finds a `ZooKeeper` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `ZooKeeper` cluster, the user creates a `ZooKeeperOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `ZooKeeperOpsRequest` CR.

6. When it finds a `ZooKeeperOpsRequest` CR, it halts the `ZooKeeper` object which is referred from the `ZooKeeperOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ZooKeeper` object during the horizontal scaling process.

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `ZooKeeperOpsRequest` CR.

8. After the successfully scaling the replicas of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `ZooKeeper` object to reflect the updated state.

9. After the successful scaling of the `ZooKeeper` replicas, the `KubeDB` Ops-manager operator resumes the `ZooKeeper` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the [next](/docs/v2025.12.31-rc.1/guides/zookeeper/scaling/horizontal-scaling/horizontal-scaling) docs, we are going to show a step by step guide on horizontal scaling of ZooKeeper database using `ZooKeeperOpsRequest` CRD.