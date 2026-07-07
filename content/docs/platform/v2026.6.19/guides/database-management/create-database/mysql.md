---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-mysql
    name: MySQL
    parent: database-management-create
    weight: 160
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Creating a MySQL Database

This page covers the configuration specific to **MySQL** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**. Available modes:

- **Standalone** — A single-node MySQL instance.
- **GroupReplication** — A MySQL Group Replication cluster. Choose a group **Mode**: `Single-Primary` or `Multi-Primary`.
- **InnoDBCluster** — A MySQL InnoDB Cluster fronted by MySQL Router. Choose `Single-Primary` or `Multi-Primary`.
- **SemiSync** — A semi-synchronous replication topology with configurable acknowledgement.
- **RemoteReplica** — A replica that streams from an external/primary MySQL.

![Mode options showing GroupReplication, InnoDBCluster, SemiSync, and RemoteReplica](../../images/db-create/mysql/mode-select.png)

| Field | Description |
|---|---|
| **Number of Replicas** | Number of nodes in the cluster (e.g., `3`). Required for clustered modes. |
| **Mode** (Group/InnoDB) | `Single-Primary` or `Multi-Primary`. |
| **SemiSync** | `Source Wait For Replica Count`, `Source Timeout`, and `Errant Transaction Recovery Policy` (`Clone` or `PseudoTransaction`). |
| **Router** (InnoDB) | MySQL Router instance count and resources. |

## Create a MySQL Database

1. Open the wizard and select **MySQL** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
