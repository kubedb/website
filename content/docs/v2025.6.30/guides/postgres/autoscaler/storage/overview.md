---
title: Postgres Storage Autoscaling Overview
menu:
  docs_v2025.6.30:
    identifier: pg-storage-auto-scaling-overview
    name: Overview
    parent: pg-storage-auto-scaling
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Postgres Storage Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `postgresautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Postgres](/docs/v2025.6.30/guides/postgres/concepts/postgres)
  - [PostgresOpsRequest](/docs/v2025.6.30/guides/postgres/concepts/opsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `Postgres` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Auto Scaling process of Postgres" src="/docs/v2025.6.30/images/postgres/pg-storage-process.svg">
<figcaption align="center">Fig: Storage Auto Scaling process of Postgres</figcaption>
</figure>


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Postgres` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Postgres` CR.

3. When the operator finds a `Postgres` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration.

5. Then, in order to set up storage autoscaling of the `Postgres` database the user creates a `PostgresAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `PostgresAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
8. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `PostgresOpsRequest` to expand the storage of the database. 
   
9. `KubeDB` Ops-manager operator watches the `PostgresOpsRequest` CRO.

10. Then the `KubeDB` Ops-manager operator will expand the storage of the database component as specified on the `PostgresOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling storage of various Postgres database components using `PostgresAutoscaler` CRD.
