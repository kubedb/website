---
title: ClickHouse Volume Expansion Overview
menu:
  docs_v2025.8.31:
    identifier: ch-volume-expansion-overview
    name: Overview
    parent: ch-volume-expansion
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

# ClickHouse Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of various component of `ClickHouse`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ClickHouse](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouse)
    - [ClickHouseOpsRequest](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouseopsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `ClickHouse` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of ClickHouse" src="/docs/v2025.8.31/images/day-2-operation/clickhouse/volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of ClickHouse</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `ClickHouse` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `ClickHouse` CR.

3. When the operator finds a `ClickHouse` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (ie. Combined, Broker, Controller) of the `ClickHouse`, the user creates a `ClickHouseOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `ClickHouseOpsRequest` CR.

7. When it finds a `ClickHouseOpsRequest` CR, it halts the `ClickHouse` object which is referred from the `ClickHouseOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ClickHouse` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `ClickHouseOpsRequest` CR.

9. After the successful Volume Expansion of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the new volume size in the `ClickHouse` object to reflect the updated state.

10. After the successful Volume Expansion of the `ClickHouse` components, the `KubeDB` Ops-manager operator resumes the `ClickHouse` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various ClickHouse database components using `ClickHouseOpsRequest` CRD.
