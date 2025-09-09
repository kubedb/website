---
title: Update Version Overview
menu:
  docs_v2025.8.31:
    identifier: ch-update-version-overview
    name: Overview
    parent: ch-update-version
    weight: 10
menu_name: docs_v2025.8.31
section_menu_id: guides
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

# ClickHouse Update Version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `ClickHouse`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ClickHouse](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouse)
    - [ClickHouseOpsRequest](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouseopsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `ClickHouse`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of ClickHouse" src="/docs/v2025.8.31/images/day-2-operation/clickhouse/update-version.png">
<figcaption align="center">Fig: updating Process of ClickHouse</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `ClickHouse` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `ClickHouse` CR.

3. When the operator finds a `ClickHouse` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `ClickHouse` database the user creates a `ClickHouseOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `ClickHouseOpsRequest` CR.

6. When it finds a `ClickHouseOpsRequest` CR, it halts the `ClickHouse` object which is referred from the `ClickHouseOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ClickHouse` object during the updating process.

7. By looking at the target version from `ClickHouseOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `ClickHouse` object to reflect the updated state of the database.

9. After successfully updating of `ClickHouse` object, the `KubeDB` Ops-manager operator resumes the `ClickHouse` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a ClickHouse database using updateVersion operation.