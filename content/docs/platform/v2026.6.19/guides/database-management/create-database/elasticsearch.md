---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-elasticsearch
    name: Elasticsearch
    parent: database-management-create
    weight: 60
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Creating a Elasticsearch Database

This page covers the configuration specific to **Elasticsearch** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Combined** — A single pool of nodes that perform all roles (master, data, ingest). Simpler; best for smaller deployments.
- **Topology** — Role-separated nodes split into **Master**, **Data**, and **Ingest** tiers, each scaled and resourced independently.

![Topology mode selected showing Master, Data, and Ingest node panels](../../images/db-create/elasticsearch/topology-mode.png)

| Node | Description |
|---|---|
| **Master** | Manages cluster state and coordination. |
| **Data** | Stores shards and serves indexing/search traffic. |
| **Ingest** | Pre-processes documents via ingest pipelines before indexing. |

Each tier has its own **Number of Replicas**, **Storage size**, **Machine**, **CPU**, and **Memory** fields. You may also select the security **Auth Plugin** (e.g., `X-Pack`, `OpenSearch`, `OpenDistro`, `SearchGuard`).

## Elasticsearch Settings

![Elasticsearch auth plugin selection](../../images/db-create/elasticsearch/settings.png)

| Field | Description |
|---|---|
| **Auth Plugin** | The security plugin / distribution: `X-Pack`, `OpenSearch`, `OpenDistro`, or `SearchGuard`. Determines the security implementation. |
| **Disable Kernel Defaults** | Skip the default `vm.max_map_count` and related kernel tuning applied via an init container. |

## Create a Elasticsearch Database

1. Open the wizard and select **Elasticsearch** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
