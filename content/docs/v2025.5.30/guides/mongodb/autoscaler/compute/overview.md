---
title: MongoDB Compute Autoscaling Overview
menu:
  docs_v2025.5.30:
    identifier: mg-auto-scaling-overview
    name: Overview
    parent: mg-compute-auto-scaling
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# MongoDB Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `mongodbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2025.5.30/guides/mongodb/concepts/mongodb)
  - [MongoDBAutoscaler](/docs/v2025.5.30/guides/mongodb/concepts/autoscaler)
  - [MongoDBOpsRequest](/docs/v2025.5.30/guides/mongodb/concepts/opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Compute Auto Scaling process of MongoDB" src="/docs/v2025.5.30/images/mongodb/compute-process.svg">
<figcaption align="center">Fig: Compute Auto Scaling process of MongoDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `MongoDB` CRO.

3. When the operator finds a `MongoDB` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `MongoDBAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `MongoDBAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `MongoDBOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `MongoDBOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `MongoDBOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of various MongoDB database components using `MongoDBAutoscaler` CRD.
