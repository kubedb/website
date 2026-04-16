---
title: Update Version Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: cas-update-version-overview
    name: Overview
    parent: cas-update-version
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Cassandra Update Version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `Cassandra`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Cassandra](/docs/v2025.12.31-rc.1/guides/cassandra/concepts/cassandra)
    - [CassandraOpsRequest](/docs/v2025.12.31-rc.1/guides/cassandra/concepts/cassandraopsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `Cassandra`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of Cassandra" src="/docs/v2025.12.31-rc.1/images/day-2-operation/cassandra/updateVersion.svg">
<figcaption align="center">Fig: updating Process of Cassandra</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Cassandra` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Cassandra` CR.

3. When the operator finds a `Cassandra` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `Cassandra` database the user creates a `CassandraOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `CassandraOpsRequest` CR.

6. When it finds a `CassandraOpsRequest` CR, it halts the `Cassandra` object which is referred from the `CassandraOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Cassandra` object during the updating process.

7. By looking at the target version from `CassandraOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `Cassandra` object to reflect the updated state of the database.

9. After successfully updating of `Cassandra` object, the `KubeDB` Ops-manager operator resumes the `Cassandra` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a Cassandra database using updateVersion operation.