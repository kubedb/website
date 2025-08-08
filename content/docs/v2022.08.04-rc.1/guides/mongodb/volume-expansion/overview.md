---
title: MongoDB Volume Expansion Overview
menu:
  docs_v2022.08.04-rc.1:
    identifier: mg-volume-expansion-overview
    name: Overview
    parent: mg-volume-expansion
    weight: 10
menu_name: docs_v2022.08.04-rc.1
section_menu_id: guides
info:
  autoscaler: v0.13.0-rc.1
  cli: v0.28.0-rc.1
  dashboard: v0.4.0-rc.1
  installer: v2022.08.04-rc.1
  ops-manager: v0.15.0-rc.1
  provisioner: v0.28.0-rc.1
  schema-manager: v0.4.0-rc.1
  ui-server: v0.4.0-rc.1
  version: v2022.08.04-rc.1
  webhook-server: v0.4.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2022.08.04-rc.1/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.08.04-rc.1/setup/install/enterprise) to try this feature." >}}

# MongoDB Volume Expansion

This guide will give an overview on how KubeDB Enterprise operator expand the volume of various component of `MongoDB` such as ReplicaSet, Shard, ConfigServer, Mongos, etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2022.08.04-rc.1/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2022.08.04-rc.1/guides/mongodb/concepts/opsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Enterprise operator expand the volumes of `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of MongoDB" src="/docs/v2022.08.04-rc.1/images/day-2-operation/mongodb/mg-volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of MongoDB</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Each StatefulSet creates a Persistent Volume according to the Volume Claim Template provided in the statefulset configuration. This Persistent Volume will be expanded by the `KubeDB` Enterprise operator.

5. Then, in order to expand the volume of the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

6. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

7. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the volume expansion process.

8. Then the `KubeDB` Enterprise operator will expand the persistent volume to reach the expected size defined in the `MongoDBOpsRequest` CR.

9. After the successfully expansion of the volume of the related StatefulSet Pods, the `KubeDB` Enterprise operator updates the new volume size in the `MongoDB` object to reflect the updated state.

10. After the successful Volume Expansion of the `MongoDB` components, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on Volume Expansion of various MongoDB database components using `MongoDBOpsRequest` CRD.
