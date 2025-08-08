---
title: Memcached Vertical Scaling Overview
menu:
  docs_v2024.9.30:
    identifier: mc-vertical-scaling-overview
    name: Overview
    parent: vertical-scaling
    weight: 10
menu_name: docs_v2024.9.30
section_menu_id: guides
info:
  autoscaler: v0.33.0
  cli: v0.48.0
  dashboard: v0.24.0
  installer: v2024.9.30
  ops-manager: v0.35.0
  provisioner: v0.48.0
  schema-manager: v0.24.0
  ui-server: v0.24.0
  version: v2024.9.30
  webhook-server: v0.24.0
---

> New to KubeDB? Please start [here](/docs/v2024.9.30/README).

# Memcached Vertical Scaling Overview

This guide will give you an overview on how KubeDB Ops Manager updates the resources(CPU and Memory) of the `Memcached` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2024.9.30/guides/memcached/concepts/memcached)
  - [MemcachedOpsRequest](/docs/v2024.9.30/guides/memcached/concepts/memcached-opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops Manager updates the resources of the `Memcached` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Memcached" src="/docs/v2024.9.30/images/memcached/memcached-vertical-scaling.png">
<figcaption align="center">Fig: Vertical scaling process of Memcached</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Memcached` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Memcached` CR.

3. When the operator finds a `Memcached` CR, it creates required number of `PetSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to update the version of the `Memcached` database the user creates a `MemcachedOpsRequest` CR with the desired version.

6. `KubeDB` Enterprise operator watches the `MemcachedOpsRequest` CR.

7. When it finds a `MemcachedOpsRequest` CR, it halts the `Memcached` object which is referred from the `MemcachedOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Memcached` object during the updating process.

9. After the successful update of the resources of the PetSet's replica, the `KubeDB` Enterprise operator updates the `Memcached` object to reflect the updated state.

10. After successfully updating of `Memcached`object, the `KubeDB` Enterprise operator resumes the `Memcached` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Memcached database using update operation.