---
title: Memcached Compute Autoscaling Overview
menu:
  docs_v2025.10.17:
    identifier: mc-auto-scaling-overview
    name: Overview
    parent: compute-auto-scaling
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

# Memcached Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `Memcachedautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Memcached](/docs/v2025.10.17/guides/memcached/concepts/memcached)
  - [MemcachedAutoscaler](/docs/v2025.10.17/guides/memcached/concepts/memcached-autoscaler)
  - [MemcachedOpsRequest](/docs/v2025.10.17/guides/memcached/concepts/memcached-opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Memcached` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Compute Auto Scaling process of Memcached" src="/docs/v2025.10.17/images/memcached/memcached-autoscaling-compute.png">
<figcaption align="center">Fig: Compute Auto Scaling process of Memcached</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, user creates a `Memcached` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Memcached` CRO.

3. When the operator finds a `Memcached` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the `Memcached` database the user creates a `MemcachedAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `MemcachedAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for the database, as specified in the `MemcachedAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `MemcachedOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `MemcachedOpsRequest` CRO.

9. Then the `KubeDB` ops-manager operator will scale the database component vertically as specified on the `MemcachedOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling of various Memcached database components using `MemcachedAutoscaler` CRD.
