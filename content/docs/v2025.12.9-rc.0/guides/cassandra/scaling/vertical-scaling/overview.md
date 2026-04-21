---
title: Cassandra Vertical Scaling Overview
menu:
  docs_v2025.12.9-rc.0:
    identifier: cas-vertical-scaling-overview
    name: Overview
    parent: cas-vertical-scaling
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

# Cassandra Vertical Scaling

This guide will give an overview on how KubeDB Ops-manager operator updates the resources(for example CPU and Memory etc.) of the `Cassandra`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Cassandra](/docs/v2025.12.9-rc.0/guides/cassandra/concepts/cassandra)
    - [CassandraOpsRequest](/docs/v2025.12.9-rc.0/guides/cassandra/concepts/cassandraopsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator updates the resources of the `Cassandra`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Cassandra" src="/docs/v2025.12.9-rc.0/images/day-2-operation/cassandra/verticalScale.svg">
<figcaption align="center">Fig: Vertical scaling process of Cassandra</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `Cassandra` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Cassandra` CR.

3. When the operator finds a `Cassandra` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `Cassandra` cluster, the user creates a `CassandraOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `CassandraOpsRequest` CR.

6. When it finds a `CassandraOpsRequest` CR, it halts the `Cassandra` object which is referred from the `CassandraOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Cassandra` object during the vertical scaling process.

7. Then the `KubeDB` Ops-manager operator will update resources of the PetSet Pods to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Ops-manager operator updates the `Cassandra` object to reflect the updated state.

9. After the successful update  of the `Cassandra` resources, the `KubeDB` Ops-manager operator resumes the `Cassandra` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of Cassandra database using `CassandraOpsRequest` CRD.