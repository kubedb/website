---
title: Memcached Horizontal Scaling Overview
menu:
  docs_v2026.1.19:
    identifier: mc-horizontal-scaling-overview
    name: Overview
    parent: horizontal-scaling
    weight: 10
menu_name: docs_v2026.1.19
section_menu_id: guides
info:
  autoscaler: v0.45.0
  cli: v0.60.0
  dashboard: v0.36.0
  installer: v2026.1.19
  ops-manager: v0.47.0
  provisioner: v0.60.0
  schema-manager: v0.36.0
  ui-server: v0.36.0
  version: v2026.1.19
  webhook-server: v0.36.0
---

> New to KubeDB? Please start [here](/docs/v2026.1.19/README).

# Memcached Horizontal Scaling

This guide will give an overview on how KubeDB Ops Manager scales up or down of `Memcached` database for both the number of replicas and shards.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2026.1.19/guides/memcached/concepts/memcached)
  - [MemcachedOpsRequest](/docs/v2026.1.19/guides/memcached/concepts/memcached-opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `Memcached` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of Memcached" src="/docs/v2026.1.19/images/memcached/memcached-horizontal-scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of Memcached</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Memcached` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Memcached` CR.

3. When the operator finds a `Memcached` CR, it creates required number of `PetSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to scale the number of replica for the `Memcached` database the user creates a `MemcachedOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MemcachedOpsRequest` CR.

6. When it finds a `MemcachedOpsRequest` CR, it halts the `Memcached` object which is referred from the `MemcachedOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Memcached` object during the scaling process.

7. Then the Memcached Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the MemcachedOpsRequest CR.

8. After the successful scaling the replicas of the related PetSet Pods, the KubeDB Ops-manager operator updates the number of replicas in the Memcached object to reflect the updated state.

9. After successfully updating of `Memcached` object, the `KubeDB` Enterprise operator resumes the `Memcached` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Memcached database using scale operation.
