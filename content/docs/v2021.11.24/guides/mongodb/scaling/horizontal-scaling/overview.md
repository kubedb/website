---
title: MongoDB Horizontal Scaling Overview
menu:
  docs_v2021.11.24:
    identifier: mg-horizontal-scaling-overview
    name: Overview
    parent: mg-horizontal-scaling
    weight: 10
menu_name: docs_v2021.11.24
section_menu_id: guides
info:
  autoscaler: v0.9.0
  cli: v0.24.0
  community: v0.24.0
  enterprise: v0.11.0
  installer: v2021.11.24
  version: v2021.11.24
---

> New to KubeDB? Please start [here](/docs/v2021.11.24/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.11.24/setup/install/enterprise) to try this feature." >}}

# MongoDB Horizontal Scaling

This guide will give an overview on how KubeDB Enterprise operator scales up or down `MongoDB` database replicas of various component such as ReplicaSet, Shard, ConfigServer, Mongos, etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2021.11.24/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2021.11.24/guides/mongodb/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Enterprise operator scales up or down `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of MongoDB" src="/docs/v2021.11.24/images/day-2-operation/mongodb/mg-horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of MongoDB</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the horizontal scaling process.  

7. Then the `KubeDB` Enterprise operator will scale the related StatefulSet Pods to reach the expected number of replicas defined in the `MongoDBOpsRequest` CR.

8. After the successfully scaling the replicas of the related StatefulSet Pods, the `KubeDB` Enterprise operator updates the number of replicas in the `MongoDB` object to reflect the updated state.

9. After the successful scaling of the `MongoDB` replicas, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of MongoDB database using `MongoDBOpsRequest` CRD.