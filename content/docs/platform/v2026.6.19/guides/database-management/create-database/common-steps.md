---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-create-common
    name: Common Steps
    parent: database-management-create
    weight: 5
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Common Steps for Creating a Database

These steps are the same for every database engine. Each engine's own page covers only
the engine-specific **Database Mode**; everything else — opening the wizard, naming,
versions, resources, and optional features — is described here.

> Start on your engine's page (e.g. [PostgreSQL](../postgres.md), [Redis](../redis.md)) for the
> Database Mode, and refer back to this page for the surrounding steps.

---

## 1. Getting Started

Navigate to the **Datastore** section in the left sidebar. The **Datastore Overview** page lists all existing database instances across your connected engines.

To create a new database, click the green **+ Create New Instance** button in the top-right corner of the page.

![Datastore Overview page showing existing database instances and the Create New Instance button](../../images/db-create/shared/overview-create.png)

---

## 2. Select a Database Type

You will be presented with a grid of all supported database engines. Click the engine you want to provision.

![Database type selection grid showing all supported engines](../../images/db-create/shared/db-type-select.png)

> **Tip:** Supported engines include relational, document, key-value, search, vector, and time-series databases.

---

## 3. Choose Namespace and Name

After selecting the database type, choose a namespace and provide a name for the new instance.

![Choose Namespace and Name step showing Select Namespace dropdown and Name field](../../images/db-create/shared/name-namespace-select.png)

1. **Select Namespace:** The Kubernetes namespace where the database will be deployed. If the namespace has resource quotas, available CPU and memory are shown.
1. **Name:** A unique name that starts with a lowercase letter and contains only letters, numbers, or dashes.

Click **Next** to proceed to the configuration step.

> **Note:** Both fields are required. The name cannot be changed after creation.

---

## 4. Configure the Database

The configuration page shows all settings for the new database, with the chosen namespace and name displayed as a breadcrumb (e.g., `demo / mongo-test`).

### 4.1 - Database Version

Select the engine version from the **Database Version** dropdown. The version determines engine features, compatibility, and runtime behaviour.

### 4.2 - Database Mode

The available topologies depend on the engine. See your engine's page for its **Database Mode** options and fields — for example [MongoDB](../mongodb.md) (Standalone / Replicaset / Sharded) or [PostgreSQL](../postgres.md) (Standalone / Cluster / RemoteReplica).

### 4.3 - Machine Profile

The **Machine Profile** dropdown selects a preset CPU and memory configuration for your database nodes. Choose `custom` to enter CPU and memory values manually.

![Machine Profile dropdown alongside the Storage Class and Advanced Configuration panels](../../images/db-create/shared/machine-profile.png)

> **Tip:** Preset profiles are named by size (e.g., `db.t4large`). Use `custom` when your workload requires resources that do not match any preset.

### 4.4 - Storage Class and Size

Select the Kubernetes **Storage Class** that backs the persistent volumes and enter the required **Storage size**.

![Storage Class dropdown and Storage size field](../../images/db-create/shared/storage-class.png)

| Field | Description |
|---|---|
| **Storage Class** | The Kubernetes StorageClass for persistent volumes (e.g., `longhorn`). Required. |
| **Storage size** | The disk capacity per node (e.g., `2Gi`). Required. |

---

## 5. Advanced Configuration

Expand the **Advanced Configuration** panel (*Configure Credentials, Deployment Mode etc.*) for additional settings.

### 5.1 - Labels & Annotations

Add custom Kubernetes labels and annotations to the database resources.

![Labels and Annotations sections each with Key-Value input rows and Add new buttons](../../images/db-create/shared/advance-lavel-annotation.png)

- Use **+ Add new** under **Labels** / **Annotations** to attach key-value pairs.
- Use the delete icon on any row to remove it.

### 5.2 - Deletion Policy

The **Deletion Policy** dropdown controls what happens to the resources when the database object is deleted.

![Deletion Policy dropdown showing Delete, Halt, WipeOut, and DoNotTerminate options](../../images/db-create/shared/deletion-policy.png)

| Option | Behaviour |
|---|---|
| **Delete** | Deletes pods and services but retains the PersistentVolumeClaims. |
| **Halt** | Stops the database without deleting resources. Can be resumed later. |
| **WipeOut** | Deletes all resources including PersistentVolumeClaims. All data is permanently removed. |
| **DoNotTerminate** | Prevents deletion until the policy is changed. |

> **Warning:** **WipeOut** permanently destroys all data. Ensure you have a valid backup before selecting this policy.

### 5.3 - Authentication Credentials

Configure how the database credentials are managed.

![Authentication Credentials section showing credential toggles, Secret dropdown, Password field, and Configuration textarea](../../images/db-create/shared/auth-creds.png)

| Field | Description |
|---|---|
| **Provide Authentication Credentials** | Toggle on to supply custom credentials instead of auto-generating them. |
| **Refer existing Secret** | Toggle on to reference an existing Kubernetes Secret. Select it from the dropdown. |
| **Password** | Manually enter a password if not using an existing Secret. |
| **Configure Database** | Toggle on to provide a custom database configuration in the **Configuration** textarea. |

### 5.4 - Point in-time Recovery

For engines that support continuous archiving (e.g. **PostgreSQL**, **MySQL**), enable **Point in-time Recovery** to restore the new database from a previous backup to an exact timestamp.

![Point in-time Recovery form showing Namespace, Name, and Recovery Timestamp fields](../../images/db-create/shared/point-in-time-recovery.png)

1. **Namespace:** The namespace where the source backup resides. Required.
1. **Name:** The name of the source database to recover from. Required.
1. **Recovery Timestamp:** The exact date and time to restore to (`mm/dd/yyyy, hh:mm`). Required.

> **Note:** All three fields are required when Point in-time Recovery is enabled.

---

## 6. Additional Options

Expand the **Additional Options** panel (*Enable Backup, Monitoring, TLS etc.*) to enable integrated platform features.

![Additional Options panel showing Monitoring, Backup, TLS, and Gateway toggles](../../images/db-create/shared/Additional-option.png)

| Option | Description |
|---|---|
| **Enable Monitoring** | Enables Prometheus metrics collection. Select an **Alert Options** level (`critical`, `warning`, `info`). |
| **Enable Backup** | Registers the database with the backup system so scheduled backups can be configured after creation. |
| **Enable TLS** | Enables TLS encryption. Select a **Cluster Issuer** from the dropdown (e.g., `ace-incluster`). |
| **Expose via Gateway** | Toggles external access through the configured gateway endpoint. |

---

## 7. Deploy

Once all required fields are filled and options are configured, click the green **Deploy** button at the bottom-right of the form to create the database.

> **Note:** Required fields are marked with a red asterisk. The **Deploy** button is active only when all required fields are valid. If any field has an error, a validation summary will appear above the button.

---

## Quick Reference

| Action | Where / How |
|---|---|
| Start creating a database | **Datastore Overview** → **+ Create New Instance** |
| Select database engine | Click the desired engine from the type grid |
| Set namespace and name | **Choose Namespace and Name** → fill both → **Next** |
| Choose topology | **Database Mode** → see your engine's page |
| Set CPU and memory | **Machine Profile** → select preset or `custom` |
| Set storage | **Storage Class** → select class → set **Storage size** |
| Add labels or annotations | **Advanced Configuration** → **Labels & Annotations** → **+ Add new** |
| Control deletion behaviour | **Advanced Configuration** → **Deletion Policy** |
| Provide custom credentials | **Advanced Configuration** → toggle **Provide Authentication Credentials** |
| Restore to a point in time | **Advanced Configuration** → toggle **Point in-time Recovery** |
| Enable monitoring | **Additional Options** → **Enable Monitoring** → set Alert Options |
| Enable backup at creation | **Additional Options** → **Enable Backup** |
| Enable TLS at creation | **Additional Options** → **Enable TLS** → select Cluster Issuer |
| Expose via gateway | **Additional Options** → **Expose via Gateway** |
| Apply and create | Click **Deploy** |
