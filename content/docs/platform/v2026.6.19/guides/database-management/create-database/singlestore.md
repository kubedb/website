---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-singlestore
    name: SingleStore
    parent: database-management-create
    weight: 280
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Creating a SingleStore Database

This page covers the configuration specific to **SingleStore** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node SingleStore instance.
- **Topology** — A distributed cluster split into **Aggregator** and **Leaf** node tiers.

![Topology mode selected showing Aggregator and Leaf node panels](../../images/db-create/singlestore/topology-mode.png)

**Aggregator** — Routes queries and aggregates results.

| Field | Description |
|---|---|
| **Number of Replicas** | Number of aggregator nodes. Required. |
| **Storage size**, **Machine**, **CPU**, **Memory** | Resources per aggregator node. |

**Leaf** — Stores and processes the partitioned data.

| Field | Description |
|---|---|
| **Number of Replicas** | Number of leaf nodes. Required. |
| **Storage size**, **Machine**, **CPU**, **Memory** | Resources per leaf node. |

## License

SingleStore is commercial software and requires a license.

| Field | Description |
|---|---|
| **License Secret** | Name of the Kubernetes Secret containing your SingleStore license key. Required. |

## Create a SingleStore Database

1. Open the wizard and select **SingleStore** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
