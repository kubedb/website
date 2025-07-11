---
title: Updating MongoDB Overview
menu:
  docs_v2025.4.30:
    identifier: mg-updating-overview
    name: Overview
    parent: mg-updating
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

# updating MongoDB version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `MongoDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2025.4.30/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2025.4.30/guides/mongodb/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `MongoDB`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of MongoDB" src="/docs/v2025.4.30/images/day-2-operation/mongodb/mg-updating.svg">
<figcaption align="center">Fig: updating Process of MongoDB</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `MongoDB` object during the updating process.  

7. By looking at the target version from `MongoDBOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `MongoDB` object to reflect the updated state of the database.

9. After successfully updating of `MongoDB` object, the `KubeDB` Ops-manager operator resumes the `MongoDB` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a MongoDB database using updateVersion operation.