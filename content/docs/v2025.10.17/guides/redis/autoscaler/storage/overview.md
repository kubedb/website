---
title: Redis Storage Autoscaling Overview
menu:
  docs_v2025.10.17:
    identifier: rd-storage-auto-scaling-overview
    name: Overview
    parent: rd-storage-auto-scaling
    weight: 10
menu_name: docs_v2025.10.17
section_menu_id: guides
info:
  autoscaler: v0.44.0
  cli: v0.59.0
  dashboard: v0.35.0
  installer: v2025.10.17
  ops-manager: v0.46.0
  provisioner: v0.59.0
  schema-manager: v0.35.0
  ui-server: v0.35.0
  version: v2025.10.17
  webhook-server: v0.35.0
---

> New to KubeDB? Please start [here](/docs/v2025.10.17/README).

# Redis Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `redisautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2025.10.17/guides/redis/concepts/redis)
  - [RedisAutoscaler](/docs/v2025.10.17/guides/redis/concepts/autoscaler)
  - [RedisOpsRequest](/docs/v2025.10.17/guides/redis/concepts/redisopsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Redis/Valkey` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of Redis" src="/docs/v2025.10.17/images/redis/rd-storage-autoscaling.svg">
<figcaption align="center">Fig: Storage Auto Scaling process of Redis</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration.

5. Then, in order to set up storage autoscaling of the various components (ie. ReplicaSet, Shard, ConfigServer etc.) of the `Redis` database the user creates a `RedisAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `RedisAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
  If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `RedisOpsRequest` to expand the storage of the database. 
   
8. `KubeDB` Ops-manager operator watches the `RedisOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will expand the storage of the database component as specified on the `RedisOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of various Redis database components using `RedisAutoscaler` CRD.
