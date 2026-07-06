---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-clickhouse
    name: ClickHouse
    parent: database-management-create
    weight: 30
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a ClickHouse Database

This page covers the configuration specific to **ClickHouse** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node ClickHouse instance.
- **Topology** — A distributed ClickHouse cluster with sharding/replication, coordinated by ClickHouse Keeper.

![Topology mode selected showing Cluster and ClickHouse Keeper configuration](../../images/db-create/clickhouse/topology-mode.png)

**Cluster**

| Field | Description |
|---|---|
| **Shards** | Number of shard partitions. Required. |
| **Replicas** | Number of replicas per shard. Required. |

**ClickHouse Keeper** — Provides coordination/metadata for the cluster (the ClickHouse-native alternative to ZooKeeper). Configure its node count and resources.

## Create a ClickHouse Database

1. Open the wizard and select **ClickHouse** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
