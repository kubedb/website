---
title: MongoDB Compute Autoscaling Overview
menu:
  docs_v2022.12.13-rc.0:
    identifier: mg-auto-scaling-overview
    name: Overview
    parent: mg-compute-auto-scaling
    weight: 10
menu_name: docs_v2022.12.13-rc.0
section_menu_id: guides
info:
  autoscaler: v0.15.0-rc.0
  cli: v0.30.0-rc.0
  dashboard: v0.6.0-rc.0
  installer: v2022.12.13-rc.0
  ops-manager: v0.17.0-rc.0
  provisioner: v0.30.0-rc.0
  schema-manager: v0.6.0-rc.0
  ui-server: v0.6.0-rc.0
  version: v2022.12.13-rc.0
  webhook-server: v0.6.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2022.12.13-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.12.13-rc.0/setup/install/enterprise) to try this feature." >}}

# MongoDB Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `mongodbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2022.12.13-rc.0/guides/mongodb/concepts/mongodb)
  - [MongoDBAutoscaler](/docs/v2022.12.13-rc.0/guides/mongodb/concepts/autoscaler)
  - [MongoDBOpsRequest](/docs/v2022.12.13-rc.0/guides/mongodb/concepts/opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Auto Scaling process of MongoDB" src="/docs/v2022.12.13-rc.0/images/day-2-operation/mongodb/mg-auto-scaling.svg">
<figcaption align="center">Fig: Auto Scaling process of MongoDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `MongoDB` CRO.

3. When the operator finds a `MongoDB` CRO, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `MongoDBAutoscaler` CRO.

6. `KubeDB` Autoscaler operator creates required number of Vertical Pod Autoscaler [VPA](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#intro) for different components of the database, as specified in the `mongodbautoscaler` CRO.

7. Then `KubeDB` Autoscaler operator continuously watches the VPA objects for recommendation.

8. If the VPA generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `MongoDBOpsRequest` CRO to scale the database to match the recommendation provided by the VPA object.

9. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CRO.

10. Then the `KubeDB` Enterprise operator will scale the database component vertically as specified on the `MongoDBOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of various MongoDB database components using `MongoDBAutoscaler` CRD.
