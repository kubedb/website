---
title: Rotate Authentication Overview
menu:
  docs_v2025.8.31:
    identifier: ch-rotate-auth-overview
    name: Overview
    parent: ch-rotate-auth
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

# Rotate Authentication of ClickHouse

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ClickHouse](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouse)
    - [ClickHouseOpsRequest](/docs/v2025.8.31/guides/clickhouse/concepts/clickhouseopsrequest)

## How Rotate ClickHouse Authentication Configuration Process Works

The Rotate ClickHouse Authentication process consists of the following steps:

1. At first, a user creates a `ClickHouse` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `ClickHouse` CRO.

3. When the operator finds a `ClickHouse` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to rotate the authentication configuration of the `ClickHouse`, the user creates a `ClickHouseOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `ClickHouseOpsRequest` CR.

6. When it finds a `ClickHouseOpsRequest` CR, it pauses the `ClickHouse` object which is referred from the `ClickHouseOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ClickHouse` object during the rotating Authentication process.

7. Then the `KubeDB` Ops-manager operator will update necessary configuration based on the Ops Request yaml to update credentials.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new authentication `ENVs` or other configuration defined in the `ClickHouseOpsRequest` CR.

9. After the successful rotating of the `ClickHouse` Authentication, the `KubeDB` Ops-manager operator resumes the `ClickHouse` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on rotating Authentication configuration of a ClickHouse using `ClickHouseOpsRequest` CRD.
