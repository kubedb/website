---
title: Reconfiguring MongoDB
menu:
  docs_v2022.08.04-rc.1:
    identifier: mg-reconfigure-overview
    name: Overview
    parent: mg-reconfigure
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

# Reconfiguring MongoDB

This guide will give an overview on how KubeDB Enterprise operator reconfigures `MongoDB` database components such as ReplicaSet, Shard, ConfigServer, Mongos, etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2022.08.04-rc.1/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2022.08.04-rc.1/guides/mongodb/concepts/opsrequest)

## How Reconfiguring MongoDB Process Works

The following diagram shows how KubeDB Enterprise operator reconfigures `MongoDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of MongoDB" src="/docs/v2022.08.04-rc.1/images/day-2-operation/mongodb/mg-reconfigure.svg">
<figcaption align="center">Fig: Reconfiguring process of MongoDB</figcaption>
</figure>

The Reconfiguring MongoDB process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the reconfiguring process.  

7. Then the `KubeDB` Enterprise operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MogoDBOpsRequest` CR.

8. Then the `KubeDB` Enterprise operator will restart the related StatefulSet Pods so that they restart with the new configuration defined in the `MongoDBOpsRequest` CR.

9. After the successful reconfiguring of the `MongoDB` components, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring MongoDB database components using `MongoDBOpsRequest` CRD.