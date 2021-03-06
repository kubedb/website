---
title: MySQL Horizontal Scaling Overview
menu:
  docs_v2021.03.11:
    identifier: my-horizontal-scaling-overview
    name: Overview
    parent: my-horizontal-scaling
    weight: 10
menu_name: docs_v2021.03.11
section_menu_id: guides
info:
  autoscaler: v0.2.0
  cli: v0.17.0
  community: v0.17.0
  enterprise: v0.4.0
  installer: v0.17.0
  release: v2021.03.11
  version: v2021.03.11
---

> New to KubeDB? Please start [here](/docs/v2021.03.11/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.03.11/setup/install/enterprise) to try this feature." >}}

# Horizontal Scaling Overview

This guide will give you an overview of how KubeDB enterprise operator scales up/down the number of members of a `MySQL` group replication.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2021.03.11/guides/mysql/concepts/mysql)
  - [MySQLOpsRequest](/docs/v2021.03.11/guides/mysql/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB enterprise operator used to scale up the number of members of a `MySQL` group replication. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2021.03.11/images/day-2-operation/mysql/my-horizontal_scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of MySQL group replication</figcaption>
</figure>

The horizontal scaling process consists of the following steps:

1. At first, a user creates a `MySQL` cr.

2. `KubeDB` community operator watches for the `MySQL` cr.

3. When it finds one, it creates a `StatefulSet` and related necessary stuff like secret, service, etc.

4. Then, in order to scale the cluster, the user creates a `MySQLOpsRequest` cr with the desired number of members after scaling.

5. `KubeDB` enterprise operator watches for `MySQLOpsRequest`.

6. When it finds one, it halts the `MySQL` object so that the `KubeDB` community operator doesn't perform any operation on the `MySQL` during the scaling process.  

7. Then the `KubeDB` enterprise operator will scale the StatefulSet replicas to reach the expected number of members for the group replication.

8. After successful scaling of the StatefulSet's replica, the `KubeDB` enterprise operator updates the `spec.replicas` field of `MySQL` object to reflect the updated cluster state.

9. After successful scaling of the `MySQL` replicas, the `KubeDB` enterprise operator resumes the `MySQL` object so that the `KubeDB` community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on scaling of a MySQL group replication using Horizontal Scaling.