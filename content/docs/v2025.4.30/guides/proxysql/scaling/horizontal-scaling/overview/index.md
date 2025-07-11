---
title: ProxySQL Horizontal Scaling Overview
menu:
  docs_v2025.4.30:
    identifier: guides-proxysql-scaling-horizontal-overview
    name: Overview
    parent: guides-proxysql-scaling-horizontal
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

# ProxySQL Horizontal Scaling

This guide will give an overview on how KubeDB Ops Manager scales up or down `ProxySQL Cluster`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ProxySQL](/docs/v2025.4.30/guides/proxysql/concepts/proxysql/)
    - [ProxySQLOpsRequest](/docs/v2025.4.30/guides/proxysql/concepts/opsrequest/)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `ProxySQL` components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of ProxySQL" src="/docs/v2025.4.30/guides/proxysql/scaling/horizontal-scaling/overview/images/horizontal-scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of ProxySQL</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `ProxySQL` Custom Resource (CR).

2. `KubeDB` Community operator watches the `ProxySQL` CR.

3. When the operator finds a `ProxySQL` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `ProxySQL` the user creates a `ProxySQLOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `ProxySQLOpsRequest` CR.

6. When it finds a `ProxySQLOpsRequest` CR, it pauses the `ProxySQL` object which is referred from the `ProxySQLOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `ProxySQL` object during the horizontal scaling process.

7. Then the `KubeDB` Enterprise operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `ProxySQLOpsRequest` CR.

8. After the successfully scaling the replicas of the PetSet Pods, the `KubeDB` Enterprise operator updates the number of replicas in the `ProxySQL` object to reflect the updated state.

9. After the successful scaling of the `ProxySQL` replicas, the `KubeDB` Enterprise operator resumes the `ProxySQL` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of ProxySQL database using `ProxySQLOpsRequest` CRD.