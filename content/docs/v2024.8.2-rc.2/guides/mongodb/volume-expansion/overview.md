---
title: MongoDB Volume Expansion Overview
menu:
  docs_v2024.8.2-rc.2:
    identifier: mg-volume-expansion-overview
    name: Overview
    parent: mg-volume-expansion
    weight: 10
menu_name: docs_v2024.8.2-rc.2
section_menu_id: guides
info:
  autoscaler: v0.32.0-rc.2
  cli: v0.47.0-rc.2
  dashboard: v0.23.0-rc.2
  installer: v2024.8.2-rc.2
  ops-manager: v0.34.0-rc.2
  provisioner: v0.47.0-rc.2
  schema-manager: v0.23.0-rc.2
  ui-server: v0.23.0-rc.2
  version: v2024.8.2-rc.2
  webhook-server: v0.23.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2024.8.2-rc.2/README).

# MongoDB Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of various component of `MongoDB` such as ReplicaSet, Shard, ConfigServer, Mongos, etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2024.8.2-rc.2/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2024.8.2-rc.2/guides/mongodb/concepts/opsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of MongoDB" src="/docs/v2024.8.2-rc.2/images/day-2-operation/mongodb/mg-volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of MongoDB</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `MongoDBOpsRequest` CR.

7. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `MongoDB` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `MongoDBOpsRequest` CR.

9. After the successful Volume Expansion of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the new volume size in the `MongoDB` object to reflect the updated state.

10. After the successful Volume Expansion of the `MongoDB` components, the `KubeDB` Ops-manager operator resumes the `MongoDB` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various MongoDB database components using `MongoDBOpsRequest` CRD.
