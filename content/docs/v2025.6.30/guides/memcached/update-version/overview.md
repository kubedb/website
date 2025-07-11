---
title: Updating Memcached Version Overview
menu:
  docs_v2025.6.30:
    identifier: mc-update-version-overview
    name: Overview
    parent: update-version
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

# Updating Memcached version Overview

This guide will give you an overview on how KubeDB Ops Manager update the version of `Memcached` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2025.6.30/guides/memcached/concepts/memcached)
  - [MemcachedOpsRequest](/docs/v2025.6.30/guides/memcached/concepts/memcached-opsrequest)

## How Update Version Process Works

The following diagram shows how KubeDB Ops Manager used to update the version of `Memcached`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Update Version Process of Memcached" src="/docs/v2025.6.30/images/memcached/memcached-version-update.png">
<figcaption align="center">Fig: Update Version Process of Memcached</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Memcached` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Memcached` CR.

3. When the operator finds a `Memcached` CR, it creates required number of `PetSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to update the version of the `Memcached` database the user creates a `MemcachedOpsRequest` CR with the desired version.

5. `KubeDB` Enterprise operator watches the `MemcachedOpsRequest` and `MemcachedSentinelOpsRequest` CR.

6. When it finds a `MemcachedOpsRequest` CR, it halts the `Memcached` object which is referred from the `MemcachedOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Memcached` object during the updating process.  

7. By looking at the target version from `MemcachedOpsRequest` CR, `KubeDB` Enterprise operator updates the images of all the `PetSets`.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Enterprise operator updates the image of the `Memcached` object to reflect the updated state of the database.

9. After successfully updating of `Memcached`object, the `KubeDB` Enterprise operator resumes the `Memcached` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Memcached database using update operation.