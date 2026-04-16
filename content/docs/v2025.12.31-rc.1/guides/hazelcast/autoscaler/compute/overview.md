---
title: Hazelcast Compute Autoscaling Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: hz-auto-scaling-overview
    name: Overview
    parent: hz-compute-auto-scaling
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Hazelcast Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `hazelcastautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Hazelcast](/docs/v2025.12.31-rc.1/guides/hazelcast/concepts/hazelcast)
  - [HazelcastAutoscaler](/docs/v2025.12.31-rc.1/guides/hazelcast/concepts/hazelcastautoscaler)
  - [HazelcastOpsRequest](/docs/v2025.12.31-rc.1/guides/hazelcast/concepts/hazelcast-opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Hazelcast` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
    <img alt="Compute Auto Scaling process of Hazelcast" src="/docs/v2025.12.31-rc.1/images/day-2-operation/hazelcast/hz-compute-autoscaling.svg">
<figcaption align="center">Fig: Compute Auto Scaling process of Hazelcast</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Hazelcast` Custom Resource Object (CRO).

2. `KubeDB` Provisioner operator watches the `Hazelcast` CRO.

3. When the operator finds a `Hazelcast` CRO, it creates required number of `Statefulsets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the various components (ie. ) of the `Hazelcast` cluster the user creates a `HazelcastAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `HazelcastAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `HazelcastAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `HazelcastOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `HazelcastOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `HazelcastOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of various Hazelcast database components using `HazelcastAutoscaler` CRD.
