---
title: Redis Volume Expansion Overview
menu:
  docs_v2024.1.26-rc.0:
    identifier: rd-volume-expansion-overview
    name: Overview
    parent: rd-volume-expansion
    weight: 10
menu_name: docs_v2024.1.26-rc.0
section_menu_id: guides
info:
  autoscaler: v0.26.0-rc.0
  cli: v0.41.0-rc.0
  dashboard: v0.17.0-rc.0
  installer: v2024.1.26-rc.0
  ops-manager: v0.28.0-rc.0
  provisioner: v0.41.0-rc.0
  schema-manager: v0.17.0-rc.0
  ui-server: v0.17.0-rc.0
  version: v2024.1.26-rc.0
  webhook-server: v0.17.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2024.1.26-rc.0/README).

# Redis Volume Expansion

This guide will give an overview on how KubeDB Ops Manager expand the volume of `Redis`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2024.1.26-rc.0/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2024.1.26-rc.0/guides/redis/concepts/redisopsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops Manager expand the volumes of `Redis` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of Redis" src="/docs/v2024.1.26-rc.0/images/day-2-operation/redis/rd-volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of Redis</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required `StatefulSet` and related necessary stuff like secrets, services, etc.

4. The statefulSet creates Persistent Volumes according to the Volume Claim Template provided in the statefulset configuration. This Persistent Volume will be expanded by the `KubeDB` Enterprise operator.

5. Then, in order to expand the volume of the `Redis` database the user creates a `RedisOpsRequest` CR with desired information.

6. `KubeDB` Enterprise operator watches the `RedisOpsRequest` CR.

7. When it finds a `RedisOpsRequest` CR, it pauses the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the volume expansion process.

8. Then the `KubeDB` Enterprise operator will expand the persistent volume to reach the expected size defined in the `RedisOpsRequest` CR.

9. After the successful expansion of the volume of the related StatefulSet Pods, the `KubeDB` Enterprise operator updates the new volume size in the `Redis` object to reflect the updated state.

10. After the successful Volume Expansion of the `Redis`, the `KubeDB` Enterprise operator resumes the `Redis` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various Redis database using `RedisOpsRequest` CRD.
