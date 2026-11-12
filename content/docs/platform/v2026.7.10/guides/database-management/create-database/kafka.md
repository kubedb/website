---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-create-kafka
    name: Kafka
    parent: database-management-create
    weight: 100
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Creating a Kafka Database

This page covers the configuration specific to **Kafka** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Combined** — Nodes act as both controller and broker. Simpler; best for smaller deployments.
- **Topology** — Role-separated **Controller** and **Broker** node tiers (KRaft), each scaled and resourced independently.

![Topology mode selected showing Controller and Broker node panels](../../images/db-create/kafka/topology-mode.png)

| Node | Description |
|---|---|
| **Controller** | Manages cluster metadata and the KRaft quorum. |
| **Broker** | Handles produce/consume traffic and stores partition data. |

Each tier has its own **Number of Replicas**, **Storage size**, **Machine**, **CPU**, and **Memory** fields.

## Create a Kafka Database

1. Open the wizard and select **Kafka** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
