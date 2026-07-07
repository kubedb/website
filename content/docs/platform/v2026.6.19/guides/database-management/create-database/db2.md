---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-db2
    name: IBM Db2
    parent: database-management-create
    weight: 80
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Creating a IBM Db2 Database

This page covers the configuration specific to **IBM Db2** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

IBM Db2 is deployed as a single logical instance. Set the **Number of Replicas** to control how many nodes back the instance for availability.

| Field | Description |
|---|---|
| **Number of Replicas** | Number of nodes for the instance (e.g., `1` for a single node, `3` for high availability). |

## Create a IBM Db2 Database

1. Open the wizard and select **IBM Db2** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
