---
title: PerconaXtraDB Compute Autoscaling Overview
menu:
  docs_v2024.6.4:
    identifier: guides-perconaxtradb-autoscaling-compute-overview
    name: Overview
    parent: guides-perconaxtradb-autoscaling-compute
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

# PerconaXtraDB Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `perconaxtradbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PerconaXtraDB](/docs/v2024.6.4/guides/percona-xtradb/concepts/perconaxtradb)
  - [PerconaXtraDBAutoscaler](/docs/v2024.6.4/guides/percona-xtradb/concepts/autoscaler)
  - [PerconaXtraDBOpsRequest](/docs/v2024.6.4/guides/percona-xtradb/concepts/opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `PerconaXtraDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Auto Scaling process of PerconaXtraDB" src="/docs/v2024.6.4/guides/percona-xtradb/autoscaler/compute/overview/images/pxas-compute.png">
<figcaption align="center">Fig: Auto Scaling process of PerconaXtraDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, the user creates a `PerconaXtraDB` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `PerconaXtraDB` CRO.

3. When the operator finds a `PerconaXtraDB` CRO, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the CPU & Memory resources of the `PerconaXtraDB` database the user creates a `PerconaXtraDBAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `PerconaXtraDBAutoscaler` CRO.

6. `KubeDB` Autoscaler operator utilizes the modified version of Kubernetes official [VPA-Recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg) for different components of the database, as specified in the `perconaxtradbautoscaler` CRO.
It generates recommendations based on resource usages, & store them in the `status` section of the autoscaler CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `PerconaXtraDBOpsRequest` CRO to scale the database to match the recommendation provided by the VPA object.

8. `KubeDB Ops-Manager operator` watches the `PerconaXtraDBOpsRequest` CRO.

9. Lastly, the `KubeDB Ops-Manager operator` will scale the database component vertically as specified on the `PerconaXtraDBOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of PerconaXtraDB database using `PerconaXtraDBAutoscaler` CRD.
