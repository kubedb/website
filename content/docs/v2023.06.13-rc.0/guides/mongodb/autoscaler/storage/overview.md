---
title: MongoDB Storage Autoscaling Overview
menu:
  docs_v2023.06.13-rc.0:
    identifier: mg-storage-auto-scaling-overview
    name: Overview
    parent: mg-storage-auto-scaling
    weight: 10
menu_name: docs_v2023.06.13-rc.0
section_menu_id: guides
info:
  autoscaler: v0.19.0-rc.0
  cli: v0.34.0-rc.0
  dashboard: v0.10.0-rc.0
  installer: v2023.06.13-rc.0
  ops-manager: v0.21.0-rc.0
  provisioner: v0.34.0-rc.0
  schema-manager: v0.10.0-rc.0
  ui-server: v0.10.0-rc.0
  version: v2023.06.13-rc.0
  webhook-server: v0.10.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2023.06.13-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2023.06.13-rc.0/setup/install/enterprise) to try this feature." >}}

# MongoDB Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `mongodbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2023.06.13-rc.0/guides/mongodb/concepts/mongodb)
  - [MongoDBAutoscaler](/docs/v2023.06.13-rc.0/guides/mongodb/concepts/autoscaler)
  - [MongoDBOpsRequest](/docs/v2023.06.13-rc.0/guides/mongodb/concepts/opsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of MongoDB" src="/docs/v2023.06.13-rc.0/images/mongodb/storage-process.svg">
<figcaption align="center">Fig: Storage Auto Scaling process of MongoDB</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

- Each StatefulSet creates a Persistent Volume according to the Volume Claim Template provided in the statefulset configuration.

4. Then, in order to set up storage autoscaling of the various components (ie. ReplicaSet, Shard, ConfigServer etc.) of the `MongoDB` database the user creates a `MongoDBAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `MongoDBAutoscaler` CRO.

6. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
- If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `MongoDBOpsRequest` to expand the storage of the database. 
   
7. `KubeDB` Ops-manager operator watches the `MongoDBOpsRequest` CRO.

8. Then the `KubeDB` Ops-manager operator will expand the storage of the database component as specified on the `MongoDBOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling storage of various MongoDB database components using `MongoDBAutoscaler` CRD.