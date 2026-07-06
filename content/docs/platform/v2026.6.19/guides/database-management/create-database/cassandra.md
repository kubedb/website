---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-cassandra
    name: Cassandra
    parent: database-management-create
    weight: 20
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Cassandra Database

This page covers the configuration specific to **Cassandra** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node Cassandra instance for development or testing.
- **Topology** — A multi-node Cassandra cluster, optionally organized into named **Racks** for rack-aware replication.

![Topology mode selected showing Racks configuration](../../images/db-create/cassandra/topology-mode.png)

| Field | Description |
|---|---|
| **Number of Replicas** | Number of Cassandra nodes (e.g., `3`). Required. |
| **Racks** | Optional list of rack names to spread nodes across for fault tolerance. |

## Create a Cassandra Database

1. Open the wizard and select **Cassandra** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
