---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-create-druid
    name: Druid
    parent: database-management-create
    weight: 50
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Creating a Druid Database

This page covers the configuration specific to **Druid** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Druid is always deployed as a **Topology** of role-separated process tiers. Configure each tier's node count and resources independently.

![Druid topology showing Overlords/MiddleManagers and Historicals panels](../../images/db-create/druid/topology-mode-1.png)

![Druid topology showing Coordinators and Brokers panels](../../images/db-create/druid/topology-mode-2.png)

| Node | Description |
|---|---|
| **Coordinators** | Manage data availability, segment balancing, and cluster coordination. |
| **MiddleManagers** | Run ingestion tasks and index new data. |
| **Historicals** | Store and serve queryable historical segments. |
| **Brokers** | Receive queries and route them to the appropriate Historicals/MiddleManagers. |

Each tier has its own **Number of Replicas**, **Storage size**, **Machine**, **CPU**, and **Memory** fields. Druid also requires dependent metadata storage and deep storage, configured by the platform.

## Druid Dependencies

Druid relies on external dependencies for metadata, deep storage, and coordination. Each can be provisioned by the platform or pointed at an existing, externally-managed instance.

**Deep Storage** — Durable storage for Druid segments.

| Field | Description |
|---|---|
| **Type** | Deep storage backend: `s3`, `google`, `azure`, or `hdfs`. |
| **Config Secret** | Secret holding the credentials/configuration for the chosen backend. |

**Metadata Storage** — Relational database holding Druid metadata.

| Field | Description |
|---|---|
| **Type** | `MySQL` or `Postgres`. |
| **Externally Managed** | Toggle on to reference an existing database instead of provisioning one. |
| **Namespace / Name** | Reference to the metadata database when externally managed. |

**ZooKeeper** — Coordination service for the Druid cluster.

| Field | Description |
|---|---|
| **Externally Managed** | Toggle on to reference an existing ZooKeeper instead of provisioning one. |
| **Namespace / Name** | Reference to the ZooKeeper instance when externally managed. |

## Create a Druid Database

1. Open the wizard and select **Druid** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
