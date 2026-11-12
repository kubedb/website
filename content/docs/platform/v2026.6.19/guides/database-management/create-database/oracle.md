---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-oracle
    name: Oracle
    parent: database-management-create
    weight: 180
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Oracle Database

This page covers the configuration specific to **Oracle** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node Oracle instance.
- **DataGuard** — An Oracle Data Guard configuration with a primary and standby database for disaster recovery.

![DataGuard mode selected showing Protection Mode, Sync Mode, and Standby Type](../../images/db-create/oracle/mode-select.png)

When **DataGuard** is selected:

| Field | Description |
|---|---|
| **Number of Replicas** | Number of database nodes. Required. |
| **Protection Mode** | `MaximumAvailability`, `MaximumPerformance`, or `MaximumProtection`. |
| **Sync Mode** | `SYNC` or `ASYNC` redo transport. |
| **Standby Type** | `PHYSICAL` or `LOGICAL` standby. |
| **Apply Lag Threshold** | Optional threshold for the observer to act on apply lag. |

## Create a Oracle Database

1. Open the wizard and select **Oracle** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
