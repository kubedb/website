---
title: Redis Horizontal Scaling Overview
menu:
  docs_v2022.12.28:
    identifier: rd-horizontal-scaling-overview
    name: Overview
    parent: rd-horizontal-scaling
    weight: 10
menu_name: docs_v2022.12.28
section_menu_id: guides
info:
  autoscaler: v0.15.0
  cli: v0.30.0
  dashboard: v0.6.0
  installer: v2022.12.28
  ops-manager: v0.17.0
  provisioner: v0.30.0
  schema-manager: v0.6.0
  ui-server: v0.6.0
  version: v2022.12.28
  webhook-server: v0.6.0
---

> New to KubeDB? Please start [here](/docs/v2022.12.28/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.12.28/setup/install/enterprise) to try this feature." >}}

# Redis Horizontal Scaling

This guide will give an overview on how KubeDB Enterprise operator scales up or down of `Redis` cluster database for both the number of replicas and masters.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2022.12.28/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2022.12.28/guides/redis/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Enterprise operator scales up or down `Redis` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of MongoDB" src="/docs/v2022.12.28/images/day-2-operation/mongodb/mg-horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of MongoDB</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `Redis` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Redis` CR.

3. When the operator finds a `Redis` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, appbindings, etc.

4. Then, in order to scale the number of replica or master for the `Redis` cluster database the user creates a `RedisOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `RedisOpsRequest` CR.

6. When it finds a `RedisOpsRequest` CR, it patches the `Redis` object which is referred from the `RedisOpsRequest`. After that, the `KubeDB` Community operator tries to reconcile the state of the `Redis` object during the horizontal scaling process.  

7. `KubeDB` Enterprise operator will watch the `Redis` object, continuously checking if the `Redis` cluster has been configured as described in the `RedisOpsRequest`.

8. After the `Redis` cluster is configured as desired, `KubeDB Enterprise` operator will declare the OpsRequest as successful.

In the next docs, we are going to show a step by step guide on horizontal scaling of Redis database using `RedisOpsRequest` CRD.