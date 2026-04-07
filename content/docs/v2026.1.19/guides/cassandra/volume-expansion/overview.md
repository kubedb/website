---
title: Cassandra Volume Expansion Overview
menu:
  docs_v2026.1.19:
    identifier: cas-volume-expansion-overview
    name: Overview
    parent: cas-volume-expansion
    weight: 10
menu_name: docs_v2026.1.19
section_menu_id: guides
info:
  autoscaler: v0.45.0
  cli: v0.60.0
  dashboard: v0.36.0
  installer: v2026.1.19
  ops-manager: v0.47.0
  provisioner: v0.60.0
  schema-manager: v0.36.0
  ui-server: v0.36.0
  version: v2026.1.19
  webhook-server: v0.36.0
---

> New to KubeDB? Please start [here](/docs/v2026.1.19/README).

# Cassandra Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of various component of `Cassandra`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Cassandra](/docs/v2026.1.19/guides/cassandra/concepts/cassandra)
    - [CassandraOpsRequest](/docs/v2026.1.19/guides/cassandra/concepts/cassandraopsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `Cassandra` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of Cassandra" src="/docs/v2026.1.19/images/day-2-operation/cassandra/volumeExpansion.svg">
<figcaption align="center">Fig: Volume Expansion process of Cassandra</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `Cassandra` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Cassandra` CR.

3. When the operator finds a `Cassandra` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (ie. Combined, Broker, Controller) of the `Cassandra`, the user creates a `CassandraOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `CassandraOpsRequest` CR.

7. When it finds a `CassandraOpsRequest` CR, it halts the `Cassandra` object which is referred from the `CassandraOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Cassandra` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `CassandraOpsRequest` CR.

9. After the successful Volume Expansion of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the new volume size in the `Cassandra` object to reflect the updated state.

10. After the successful Volume Expansion of the `Cassandra` components, the `KubeDB` Ops-manager operator resumes the `Cassandra` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various Cassandra database components using `CassandraOpsRequest` CRD.
