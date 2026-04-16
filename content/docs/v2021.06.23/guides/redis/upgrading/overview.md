---
title: Upgrading Redis Overview
menu:
  docs_v2021.06.23:
    identifier: rd-upgrading-overview
    name: Overview
    parent: rd-upgrading
    weight: 10
menu_name: docs_v2021.06.23
section_menu_id: guides
info:
  autoscaler: v0.4.0
  cli: v0.19.0
  community: v0.19.0
  enterprise: v0.6.0
  installer: v2021.06.23
  version: v2021.06.23
---

> New to KubeDB? Please start [here](/docs/v2021.06.23/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.06.23/setup/install/enterprise) to try this feature." >}}

# Upgrading Redis version Overview

This guide will give you an overview on how KubeDB Enterprise operator upgrade the version of `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2021.06.23/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2021.06.23/guides/redis/concepts/opsrequest)

## How Upgrade Process Works

The following diagram shows how KubeDB Enterprise operator used to upgrade the version of `Redis`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Upgrading Process of MongoDB" src="/docs/v2021.06.23/images/day-2-operation/mongodb/mg-upgrading.svg">
<figcaption align="center">Fig: Upgrading Process of MongoDB</figcaption>
</figure>

The upgrading process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required number of `StatefulSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to upgrade the version of the `Redis` database the user creates a `RedisOpsRequest` CR with the desired version.

5. `KubeDB` Enterprise operator watches the `RedisOpsRequest` CR.

6. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the upgrading process.  

7. By looking at the target version from `RedisOpsRequest` CR, `KubeDB` Enterprise operator updates the images of all the `StatefulSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `StatefulSets` and their `Pods` images, the `KubeDB` Enterprise operator updates the image of the `Redis` object to reflect the updated state of the database.

9. After successfully updating of `Redis` object, the `KubeDB` Enterprise operator resumes the `Redis` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on upgrading of a Redis database using upgrade operation.