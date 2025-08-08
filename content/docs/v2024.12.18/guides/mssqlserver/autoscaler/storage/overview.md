---
title: MSSQLServer Storage Autoscaling Overview
menu:
  docs_v2024.12.18:
    identifier: ms-storage-autoscaling-overview
    name: Overview
    parent: ms-storage-autoscaling
    weight: 10
menu_name: docs_v2024.12.18
section_menu_id: guides
info:
  autoscaler: v0.35.0
  cli: v0.50.0
  dashboard: v0.26.0
  installer: v2024.12.18
  ops-manager: v0.37.0
  provisioner: v0.50.0
  schema-manager: v0.26.0
  ui-server: v0.26.0
  version: v2024.12.18
  webhook-server: v0.26.0
---

> New to KubeDB? Please start [here](/docs/v2024.12.18/README).

# MSSQLServer Storage Autoscaling

This guide will give an overview on how KubeDB `Autoscaler` operator autoscales the database storage using `MSSQLServerAutoscaler` CRD.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MSSQLServer](/docs/v2024.12.18/guides/mssqlserver/concepts/mssqlserver)
  - [MSSQLServerOpsRequest](/docs/v2024.12.18/guides/mssqlserver/concepts/opsrequest)
  - [MSSQLServerAutoscaler](/docs/v2024.12.18/guides/mssqlserver/concepts/autoscaler)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MSSQLServer`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of MSSQLServer" src="/docs/v2024.12.18/images/mssqlserver/ms-storage-autoscaling.png">
<figcaption align="center">Fig: Storage Auto Scaling process of MSSQLServer</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MSSQLServer` Custom Resource (CR).

2. `KubeDB` Provisioner operator watches the `MSSQLServer` CR.

3. When the operator finds a `MSSQLServer` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volumes according to the Volume Claim Template provided in the petset's configuration.

5. Then, in order to set up storage autoscaling of the `MSSQLServer` database the user creates a `MSSQLServerAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `MSSQLServerAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
8. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `MSSQLServerOpsRequest` to expand the storage of the database. 
   
9. `KubeDB` Ops-manager operator watches the `MSSQLServerOpsRequest` CRO.

10. Then the `KubeDB` Ops-manager operator will expand the storage of the database as specified on the `MSSQLServerOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of MSSQLServer database using `MSSQLServerAutoscaler` CRD.
