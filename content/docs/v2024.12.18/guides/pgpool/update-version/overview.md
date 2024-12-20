---
title: Updating Pgpool Overview
menu:
  docs_v2024.12.18:
    identifier: pp-updating-overview
    name: Overview
    parent: pp-updating
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

# updating Pgpool version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `Pgpool`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Pgpool](/docs/v2024.12.18/guides/pgpool/concepts/pgpool)
  - [PgpoolOpsRequest](/docs/v2024.12.18/guides/pgpool/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `Pgpool`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of Pgpool" src="/docs/v2024.12.18/images/day-2-operation/pgpool/pp-updating.png">
<figcaption align="center">Fig: updating Process of Pgpool</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Pgpool` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Pgpool` CR.

3. When the operator finds a `Pgpool` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `Pgpool` the user creates a `PgpoolOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `PgpoolOpsRequest` CR.

6. When it finds a `PgpoolOpsRequest` CR, it halts the `Pgpool` object which is referred from the `PgpoolOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Pgpool` object during the updating process.  

7. By looking at the target version from `PgpoolOpsRequest` CR, `KubeDB` Ops-manager operator updates the image of the `PetSet`.

8. After successfully updating the `PetSet` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `Pgpool` object to reflect the updated state of the database.

9. After successfully updating of `Pgpool` object, the `KubeDB` Ops-manager operator resumes the `Pgpool` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a Pgpool using updateVersion operation.