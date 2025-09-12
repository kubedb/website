---
title: PerconaXtraDB Horizontal Scaling Overview
menu:
  docs_v2024.6.4:
    identifier: guides-perconaxtradb-scaling-horizontal-overview
    name: Overview
    parent: guides-perconaxtradb-scaling-horizontal
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

# PerconaXtraDB Horizontal Scaling

This guide will give an overview on how KubeDB Ops Manager scales up or down `PerconaXtraDB Cluster`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PerconaXtraDB](/docs/v2024.6.4/guides/percona-xtradb/concepts/perconaxtradb/)
  - [PerconaXtraDBOpsRequest](/docs/v2024.6.4/guides/percona-xtradb/concepts/opsrequest/)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `PerconaXtraDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of PerconaXtraDB" src="/docs/v2024.6.4/guides/percona-xtradb/scaling/horizontal-scaling/overview/images/horizontal-scaling.jpg">
<figcaption align="center">Fig: Horizontal scaling process of PerconaXtraDB</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `PerconaXtraDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `PerconaXtraDB` CR.

3. When the operator finds a `PerconaXtraDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `PerconaXtraDB` database the user creates a `PerconaXtraDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `PerconaXtraDBOpsRequest` CR.

6. When it finds a `PerconaXtraDBOpsRequest` CR, it pauses the `PerconaXtraDB` object which is referred from the `PerconaXtraDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `PerconaXtraDB` object during the horizontal scaling process.  

7. Then the `KubeDB` Enterprise operator will scale the related StatefulSet Pods to reach the expected number of replicas defined in the `PerconaXtraDBOpsRequest` CR.

8. After the successfully scaling the replicas of the StatefulSet Pods, the `KubeDB` Enterprise operator updates the number of replicas in the `PerconaXtraDB` object to reflect the updated state.

9. After the successful scaling of the `PerconaXtraDB` replicas, the `KubeDB` Enterprise operator resumes the `PerconaXtraDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of PerconaXtraDB database using `PerconaXtraDBOpsRequest` CRD.
