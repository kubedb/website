---
title: MongoDB Vertical Scaling Overview
menu:
  docs_v2022.10.12-rc.0:
    identifier: mg-vertical-scaling-overview
    name: Overview
    parent: mg-vertical-scaling
    weight: 10
menu_name: docs_v2022.10.12-rc.0
section_menu_id: guides
info:
  autoscaler: v0.14.0-rc.0
  cli: v0.29.0-rc.0
  dashboard: v0.5.0-rc.0
  installer: v2022.10.12-rc.0
  ops-manager: v0.16.0-rc.0
  provisioner: v0.29.0-rc.0
  schema-manager: v0.5.0-rc.0
  ui-server: v0.5.0-rc.0
  version: v2022.10.12-rc.0
  webhook-server: v0.5.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2022.10.12-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.10.12-rc.0/setup/install/enterprise) to try this feature." >}}

# MongoDB Vertical Scaling

This guide will give an overview on how KubeDB Enterprise operator updates the resources(for example CPU and Memory etc.) of the `MongoDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2022.10.12-rc.0/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2022.10.12-rc.0/guides/mongodb/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Enterprise operator updates the resources of the `MongoDB` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of MongoDB" src="/docs/v2022.10.12-rc.0/images/day-2-operation/mongodb/mg-vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of MongoDB</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the vertical scaling process.  

7. Then the `KubeDB` Enterprise operator will update resources of the StatefulSet Pods to reach desired state.

8. After the successful update of the resources of the StatefulSet's replica, the `KubeDB` Enterprise operator updates the `MongoDB` object to reflect the updated state.

9. After the successful update  of the `MongoDB` resources, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of MongoDB database using `MongoDBOpsRequest` CRD.