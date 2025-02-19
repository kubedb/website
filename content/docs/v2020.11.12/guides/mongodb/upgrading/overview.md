---
title: Upgrading MongoDB Overview
menu:
  docs_v2020.11.12:
    identifier: mg-upgrading-overview
    name: Overview
    parent: mg-upgrading
    weight: 10
menu_name: docs_v2020.11.12
section_menu_id: guides
info:
  cli: v0.15.1
  community: v0.15.1
  enterprise: v0.2.1
  installer: v0.15.1
  version: v2020.11.12
---

> New to KubeDB? Please start [here](/docs/v2020.11.12/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2020.11.12/setup/install/enterprise) to try this feature." >}}

# Upgrading MongoDB version Overview

This guide will give you an overview on how KubeDB Enterprise operator upgrade the version of `MongoDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2020.11.12/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2020.11.12/guides/mongodb/concepts/opsrequest)

## How Upgrade Process Works

The following diagram shows how KubeDB Enterprise operator used to upgrade the version of `MongoDB`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Upgrading Process of MongoDB" src="/docs/v2020.11.12/images/day-2-operation/mongodb/mg-upgrading.svg">
<figcaption align="center">Fig: Upgrading Process of MongoDB</figcaption>
</figure>

The upgrading process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MongoDB` CR.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to upgrade the version of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with the desired version.

5. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it halts the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the upgrading process.  

7. By looking at the target version from `MongoDBOpsRequest` CR, `KubeDB` Enterprise operator updates the images of all the `StatefulSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `StatefulSets` and their `Pods` images, the `KubeDB` Enterprise operator updates the image of the `MongoDB` object to reflect the updated state of the database.

9. After successfully updating of `MongoDB` object, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on upgrading of a MongoDB database using upgrade operation.