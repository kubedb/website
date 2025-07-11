---
title: Updating ZooKeeper Overview
menu:
  docs_v2025.6.30:
    identifier: zk-update-version-overview
    name: Overview
    parent: zk-update-version
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

# Overview of ZooKeeper Version Update

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `ZooKeeper` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ZooKeeper](/docs/v2025.6.30/guides/zookeeper/concepts/zookeeper)
    - [ZooKeeperOpsRequest](/docs/v2025.6.30/guides/zookeeper/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `ZooKeeper`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of ZooKeeper" src="/docs/v2025.6.30/images/day-2-operation/zookeeper/zk-version-update.svg">
<figcaption align="center">Fig: updating Process of ZooKeeper</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `ZooKeeper` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `ZooKeeper` CR.

3. When the operator finds a `ZooKeeper` CR, it creates required number of `PetSets` and other kubernetes native resources like secrets, services, etc.

4. Then, in order to update the version of the `ZooKeeper` database the user creates a `ZooKeeperOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `ZooKeeperOpsRequest` CR.

6. When it finds a `ZooKeeperOpsRequest` CR, it halts the `ZooKeeper` object which is referred from the `ZooKeeperOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ZooKeeper` object during the updating process.

7. By looking at the target version from `ZooKeeperOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`. 

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the version field of the `ZooKeeper` object to reflect the updated state of the database.

9. After successfully updating of `ZooKeeper` object, the `KubeDB` Ops-manager operator resumes the `ZooKeeper` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the [next](/docs/v2025.6.30/guides/zookeeper/update-version/update-version) doc, we are going to show a step-by-step guide on updating of a ZooKeeper database using updateVersion operation.