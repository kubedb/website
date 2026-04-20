---
title: Rotate Authentication Overview
menu:
  docs_v2026.1.19:
    identifier: cas-rotate-auth-overview
    name: Overview
    parent: cas-rotate-auth
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

# Rotate Authentication of Cassandra

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Cassandra](/docs/v2026.1.19/guides/cassandra/concepts/cassandra)
    - [CassandraOpsRequest](/docs/v2026.1.19/guides/cassandra/concepts/cassandraopsrequest)

## How Rotate Cassandra Authentication Configuration Process Works

The Rotate Cassandra Authentication process consists of the following steps:

1. At first, a user creates a `Cassandra` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Cassandra` CRO.

3. When the operator finds a `Cassandra` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to rotate the authentication configuration of the `Cassandra`, the user creates a `CassandraOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `CassandraOpsRequest` CR.

6. When it finds a `CassandraOpsRequest` CR, it pauses the `Cassandra` object which is referred from the `CassandraOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Cassandra` object during the rotating Authentication process.

7. Then the `KubeDB` Ops-manager operator will update necessary configuration based on the Ops Request yaml to update credentials.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new authentication `ENVs` or other configuration defined in the `CassandraOpsRequest` CR.

9. After the successful rotating of the `Cassandra` Authentication, the `KubeDB` Ops-manager operator resumes the `Cassandra` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on rotating Authentication configuration of a Cassandra using `CassandraOpsRequest` CRD.
