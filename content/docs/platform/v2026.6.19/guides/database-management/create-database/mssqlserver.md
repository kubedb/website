---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-mssqlserver
    name: Microsoft SQL Server
    parent: database-management-create
    weight: 130
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Microsoft SQL Server Database

This page covers the configuration specific to **Microsoft SQL Server** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node SQL Server instance.
- **Topology** — A high-availability deployment using an **Availability Group**.

![Topology mode selected showing Availability Group configuration](../../images/db-create/mssqlserver/topology-mode.png)

**Availability Group**

| Field | Description |
|---|---|
| **Number of Replicas** | Number of replicas participating in the availability group (e.g., `3`). Required. |

## SQL Server Settings

Microsoft SQL Server requires you to accept the licensing terms and choose a product edition.

![SQL Server license acceptance and PID edition fields](../../images/db-create/mssqlserver/settings.png)

| Field | Description |
|---|---|
| **Accept EULA** | You must accept the SQL Server End-User License Agreement before the database can be deployed. Required. |
| **PID (Edition)** | The SQL Server product edition: `Developer`, `Express`, `Standard`, `Evaluation`, `Enterprise`, `EnterpriseCore`, or `Custom`. |

When **Topology** mode is used, you may also list the **Databases** to include in the Availability Group.

## Create a Microsoft SQL Server Database

1. Open the wizard and select **Microsoft SQL Server** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
