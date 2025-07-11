---
title: Reconfiguring TLS of Memcached
menu:
  docs_v2025.4.30:
    identifier: mc-reconfigure-tls-overview
    name: Overview
    parent: reconfigure-tls
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Reconfiguring TLS of Memcached Database

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `Memcached` database.

## Before You Begin
- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2025.4.30/guides/memcached/concepts/memcached)
  - [MemcachedOpsRequest](/docs/v2025.4.30/guides/memcached/concepts/memcached-opsrequest)

## How Reconfiguring Memcached TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Memcached` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Memcached" src="/docs/v2025.4.30/images/memcached/memcached-reconfigure-tls.png">
<figcaption align="center">Fig: Reconfiguring TLS process of Memcached</figcaption>
</figure>

The Reconfiguring Memcached TLS process consists of the following steps:

1. At first, a user creates a `Memcached` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Memcached` CR.

3. When the operator finds a `Memcached` CR, it creates required number of `PetSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Memcached` database the user creates a `MemcachedOpsRequest` CR with the desired version.

5. `KubeDB` Enterprise operator watches the `MemcachedOpsRequest` CR.

6. When it finds a `MemcachedOpsRequest` CR, it halts the `Memcached` object which is referred from the `MemcachedOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Memcached` object during the reconfiguring process.  

7. By looking at the target version from `MemcachedOpsRequest` CR, `KubeDB` Enterprise operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. After successfully reconfiguring `Memcached` object, the `KubeDB` Enterprise operator resumes the `Memcached` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Memcached database using update operation.