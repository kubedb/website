---
title: MSSQLServer Compute Autoscaling Overview
menu:
  docs_v2025.4.30:
    identifier: ms-autoscaling-overview
    name: Overview
    parent: ms-compute-autoscaling
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

# MSSQLServer Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `MSSQLServerAutoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MSSQLServer](/docs/v2025.4.30/guides/mssqlserver/concepts/mssqlserver)
  - [MSSQLServerOpsRequest](/docs/v2025.4.30/guides/mssqlserver/concepts/opsrequest)
  - [MSSQLServerAutoscaler](/docs/v2025.4.30/guides/mssqlserver/concepts/autoscaler)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MSSQLServer` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Compute Auto Scaling process of MSSQLServer" src="/docs/v2025.4.30/images/mssqlserver/ms-compute-autoscaling.png">
<figcaption align="center">Fig: Compute Auto Scaling process of MSSQLServer</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MSSQLServer` Custom Resource Object (CRO).

2. `KubeDB` Provisioner operator watches the `MSSQLServer` CRO.

3. When the operator finds a `MSSQLServer` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the `MSSQLServer` database the user creates a `MSSQLServerAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `MSSQLServerAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `MSSQLServerAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `MSSQLServerOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `MSSQLServerOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `MSSQLServerOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling of various MSSQLServer database using `MSSQLServerAutoscaler` CRD.
