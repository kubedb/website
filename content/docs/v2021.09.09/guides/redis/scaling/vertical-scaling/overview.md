---
title: Redis Vertical Scaling Overview
menu:
  docs_v2021.09.09:
    identifier: rd-vertical-scaling-overview
    name: Overview
    parent: rd-vertical-scaling
    weight: 10
menu_name: docs_v2021.09.09
section_menu_id: guides
info:
  autoscaler: v0.6.0
  cli: v0.21.0
  community: v0.21.0
  enterprise: v0.8.0
  installer: v2021.09.09
  version: v2021.09.09
---

> New to KubeDB? Please start [here](/docs/v2021.09.09/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.09.09/setup/install/enterprise) to try this feature." >}}

# Redis Vertical Scaling Overview

This guide will give you an overview on how KubeDB Enterprise operator updates the resources(for example CPU and Memory etc.) of the `Redis` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2021.09.09/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2021.09.09/guides/redis/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Enterprise operator updates the resources of the `Redis` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of MongoDB" src="/docs/v2021.09.09/images/day-2-operation/mongodb/mg-vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of MongoDB</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required number of `StatefulSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `Redis` database the user creates a `RedisOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `RedisOpsRequest` CR.

6. When it finds a `RedisOpsRequest` CR, it halts the `Redis` object which is referred from the `RedisOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Redis` object during the vertical scaling process.  

7. Then the `KubeDB` Enterprise operator will update resources of the StatefulSet Pods to reach desired state.

8. After the successful update of the resources of the StatefulSet's replica, the `KubeDB` Enterprise operator updates the `Redis` object to reflect the updated state.

9. After the successful update  of the `Redis` resources, the `KubeDB` Enterprise operator resumes the `Redis` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of Redis database using `RedisOpsRequest` CRD.