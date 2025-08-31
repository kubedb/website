---
title: Reconfiguring Cassandra
menu:
  docs_v2025.8.31:
    identifier: cas-reconfigure-overview
    name: Overview
    parent: cas-reconfigure
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

# Reconfiguring Cassandra

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `Cassandra` components such as Combined, Broker, Controller, etc.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Cassandra](/docs/v2025.8.31/guides/cassandra/concepts/cassandra)
    - [CassandraOpsRequest](/docs/v2025.8.31/guides/cassandra/concepts/cassandraopsrequest)

## How Reconfiguring Cassandra Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `Cassandra` components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of Cassandra" src="/docs/v2025.8.31/images/day-2-operation/cassandra/reconfigure.svg">
<figcaption align="center">Fig: Reconfiguring process of Cassandra</figcaption>
</figure>

The Reconfiguring Cassandra process consists of the following steps:

1. At first, a user creates a `Cassandra` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Cassandra` CR.

3. When the operator finds a `Cassandra` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the various components (ie. Combined, Broker) of the `Cassandra`, the user creates a `CassandraOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `CassandraOpsRequest` CR.

6. When it finds a `CassandraOpsRequest` CR, it halts the `Cassandra` object which is referred from the `CassandraOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Cassandra` object during the reconfiguring process.

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MogoDBOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `CassandraOpsRequest` CR.

9. After the successful reconfiguring of the `Cassandra` components, the `KubeDB` Ops-manager operator resumes the `Cassandra` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring Cassandra components using `CassandraOpsRequest` CRD.