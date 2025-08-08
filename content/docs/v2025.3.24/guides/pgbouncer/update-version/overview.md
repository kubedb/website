---
title: Updating PgBouncer Overview
menu:
  docs_v2025.3.24:
    identifier: pb-updating-overview
    name: Overview
    parent: pb-updating
    weight: 10
menu_name: docs_v2025.3.24
section_menu_id: guides
info:
  autoscaler: v0.38.0
  cli: v0.53.0
  dashboard: v0.29.0
  installer: v2025.3.24
  ops-manager: v0.40.0
  provisioner: v0.53.0
  schema-manager: v0.29.0
  ui-server: v0.29.0
  version: v2025.3.24
  webhook-server: v0.29.0
---

> New to KubeDB? Please start [here](/docs/v2025.3.24/README).

# updating PgBouncer version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `PgBouncer`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PgBouncer](/docs/v2025.3.24/guides/pgbouncer/concepts/pgbouncer)
  - [PgBouncerOpsRequest](/docs/v2025.3.24/guides/pgbouncer/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `PgBouncer`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of Kafka" src="/docs/v2025.3.24/images/day-2-operation/pgbouncer/update-version.svg">
<figcaption align="center">Fig: updating Process of Kafka</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `PgBouncer` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `PgBouncer` CR.

3. When the operator finds a `PgBouncer` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `PgBouncer` the user creates a `PgBouncerOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `PgBouncerOpsRequest` CR.

6. When it finds a `PgBouncerOpsRequest` CR, it halts the `PgBouncer` object which is referred from the `PgBouncerOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `PgBouncer` object during the updating process.  

7. By looking at the target version from `PgBouncerOpsRequest` CR, `KubeDB` Ops-manager operator updates the image of the `PetSet`.

8. After successfully updating the `PetSet` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `PgBouncer` object to reflect the updated state of the database.

9. After successfully updating of `PgBouncer` object, the `KubeDB` Ops-manager operator resumes the `PgBouncer` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a PgBouncer using updateVersion operation.