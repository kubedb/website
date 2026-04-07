---
title: Reconfiguring Postgres
menu:
  docs_v2024.12.18:
    identifier: pg-reconfigure-overview
    name: Overview
    parent: pg-reconfigure
    weight: 10
menu_name: docs_v2024.12.18
section_menu_id: guides
info:
  autoscaler: v0.35.0
  cli: v0.50.0
  dashboard: v0.26.0
  installer: v2024.12.18
  ops-manager: v0.37.0
  provisioner: v0.50.0
  schema-manager: v0.26.0
  ui-server: v0.26.0
  version: v2024.12.18
  webhook-server: v0.26.0
---

> New to KubeDB? Please start [here](/docs/v2024.12.18/README).

# Reconfiguring Postgres

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `Postgres` database components.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Postgres](/docs/v2024.12.18/guides/postgres/concepts/postgres)
  - [PostgresOpsRequest](/docs/v2024.12.18/guides/postgres/concepts/opsrequest)

## How Reconfiguring Postgres Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `Postgres` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of Postgres" src="/docs/v2024.12.18/images/day-2-operation/postgres/pg-reconfigure.svg">
<figcaption align="center">Fig: Reconfiguring process of Postgres</figcaption>
</figure>

The Reconfiguring Postgres process consists of the following steps:

1. At first, a user creates a `Postgres` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Postgres` CR.

3. When the operator finds a `Postgres` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `Postgres` database the user creates a `PostgresOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `PostgresOpsRequest` CR.

6. When it finds a `PostgresOpsRequest` CR, it halts the `Postgres` object which is referred from the `PostgresOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Postgres` object during the reconfiguring process.  

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `PostgresOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `PostgresOpsRequest` CR.

9. After the successful reconfiguring of the `Postgres` database, the `KubeDB` Ops-manager operator resumes the `Postgres` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring Postgres database components using `PostgresOpsRequest` CRD.