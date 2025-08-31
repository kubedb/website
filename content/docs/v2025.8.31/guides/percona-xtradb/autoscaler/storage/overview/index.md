---
title: PerconaXtraDB Storage Autoscaling Overview
menu:
  docs_v2025.8.31:
    identifier: guides-perconaxtradb-autoscaling-storage-overview
    name: Overview
    parent: guides-perconaxtradb-autoscaling-storage
    weight: 10
menu_name: docs_v2025.8.31
section_menu_id: guides
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

# PerconaXtraDB Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `perconaxtradbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PerconaXtraDB](/docs/v2025.8.31/guides/percona-xtradb/concepts/perconaxtradb)
  - [PerconaXtraDBAutoscaler](/docs/v2025.8.31/guides/percona-xtradb/concepts/autoscaler)
  - [PerconaXtraDBOpsRequest](/docs/v2025.8.31/guides/percona-xtradb/concepts/opsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `PerconaXtraDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Autoscaling process of PerconaXtraDB" src="/docs/v2025.8.31/guides/percona-xtradb/autoscaler/storage/overview/images/pxas-storage.jpeg">
<figcaption align="center">Fig: Storage Autoscaling process of PerconaXtraDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `PerconaXtraDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `PerconaXtraDB` CR.

3. When the operator finds a `PerconaXtraDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Enterprise operator.

5. Then, in order to set up storage autoscaling of the `PerconaXtraDB` database the user creates a `PerconaXtraDBAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `PerconaXtraDBAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.

8. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `PerconaXtraDBOpsRequest` to expand the storage of the database.
9. `KubeDB` Enterprise operator watches the `PerconaXtraDBOpsRequest` CRO.
10. Then the `KubeDB` Enterprise operator will expand the storage of the database component as specified on the `PerconaXtraDBOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of various PerconaXtraDB database components using `PerconaXtraDBAutoscaler` CRD.
