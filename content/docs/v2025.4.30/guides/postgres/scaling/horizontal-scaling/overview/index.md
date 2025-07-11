---
title: Postgres Horizontal Scaling Overview
menu:
  docs_v2025.4.30:
    identifier: guides-postgres-scaling-horizontal-overview
    name: Overview
    parent: guides-postgres-scaling-horizontal
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Horizontal Scaling Overview

This guide will give you an overview of how `KubeDB` Ops Manager scales up/down the number of members of a `Postgres` instance.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Postgres](/docs/v2025.4.30/guides/postgres/concepts/postgres)
  - [PostgresOpsRequest](/docs/v2025.4.30/guides/postgres/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how `KubeDB` Ops Manager used to scale up the number of members of a `Postgres` cluster. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling Flow" src="/docs/v2025.4.30/guides/postgres/scaling/horizontal-scaling/overview/images/pg-horizontal-scaling.png">
<figcaption align="center">Fig: Horizontal scaling process of Postgres</figcaption>
</figure>

The horizontal scaling process consists of the following steps:

1. At first, a user creates a `Postgres` cr.

2. `KubeDB` community operator watches for the `Postgres` cr.

3. When it finds one, it creates a `PetSet` and related necessary stuff like secret, service, etc.

4. Then, in order to scale the cluster, the user creates a `PostgresOpsRequest` cr with the desired number of members after scaling.

5. `KubeDB` Ops Manager watches for `PostgresOpsRequest`.

6. When it finds one, it halts the `Postgres` object so that the `KubeDB` community operator doesn't perform any operation on the `Postgres` during the scaling process.  

7. Then `KubeDB` Ops Manager will add nodes in case of scale up or remove nodes in case of scale down.

8. Then the `KubeDB` Ops Manager will scale the PetSet replicas to reach the expected number of replicas for the cluster.

9.  After successful scaling of the PetSet's replica, the `KubeDB` Ops Manager updates the `spec.replicas` field of `Postgres` object to reflect the updated cluster state.

10. After successful scaling of the `Postgres` replicas, the `KubeDB` Ops Manager resumes the `Postgres` object so that the `KubeDB` community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on scaling of a Postgres cluster using Horizontal Scaling.