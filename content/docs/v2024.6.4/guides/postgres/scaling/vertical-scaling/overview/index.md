---
title: Postgres Vertical Scaling Overview
menu:
  docs_v2024.6.4:
    identifier: guides-postgres-scaling-vertical-overview
    name: Overview
    parent: guides-postgres-scaling-vertical
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

# Vertical Scaling Postgres

This guide will give you an overview of how KubeDB Ops Manager updates the resources(for example Memory, CPU etc.) of the `Postgres` database server.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Postgres](/docs/v2024.6.4/guides/postgres/concepts/postgres)
  - [PostgresOpsRequest](/docs/v2024.6.4/guides/postgres/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how the `KubeDB` Ops Manager used to update the resources of the `Postgres` database server. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling Flow" src="/docs/v2024.6.4/guides/postgres/scaling/vertical-scaling/overview/images/pg-vertical-scaling.png">
<figcaption align="center">Fig: Vertical scaling process of Postgres</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `Postgres` cr.

2. `KubeDB` community operator watches for the `Postgres` cr.

3. When it finds one, it creates a `StatefulSet` and related necessary stuff like secret, service, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `Postgres` database the user creates a `PostgresOpsRequest` cr.

5. `KubeDB` Ops Manager watches for `PostgresOpsRequest`.

6. When it finds one, it halts the `Postgres` object so that the `KubeDB` Provisioner operator doesn't perform any operation on the `Postgres` during the scaling process.

7. Then the `KubeDB` Ops Manager operator will update resources of the StatefulSet replicas to reach the desired state.

8. After successful updating of the resources of the StatefulSet's replica, the `KubeDB` Ops Manager updates the `Postgres` object resources to reflect the updated state.

9. After successful updating of the `Postgres` resources, the `KubeDB` Ops Manager resumes the `Postgres` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next doc, we are going to show a step by step guide on updating resources of Postgres database using vertical scaling operation.
