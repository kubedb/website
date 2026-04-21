---
title: Kafka Migration Overview
description: Kafka Migration Overview
menu:
  docs_v2024.11.8-rc.0:
    identifier: kf-migration-overview
    name: Overview
    parent: kf-migration-kafka
    weight: 5
menu_name: docs_v2024.11.8-rc.0
section_menu_id: guides
info:
  autoscaler: v0.34.0-rc.0
  cli: v0.49.0-rc.0
  dashboard: v0.25.0-rc.0
  installer: v2024.11.8-rc.0
  ops-manager: v0.36.0-rc.0
  provisioner: v0.49.0-rc.0
  schema-manager: v0.25.0-rc.0
  ui-server: v0.25.0-rc.0
  version: v2024.11.8-rc.0
  webhook-server: v0.25.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2024.11.8-rc.0/guides/).

# Kafka Migration

This guide will help you to migrate your existing Kafka cluster to KubeDB or within KubeDB Kafka cluster.

## Before You Begin

- You should have familiar with the following `KubeDB` concepts:
    - [KubeDB Kafka](/docs/v2024.11.8-rc.0/guides/kafka/concepts/kafka)
    - [ConnectCluster](/docs/v2024.11.8-rc.0/guides/kafka/concepts/connectcluster)
    - [Connector](/docs/v2024.11.8-rc.0/guides/kafka/concepts/connector)

Migration of Kafka cluster with minimal downtime is a challenging task. Proper planning and execution are required to ensure a smooth migration. The following things should be considered before starting the migration:

1. Evaluate the existing Kafka cluster and its dependencies.

2. Evaluate the existing Kafka cluster's data volume and its growth rate.

3. Validate network connectivity between the existing Kafka cluster and the new Kafka cluster.

4. Validate the compatibility of the existing Kafka cluster with the new Kafka cluster. Try upgrading the existing Kafka cluster to the recent version before starting the migration.

5. List down the Kafka topics and consumer groups that need to be migrated.

## Migration Scenarios

The following are the possible scenarios for Kafka migration:

1. User has an existing Kafka cluster and wants to migrate it to KubeDB Kafka cluster.

2. User creates a KubeDB Kafka cluster using `Kafka` Custom Resource(CR).

3. Setup security, monitoring, and users/ACLs in the new Kafka cluster.

4. Create `ConnectCluster` with reference to the new Kafka cluster.

5. Create `mirror-source`, `checkpoint` and `hearbeat` connectors to replicate data from the existing Kafka cluster to the new Kafka cluster.

6. Validate the data replication between the existing Kafka cluster and the new Kafka cluster.

7. Switch the application(produces/consumers) to use the new Kafka cluster.

8. Validate applications are functional with the new Kafka cluster.

9. Test load, security and performance of the new Kafka cluster.

In the next docs, we are going to show a step-by-step guide on how to migrate an existing Kafka cluster to KubeDB Kafka cluster.