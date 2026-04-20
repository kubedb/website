---
title: Updating Redis Version Overview
menu:
  docs_v2024.1.26-rc.0:
    identifier: rd-update-version-overview
    name: Overview
    parent: rd-update-version
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

# Updating Redis version Overview

This guide will give you an overview on how KubeDB Ops Manager update the version of `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2024.1.26-rc.0/guides/redis/concepts/redis)
  - [RedisSentinel](/docs/v2024.1.26-rc.0/guides/redis/concepts/redissentinel)
  - [RedisOpsRequest](/docs/v2024.1.26-rc.0/guides/redis/concepts/redisopsrequest)

## How Update Version Process Works

The following diagram shows how KubeDB Ops Manager used to update the version of `Redis`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Update Version Process of Redis" src="/docs/v2024.1.26-rc.0/images/day-2-operation/redis/rd-updating.svg">
<figcaption align="center">Fig: Update Version Process of Redis</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Redis`/`RedisSentinel` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` and `RedisSentinel` CR.

3. When the operator finds a `Redis`/`RedisSentinel` CR, it creates required number of `StatefulSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to update the version of the `Redis` database the user creates a `RedisOpsRequest` CR with the desired version.

5. Then, in order to update the version of the `RedisSentinel` database the user creates a `RedisSentinelOpsRequest` CR with the desired version.

6. `KubeDB` Enterprise operator watches the `RedisOpsRequest` and `RedisSentinelOpsRequest` CR.

7. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the updating process.  

8. When it finds a `RedisSentinelOpsRequest` CR, it halts the `RedisSentinel` object which is referred from the `RedisSentinelOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `RedisSentinel` object during the updating process.

9. By looking at the target version from `RedisOpsRequest`/`RedisSentinelOpsRequest` CR, `KubeDB` Enterprise operator updates the images of all the `StatefulSets`.

10. After successfully updating the `StatefulSets` and their `Pods` images, the `KubeDB` Enterprise operator updates the image of the `Redis`/`RedisSentinel` object to reflect the updated state of the database.

11. After successfully updating of `Redis`/`RedisSentinel` object, the `KubeDB` Enterprise operator resumes the `Redis`/`RedisSentinel` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Redis database using update operation.

## Next Steps

- Learn how to Update Version of [Redis Standalone](/docs/v2024.1.26-rc.0/guides/redis/update-version/standalone)
- Learn how to Update Version of [Redis Cluster](/docs/v2024.1.26-rc.0/guides/redis/update-version/cluster)
- Learn how to Update Version of [Redis Sentinel](/docs/v2024.1.26-rc.0/guides/redis/update-version/sentinel)