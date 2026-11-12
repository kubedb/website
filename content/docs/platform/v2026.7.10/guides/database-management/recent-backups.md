---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-recent-backups
    name: Recent Backups
    parent: database-management
    weight: 125
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Recent Backups

A **BackupSession** is a single backup job execution — triggered by a BackupConfiguration or created manually on-demand — that produces a point-in-time snapshot of your database. This guide explains how to view and manage BackupSessions.

---

## 1. Getting Started

Navigate to **Backups** in the left sidebar and select **Recent Backups**. This opens the BackupSession list page showing all backup executions across your cluster.

---

## 2. BackupSession List

The list page displays all BackupSessions in your cluster, both scheduled (from BackupConfigurations) and on-demand. Use the **Select Namespace** dropdown to filter by namespace.

![BackupSession list page showing sessions with Name, Namespace, BackupConfiguration, Invoker Kind, Invoker Name, Session, Timeout, Phase, Duration, and Age columns](../images/backup/recent-backup-overview.png)

| Column | Description |
|---|---|
| **Name** | The BackupSession resource name. |
| **Namespace** | The namespace where it is deployed. |
| **BackupConfiguration** | The BackupConfiguration that created this session (if applicable). |
| **Invoker Kind** | The resource type that triggered the session (`BackupConfiguration` or manual). |
| **Invoker Name** | The name of the invoker resource. |
| **Session** | The session name within the configuration (e.g., `full-backup`). |
| **Timeout** | Maximum time allowed for the session to complete. |
| **Phase** | Current status (e.g., `Succeeded`, `Running`, `Failed`). |
| **Duration** | Elapsed time for the session operation. |
| **Age** | How long ago the session was created. |

---

## 3. Viewing a BackupSession

Click on any BackupSession name in the list to open its detail page.

### 3.1 - Overview

The detail page opens on the **Overview** tab showing the session's metadata, linked configuration, and all snapshots created:

![BackupSession detail page showing Basic info, Backup Configuration table, and Snapshots table](../images/backup/recent-db-overview.png)

**Basic** — Core metadata for the session:

| Field | Description |
|---|---|
| **Name** | The BackupSession resource name. |
| **Namespace** | The namespace it belongs to. |
| **Labels** | Key-value labels attached to the resource. |
| **Annotations** | Key-value annotations linking to invoker and configuration. |
| **UID** | The unique Kubernetes identifier. |
| **Phase** | Current lifecycle phase (e.g., `Succeeded`, `Running`, `Failed`). |
| **Timeout** | Maximum time allowed for the session. |
| **Session** | The session name within the BackupConfiguration. |

**Backup Configuration** — Reference to the BackupConfiguration that created this session:

| Column | Description |
|---|---|
| **Name** | The BackupConfiguration resource name. |
| **Namespace** | Namespace of the BackupConfiguration. |
| **Invoker Kind** | Always `BackupConfiguration` for scheduled sessions. |
| **Invoker Name** | Name of the BackupConfiguration invoker. |
| **Target** | The database being backed up. |
| **Task** | The backup task executed (e.g., `logical-backup`). |
| **Repository** | Where the backup snapshots are stored. |
| **Status** | Current status of the linked configuration. |
| **Age** | Age of the BackupConfiguration resource. |

**Snapshots** — Individual snapshots created during this session:

| Column | Description |
|---|---|
| **Name** | The snapshot resource name. |
| **Namespace** | Namespace of the snapshot. |
| **Repository** | The repository storing this snapshot. |
| **Size** | Size of the snapshot data. |
| **Phase** | Status of the snapshot (e.g., `Succeeded`, `Failed`). |
| **Creation Timestamp** | When the snapshot was created. |
| **Status** | Verification status (`OK` or error message). |

---

## 4. Creating a BackupSession

To manually trigger an on-demand backup (without waiting for a scheduled BackupConfiguration), click **Create New Instance** from the Recent Backups list page.

The **Create BackupSession** form will open with the following fields:

![Create BackupSession form showing Namespace, Labels & Annotations, Invoker Kind, Invoker Name, Session, and Timeout fields](../images/backup/recent-backup-create.png)

### 4.1 - Basic Fields

![Create BackupSession form fields showing all required and optional sections](../images/backup/recent-create-form.png)

| Field | Description |
|---|---|
| **Namespace** | The Kubernetes namespace where the BackupSession will be created. Required. |
| **Labels & Annotations** | Optional metadata key-value pairs for organization and filtering. |
| **Invoker Kind** | The type of resource triggering this session. For manual backups, set to `BackupConfiguration`. Required. |
| **Invoker Name** | The name of the BackupConfiguration resource to use for this on-demand backup. Required. |
| **Session** | The session name within the BackupConfiguration (e.g., `full-backup`). Required. |
| **Timeout** | Maximum time allowed for the backup to complete (e.g., `2h`). Optional; defaults to the BackupConfiguration's timeout. |

> **Note:** The **Invoker Kind** and **Invoker Name** determine which BackupConfiguration's settings (storage backend, addon, tasks) are used for the on-demand backup.

### 4.2 - Labels & Annotations

Use the **Labels & Annotations** section to attach custom metadata:

- Use **+ Add new** under **Labels** to add key-value label pairs.
- Use **+ Add new** under **Annotations** to add key-value annotation pairs.
- Use the delete icon on any row to remove an entry.

---

## 5. Preview and Submit

Once all required fields are filled, click **Preview** to review the generated `BackupSession` manifest before applying it.

- The manifest is shown in **YAML** view by default. Use the **JSON** button to switch to JSON format if preferred.
- Use the **Copy** button to copy the manifest to your clipboard.
- Click **Previous** to go back and adjust your settings if needed.

> **Tip:** You can directly edit the YAML or JSON on the Preview page before submitting. This is useful for making precise adjustments beyond what the form fields expose.

1. **Submit:** Once satisfied, click **Submit** to create the BackupSession in your cluster.

> **Note:** After submitting, the backup job will begin immediately using the configuration and settings from the specified BackupConfiguration and Session.

---

## Quick Reference

| Action | How to do it |
|---|---|
| View all BackupSessions | **Backups** → **Recent Backups** |
| Filter by namespace | Use the **Select Namespace** dropdown on the list page |
| View session detail | Click on the BackupSession name in the list |
| Check snapshot status | Detail page → **Snapshots** table |
| View linked configuration | Detail page → **Backup Configuration** table |
| Check session phase | Detail page → **Basic** section → **Phase** field |
| Open the create form | List page → **Create New Instance** |
| Add labels or annotations | **Labels & Annotations** → **+ Add new** → enter Key and Value |
| Select a configuration | **Invoker Name** dropdown → choose a BackupConfiguration |
| Select a session | **Session** dropdown → choose session from the configuration |
| Set operation timeout | **Timeout** field → enter duration (e.g., `2h`) |
| Review before creating | Click **Preview** |
| Edit manifest directly | Use the **YAML** / **JSON** toggle on the Preview page |
| Trigger an on-demand backup | Click **Submit** on the Preview page |
