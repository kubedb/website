---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-postgres
    name: PostgreSQL
    parent: database-management-create
    weight: 220
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a PostgreSQL Database

This page covers the configuration specific to **PostgreSQL** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**. Three modes are available:

- **Standalone** — A single-node PostgreSQL instance.
- **Cluster** — A primary with one or more streaming replicas for high availability. Set the **Number of Replicas**.
- **RemoteReplica** — A replica that streams from an external/primary PostgreSQL for cross-cluster replication.

![Cluster mode selected showing Number of Replicas, Standby Mode, and Streaming Mode](../../images/db-create/postgres/mode-select.png)

When **Cluster** is selected, configure replication behaviour:

| Field | Description |
|---|---|
| **Number of Replicas** | Number of standby replicas (e.g., `3`). Required. |
| **Standby Mode** | `Hot` (replicas accept read queries) or `Warm` (replicas stay in standby, no reads). |
| **Streaming Mode** | `Synchronous` (commit waits for replica acknowledgement) or `Asynchronous` (commit does not wait). |

## Create a PostgreSQL Database

1. Open the wizard and select **PostgreSQL** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
