---
title: Reconfiguring Redis
menu:
  docs_v2024.6.4:
    identifier: rd-reconfigure-overview
    name: Overview
    parent: rd-reconfigure
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Reconfiguring Redis

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2024.6.4/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2024.6.4/guides/redis/concepts/redisopsrequest)

## How Reconfiguring Redis Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `Redis` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of Redis" src="/docs/v2024.6.4/images/day-2-operation/redis/rd-reconfigure.svg">
<figcaption align="center">Fig: Reconfiguring process of Redis</figcaption>
</figure>

The Reconfiguring Redis process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `Redis` database the user creates a `RedisOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `RedisOpsRequest` CR.

6. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Redis` object during the reconfiguring process.  

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `RedisOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related StatefulSet Pods so that they restart with the new configuration defined in the `RedisOpsRequest` CR.

9. After the successful reconfiguring of the `Redis` components, the `KubeDB` Ops-manager operator resumes the `Redis` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring Redis database components using `RedisOpsRequest` CRD.