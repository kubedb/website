---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-milvus
    name: Milvus
    parent: database-management-create
    weight: 140
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Milvus Database

This page covers the configuration specific to **Milvus** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**:

- **Standalone** — A single-node Milvus instance.
- **Distributed** — A multi-node Milvus deployment with separated components for scale and availability.

![Distributed mode selected showing component configuration](../../images/db-create/milvus/mode-select.png)

| Field | Description |
|---|---|
| **Number of Replicas** | Number of nodes/components in the distributed deployment. Required for Distributed. |

## Milvus Dependencies & Settings

Milvus depends on a metadata store (etcd) and object storage, and exposes a few instance-level toggles.

![Milvus meta storage and object storage configuration](../../images/db-create/milvus/dependencies.png)

**Meta Storage (etcd)**

| Field | Description |
|---|---|
| **Externally Managed** | Toggle on to use an existing etcd instead of provisioning one. |
| **Endpoints** | etcd endpoints to connect to when externally managed. |
| **Size** | Number of etcd nodes when provisioned by the platform. |

**Object Storage**

| Field | Description |
|---|---|
| **Config Secret Name** | Secret holding the object storage (e.g. S3/MinIO) configuration. |

**Other Settings**

| Field | Description |
|---|---|
| **Disable Security** | Run without authentication (development only). |
| **Halted** | Create the instance in a halted (stopped) state. |
| **Configuration Secret / Inline** | Provide engine configuration via a referenced Secret or inline key-value pairs. |

## Create a Milvus Database

1. Open the wizard and select **Milvus** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
