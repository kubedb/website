---
title: Reconfiguring Memcached
menu:
  docs_v2025.6.30:
    identifier: mc-reconfigure-overview
    name: Overview
    parent: reconfigure
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

# Reconfiguring Memcached

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `Memcached` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2025.6.30/guides/memcached/concepts/memcached)
  - [MemcachedOpsRequest](/docs/v2025.6.30/guides/memcached/concepts/memcached-opsrequest)

## How Reconfiguring Memcached Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `Memcached` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of Memcached" src="/docs/v2025.6.30/images/memcached/memcached-reconfigure.png">
<figcaption align="center">Fig: Reconfiguring process of Memcached</figcaption>
</figure>

The Reconfiguring Memcached process consists of the following steps:

1. At first, a user creates a `Memcached` Custom Resource (CR).

2. `KubeDB` operator watches the `Memcached` CR.

3. When the operator finds a `Memcached` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `Memcached` database the user creates a `MemcachedOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `MemcachedOpsRequest` CR.

6. When it finds a `MemcachedOpsRequest` CR, it halts the `Memcached` object which is referred from the `MemcachedOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Memcached` object during the reconfiguring process.  

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MemcachedOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `MemcachedOpsRequest` CR.

9. After the successful reconfiguring of the `Memcached` components, the `KubeDB` Ops-manager operator resumes the `Memcached` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring Memcached database components using `MemcachedOpsRequest` CRD.