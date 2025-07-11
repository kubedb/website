---
title: Druid Storage Autoscaling Overview
menu:
  docs_v2025.4.30:
    identifier: guides-druid-autoscaler-storage-overview
    name: Overview
    parent: guides-druid-autoscaler-storage
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

# Druid Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `druidautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Druid](/docs/v2025.4.30/guides/druid/concepts/druid)
    - [DruidAutoscaler](/docs/v2025.4.30/guides/druid/concepts/druidautoscaler)
    - [DruidOpsRequest](/docs/v2025.4.30/guides/druid/concepts/druidopsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Druid` cluster components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of Druid" src="/docs/v2025.4.30/guides/druid/autoscaler/storage/images/storage-autoscaling.png">
<figcaption align="center">Fig: Storage Auto Scaling process of Druid</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Druid` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Druid` CR.

3. When the operator finds a `Druid` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. 

5. Then, in order to set up storage autoscaling of the druid data nodes (i.e. Historicals, MiddleManagers) of the `Druid` cluster, the user creates a `DruidAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `DruidAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the clusters to check if it exceeds the specified usage threshold. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `DruidOpsRequest` to expand the storage of the database.

8. `KubeDB` Ops-manager operator watches the `DruidOpsRequest` CRO. 

9. Then the `KubeDB` Ops-manager operator will expand the storage of the cluster component as specified on the `DruidOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of various Druid cluster components using `DruidAutoscaler` CRD.
