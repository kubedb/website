---
title: Redis Vertical Scaling Overview
menu:
  docs_v2023.04.10:
    identifier: rd-vertical-scaling-overview
    name: Overview
    parent: rd-vertical-scaling
    weight: 10
menu_name: docs_v2023.04.10
section_menu_id: guides
info:
  autoscaler: v0.18.0
  cli: v0.33.0
  dashboard: v0.9.0
  installer: v2023.04.10
  ops-manager: v0.20.0
  provisioner: v0.33.0
  schema-manager: v0.9.0
  ui-server: v0.9.0
  version: v2023.04.10
  webhook-server: v0.9.0
---

> New to KubeDB? Please start [here](/docs/v2023.04.10/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2023.04.10/setup/install/enterprise) to try this feature." >}}

# Redis Vertical Scaling Overview

This guide will give you an overview on how KubeDB Enterprise operator updates the resources(for example CPU and Memory etc.) of the `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2023.04.10/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2023.04.10/guides/redis/concepts/redisopsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Enterprise operator updates the resources of the `Redis` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Redis" src="/docs/v2023.04.10/images/day-2-operation/redis/rd-vertical_scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of Redis</figcaption>
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

9. After the successful update of the resources of the StatefulSet's replica, the `KubeDB` Enterprise operator updates the `Redis`/`RedisSentinel` object to reflect the updated state.

10. After successfully updating of `Redis`/`RedisSentinel` object, the `KubeDB` Enterprise operator resumes the `Redis`/`RedisSentinel` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Redis database using update operation.