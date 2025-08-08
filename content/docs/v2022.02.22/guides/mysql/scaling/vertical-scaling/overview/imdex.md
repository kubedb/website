---
title: MySQL Vertical Scaling Overview
menu:
  docs_v2022.02.22:
    identifier: guides-mysql-scaling-vertical-overview
    name: Overview
    parent: guides-mysql-scaling-vertical
    weight: 10
menu_name: docs_v2022.02.22
section_menu_id: guides
info:
  autoscaler: v0.10.0
  cli: v0.25.0
  community: v0.25.0
  dashboard: v0.1.0
  enterprise: v0.12.0
  installer: v2022.02.22
  schema-manager: v0.1.0
  ui-server: v0.1.0
  version: v2022.02.22
  webhook-server: v0.1.0
---

> New to KubeDB? Please start [here](/docs/v2022.02.22/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.02.22/setup/install/enterprise) to try this feature." >}}

# Vertical Scaling MySQL

This guide will give you an overview of how KubeDB enterprise operator updates the resources(for example Memory and RAM etc.) of the `MySQL` database server.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2022.02.22/guides/mysql/concepts/database/)
  - [MySQLOpsRequest](/docs/v2022.02.22/guides/mysql/concepts/opsrequest/)

## How Vertical Scaling Process Works

The following diagram shows how the KubeDB enterprise operator used to update the resources of the `MySQL` database server. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2022.02.22/guides/mysql/scaling/vertical-scaling/overview/images/my-vertical_scaling.png">
<figcaption align="center">Fig: Vertical scaling process of MySQL</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `MySQL` cr.

2. `KubeDB` community operator watches for the `MySQL` cr.

3. When it finds one, it creates a `StatefulSet` and related necessary stuff like secret, service, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `MySQL` database the user creates a `MySQLOpsRequest` cr.

5. `KubeDB` enterprise operator watches for `MySQLOpsRequest`.

6. When it finds one, it halts the `MySQL` object so that the `KubeDB` community operator doesn't perform any operation on the `MySQL` during the scaling process.  

7. Then the `KubeDB` enterprise operator will update resources of the StatefulSet replicas to reach the desired state.

8. After successful updating of the resources of the StatefulSet's replica, the `KubeDB` enterprise operator updates the `MySQL` object resources to reflect the updated state.

9. After successful updating of the `MySQL` resources, the `KubeDB` enterprise operator resumes the `MySQL` object so that the `KubeDB` community operator resumes its usual operations.

In the next doc, we are going to show a step by step guide on updating resources of MySQL database using vertical scaling operation.