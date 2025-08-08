---
title: Postgres Volume Expansion Overview
menu:
  docs_v2024.8.2-rc.2:
    identifier: pg-volume-expansion-overview
    name: Overview
    parent: pg-volume-expansion
    weight: 10
menu_name: docs_v2024.8.2-rc.2
section_menu_id: guides
info:
  autoscaler: v0.32.0-rc.2
  cli: v0.47.0-rc.2
  dashboard: v0.23.0-rc.2
  installer: v2024.8.2-rc.2
  ops-manager: v0.34.0-rc.2
  provisioner: v0.47.0-rc.2
  schema-manager: v0.23.0-rc.2
  ui-server: v0.23.0-rc.2
  version: v2024.8.2-rc.2
  webhook-server: v0.23.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2024.8.2-rc.2/README).

# PostgreSQL Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of `Postgres` components such as Standalone, HA cluster etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Postgres](/docs/v2024.8.2-rc.2/guides/postgres/concepts/postgres)
  - [PostgresOpsRequest](/docs/v2024.8.2-rc.2/guides/postgres/concepts/opsrequest)

## Volume Expansion Working Procedure

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `Postgres` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of Postgres" src="/docs/v2024.8.2-rc.2/guides/postgres/volume-expansion/Overview/images/pg-volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of PostgreSQL </figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `Postgres` Custom Resource (CR).

2. `KubeDB` community operator watches the `Postgres` CR.

3. When the operator finds a `Postgres` CR, it creates a `PetSet` and related necessary stuffs like pods, pvc, secret, service etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the Petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (Standalone, HA cluster etc.) of the `Postgres` database, the user creates a `PostgresOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `PostgresOpsRequest` CR.

7. When it finds a `PostgresOpsRequest` CR, it halts the `Postgres` object which is referred from the `PostgresOpsRequest`. So, the `KubeDB` Provisioner operator doesn't perform any operations on the `Postgres` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `PostgresOpsRequest` CR.

9. After the successful expansion of the volume of the related PetSet Pods the `KubeDB` Ops-manager operator updates the new volume size in the `Postgres` object to reflect the updated state.

10. After the successful Volume Expansion of the `Postgres` components, the `KubeDB` Ops-manager operator resumes the `Postgres` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show you a step-by-step guide on Volume Expansion of various Postgres database components using `PostgresOpsRequest` CRD.
