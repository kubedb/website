---
title: MySQL Horizontal Scaling Overview
menu:
  docs_v2024.6.4:
    identifier: guides-mysql-scaling-horizontal-overview
    name: Overview
    parent: guides-mysql-scaling-horizontal
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Horizontal Scaling Overview

This guide will give you an overview of how `KubeDB` Ops Manager scales up/down the number of members of a `MySQL` group replication.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2024.6.4/guides/mysql/concepts/database/)
  - [MySQLOpsRequest](/docs/v2024.6.4/guides/mysql/concepts/opsrequest/)

## How Horizontal Scaling Process Works

The following diagram shows how `KubeDB` Ops Manager used to scale up the number of members of a `MySQL` group replication. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2024.6.4/guides/mysql/scaling/horizontal-scaling/overview/images/my-horizontal_scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of MySQL group replication</figcaption>
</figure>

The horizontal scaling process consists of the following steps:

1. At first, a user creates a `MySQL` cr.

2. `KubeDB` community operator watches for the `MySQL` cr.

3. When it finds one, it creates a `StatefulSet` and related necessary stuff like secret, service, etc.

4. Then, in order to scale the cluster, the user creates a `MySQLOpsRequest` cr with the desired number of members after scaling.

5. `KubeDB` Ops Manager watches for `MySQLOpsRequest`.

6. When it finds one, it halts the `MySQL` object so that the `KubeDB` community operator doesn't perform any operation on the `MySQL` during the scaling process.  

7. Then the `KubeDB` Ops Manager will scale the StatefulSet replicas to reach the expected number of members for the group replication.

8. After successful scaling of the StatefulSet's replica, the `KubeDB` Ops Manager updates the `spec.replicas` field of `MySQL` object to reflect the updated cluster state.

9. After successful scaling of the `MySQL` replicas, the `KubeDB` Ops Manager resumes the `MySQL` object so that the `KubeDB` community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on scaling of a MySQL group replication using Horizontal Scaling.