---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-neo4j
    name: Neo4j
    parent: database-management-create
    weight: 170
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Creating a Neo4j Database

This page covers the configuration specific to **Neo4j** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**. Two modes are available:

- **Standalone** — A single-node instance. Best for development or low-traffic workloads.
- **Replicaset** — A multi-node cluster for high availability. Set the **Number of Replicas** (e.g., `3`).

![Replicaset mode selected showing the Number of Replicas field](../../images/db-create/neo4j/replicaset-mode.png)

| Field | Description |
|---|---|
| **Number of Replicas** | Number of nodes in the cluster (e.g., `3`). Required for Replicaset. |

## Neo4j Settings

| Field | Description |
|---|---|
| **Storage Type** | `Durable` (persistent volumes) or `Ephemeral` (no persistence). |
| **Disable Security** | Run without authentication (development only). |
| **TLS** | Configure TLS per protocol — **Bolt**, **HTTP**, and **Cluster** — each signed by the selected **Issuer**. |

## Create a Neo4j Database

1. Open the wizard and select **Neo4j** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
