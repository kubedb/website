---
title: Reconfiguring TLS of Redis
menu:
  docs_v2024.6.4:
    identifier: rd-reconfigure-tls-overview
    name: Overview
    parent: rd-reconfigure-tls
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

# Reconfiguring TLS of Redis Database

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2024.6.4/guides/redis/concepts/redis)
  - [RedisSentinel](/docs/v2024.6.4/guides/redis/concepts/redissentinel)
  - [RedisOpsRequest](/docs/v2024.6.4/guides/redis/concepts/redisopsrequest)

## How Reconfiguring Redis TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Redis` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Redis" src="/docs/v2024.6.4/images/day-2-operation/redis/rd-reconfigure-tls.svg">
<figcaption align="center">Fig: Reconfiguring TLS process of Redis</figcaption>
</figure>

The Reconfiguring Redis/RedisSentinel TLS process consists of the following steps:

1. At first, a user creates a `Redis`/`RedisSentinel` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` and `RedisSentinel` CR.

3. When the operator finds a `Redis`/`RedisSentinel` CR, it creates required number of `StatefulSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Redis` database the user creates a `RedisOpsRequest` CR with the desired version.

5. Then, in order to reconfigure the TLS configuration (rotate certificate, update certificate) of the `RedisSentinel` database the user creates a `RedisSentinelOpsRequest` CR with the desired version.

6. `KubeDB` Enterprise operator watches the `RedisOpsRequest` and `RedisSentinelOpsRequest` CR.

7. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the reconfiguring process.  

8. When it finds a `RedisSentinelOpsRequest` CR, it halts the `RedisSentinel` object which is referred from the `RedisSentinelOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `RedisSentinel` object during the reconfiguring process.

9. By looking at the target version from `RedisOpsRequest`/`RedisSentinelOpsRequest` CR, `KubeDB` Enterprise operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

10. After successfully reconfiguring `Redis`/`RedisSentinel` object, the `KubeDB` Enterprise operator resumes the `Redis`/`RedisSentinel` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Redis database using update operation.