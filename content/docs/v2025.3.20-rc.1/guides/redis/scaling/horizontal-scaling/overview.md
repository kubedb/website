---
title: Redis Horizontal Scaling Overview
menu:
  docs_v2025.3.20-rc.1:
    identifier: rd-horizontal-scaling-overview
    name: Overview
    parent: rd-horizontal-scaling
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
info:
  autoscaler: v0.37.0-rc.1
  cli: v0.53.0-rc.1
  dashboard: v0.29.0-rc.1
  installer: v2025.3.20-rc.1
  ops-manager: v0.39.0-rc.1
  provisioner: v0.53.0-rc.1
  schema-manager: v0.29.0-rc.1
  ui-server: v0.29.0-rc.1
  version: v2025.3.20-rc.1
  webhook-server: v0.29.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.3.20-rc.1/README).

# Redis Horizontal Scaling

This guide will give an overview on how KubeDB Ops Manager scales up or down of `Redis` cluster database for both the number of replicas and shards.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2025.3.20-rc.1/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2025.3.20-rc.1/guides/redis/concepts/redisopsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `Redis` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of Redis" src="/docs/v2025.3.20-rc.1/images/day-2-operation/redis/rd-horizontal_scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of Redis</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Redis`/`RedisSentinel` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` and `RedisSentinel` CR.

3. When the operator finds a `Redis`/`RedisSentinel` CR, it creates required number of `PetSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to scale the number of replica or shard for the `Redis` cluster database the user creates a `RedisOpsRequest` CR with desired information.

5. Then, in order to scale the number of replica for the `RedisSentinel` instance the user creates a `RedisSentinelOpsRequest` CR with desired information.

6. `KubeDB` Enterprise operator watches the `RedisOpsRequest` and `RedisSentinelOpsRequest` CR.

7. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the scaling process.

8. When it finds a `RedisSentinelOpsRequest` CR, it halts the `RedisSentinel` object which is referred from the `RedisSentinelOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `RedisSentinel` object during the scaling process.

9. Then the Redis Ops-manager operator will scale the related PetSet Pods to reach the expected number of shards and/or replicas defined in the RedisOpsRequest or RedisSentinelOpsRequest CR.

10. After the successful scaling the replicas  of the related PetSet Pods, the KubeDB Ops-manager operator updates the number of replicas/shards in the Redis/RedisSentinel object to reflect the updated state.

11. After successfully updating of `Redis`/`RedisSentinel` object, the `KubeDB` Enterprise operator resumes the `Redis`/`RedisSentinel` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Redis database using scale operation.