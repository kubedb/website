---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-repository
    name: Backup Repository
    parent: database-management
    weight: 135
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---


# Repository

A **Repository** is the logical backup repository that stores individual snapshots of a database within a BackupStorage backend, acting as the bridge between BackupConfigurations and the cloud storage. This guide explains how to view and create Repository resources using the platform console.

---

## 1. Getting Started

Navigate to **Backups** in the left sidebar and select **Repository**. This opens the Repository list page showing all backup repositories in your cluster.

---

## 2. Repository List

The list page displays all Repository resources configured across your cluster. Use the **Select Namespace** dropdown to filter by namespace, or click **Create New Instance** to add a new repository.

![Repository list page showing resources with Name, Namespace, BackupStorage, Target, Size, Phase, and Age columns](../images/backup/repository-overview.png)

| Column | Description |
|---|---|
| **Name** | The Repository resource name. |
| **Namespace** | The namespace where it is deployed. |
| **BackupStorage** | The BackupStorage backend this repository uses. |
| **Target** | The database this repository backs up. |
| **Size** | Total size of all snapshots in this repository. |
| **Phase** | Current state of the repository (e.g., `Ready`, `Failed`). |
| **Age** | How long ago the Repository was created. |

---

## 3. Viewing a Repository

Click on any Repository name in the list to open its detail page.

### 3.1 - Overview

The detail page displays repository metadata and all snapshots stored within it:

![Repository detail page showing Basic info, Backup Storage, Snapshots, and linked resources](../images/backup/repository-db-overview.png)

**Basic** — Core metadata for the repository:

| Field | Description |
|---|---|
| **Name** | The Repository resource name. |
| **Namespace** | The namespace it belongs to. |
| **Labels** | Key-value labels for organization and filtering. |
| **Annotations** | Key-value annotations including references and management info. |
| **UID** | The unique Kubernetes identifier. |
| **Phase** | Current lifecycle phase (e.g., `Ready`). |
| **Integrity Status** | Whether the repository passed integrity validation (e.g., `OK`). |
| **Last Integrity Check Time** | Timestamp of the most recent integrity verification. |

**Backup Storage** — Reference to the underlying storage backend:

| Column | Description |
|---|---|
| **Name** | The BackupStorage resource name. |
| **Namespace** | Namespace of the BackupStorage. |
| **Provider** | The cloud provider (e.g., `s3`, `azure`). |
| **Size** | Total data stored across all repositories in this backend. |
| **No. of Connected Repositories** | Number of repositories using this storage. |
| **Status** | Storage backend status. |
| **Age** | Age of the BackupStorage resource. |

**Snapshots** — Individual backup snapshots stored in this repository:

![Backup Configuration and Snapshots tables showing all stored snapshots](../images/backup/repository-db-snapshot.png)

**Backup Configuration** — BackupConfigurations using this repository:

| Column | Description |
|---|---|
| **Name** | The BackupConfiguration resource name. |
| **Namespace** | Namespace of the configuration. |
| **Schedule** | The cron expression for backups. |
| **Paused** | Whether backups are currently paused. |
| **Target** | The database being backed up. |
| **Session** | The session name within the configuration. |
| **Status** | Configuration status. |
| **Age** | Age of the BackupConfiguration resource. |

**Snapshots** — All snapshots (backup snapshots) stored in this repository:

| Column | Description |
|---|---|
| **Name** | The Snapshot resource name (e.g., `snapshot-20240115-143022`). |
| **Namespace** | Namespace of the snapshot. |
| **Repository** | The repository containing this snapshot. |
| **Invoker Kind** | Type of resource that created the snapshot (e.g., `BackupSession`). |
| **Invoker Name** | Name of the invoker resource. |
| **Backend Repository** | The backend-level repository path. |
| **Creation Timestamp** | When the snapshot was created. |
| **Deletion Policy** | What happens when the snapshot is deleted. |
| **Phase** | Status of the snapshot (e.g., `Ready`, `Failed`). |
| **Verification Status** | Whether the snapshot data is valid (e.g., `OK`). |
| **Age** | Age of the Snapshot resource. |

---

## 4. Creating a Repository

To create a new Repository, click **Create New Instance** from the Repository list page. The **Create Repository** form will open.

### 4.1 - Basic Information

The form starts with identity and deletion policy fields:

![Create Repository form showing Namespace, Repository Name, Labels & Annotations, Deletion Policy, Storage Ref, Encryption Secret, Path, and App Ref sections](../images/backup/repository-create-overview.png)

| Field | Description |
|---|---|
| **Namespace** | The Kubernetes namespace where the Repository will be created. Required. |
| **Repository Name** | A unique name for this Repository (e.g., `mongodb-backups`). Required. |
| **Deletion Policy** | Controls what happens when the Repository is deleted. Default: `Delete`. Required. |

### 4.2 - Labels & Annotations

Expand the **Labels & Annotations** section to attach custom metadata:

![Labels and Annotations panel showing Labels and Annotations each with Key-Value input rows and Add new buttons](../images/backup/repository-label-annotation.png)

- Use **+ Add new** under **Labels** to add key-value label pairs.
- Use **+ Add new** under **Annotations** to add key-value annotation pairs.
- Use the delete icon on any row to remove an entry.

### 4.3 - Storage and Encryption Configuration

The **Storage Ref**, **Encryption Secret**, and **Path** sections configure where and how snapshots are stored.

![Storage Ref and Encryption Secret sections showing Namespace/Name fields and Path field](../images/backup/repository-ref-secret.png)

**Storage Ref** — Reference to the BackupStorage backend:

| Field | Description |
|---|---|
| **Namespace** | The namespace of the BackupStorage resource. Required. |
| **Name** | The name of the BackupStorage resource. Required. |

**Encryption Secret** — Optional Kubernetes Secret containing encryption keys:

| Field | Description |
|---|---|
| **Namespace** | The namespace of the encryption Secret. Optional. |
| **Name** | The name of the Kubernetes Secret holding encryption keys. Optional. |

**Path** — The path prefix within the BackupStorage backend:

| Field | Description |
|---|---|
| **Path** | The directory path where snapshots are stored (e.g., `mongodb/demo-db`). Required. |

### 4.4 - App Reference

The **App Ref** section identifies the database resource this repository backs up.

![App Ref section showing Api Group, Kind, Namespace, and Name dropdowns](../images/backup/repository-app-ref.png)

| Field | Description |
|---|---|
| **Api Group** | The API group of the target resource (e.g., `kubedb.com`). Required. |
| **Kind** | The resource kind of the target database (e.g., `MongoDB`). Required. |
| **Namespace** | The namespace where the target database resides. Required. |
| **Name** | The name of the target database instance. Required. |

---

## 5. Preview and Submit

Once all required fields are filled, click **Preview** to review the generated `Repository` manifest before applying it.

- The manifest is shown in **YAML** view by default. Use the **JSON** button to switch to JSON format if preferred.
- Use the **Copy** button to copy the manifest to your clipboard.
- Click **Previous** to go back and adjust your settings if needed.

> **Tip:** You can directly edit the YAML or JSON on the Preview page before submitting. This is useful for making precise adjustments beyond what the form fields expose.

1. **Submit:** Once satisfied, click **Submit** to create the Repository in your cluster.

> **Note:** After submitting, the Repository will be created and validated. Once `Phase` shows `Ready`, BackupConfigurations can reference it for storing snapshots.

---

## Quick Reference

| Action | How to do it |
|---|---|
| View all Repositories | **Backups** → **Repository** |
| Filter by namespace | Use the **Select Namespace** dropdown on the list page |
| View repository detail | Click on the Repository name in the list |
| Check snapshots stored | Detail page → **Snapshots** table |
| Check linked configurations | Detail page → **Backup Configuration** table |
| Check repository status | Detail page → **Basic** section → **Phase** field |
| Check integrity status | Detail page → **Basic** section → **Integrity Status** field |
| Open the create form | List page → **Create New Instance** |
| Add labels or annotations | **Labels & Annotations** → **+ Add new** → enter Key and Value |
| Reference a BackupStorage | **Storage Ref** → set Namespace and Name |
| Set encryption for backups | **Encryption Secret** → optionally set Namespace and Name |
| Set storage path | **Path** field → enter directory path for snapshots |
| Set the database target | **App Ref** → fill Api Group, Kind, Namespace, and Name |
| Review before creating | Click **Preview** |
| Edit manifest directly | Use the **YAML** / **JSON** toggle on the Preview page |
| Create the repository | Click **Submit** on the Preview page |
