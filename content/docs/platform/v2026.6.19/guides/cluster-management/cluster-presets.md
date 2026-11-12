---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-preset
    name: Manage Presets
    parent: cluster-management
    weight: 70
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Manage Cluster Presets

**Cluster Presets** are reusable configuration templates that are automatically created when you enable certain Feature Sets (for example, **Backup & Recovery** creates a `stash-presets` preset). They define default values — such as backup schedule, storage references, and retention policies — that can be applied uniformly across multiple namespaces.

---

## Step 1 — Open the Preset List

In the left sidebar, navigate to **Preset** (under **Cluster Settings**). The **Cluster Presets** page lists all presets available in your cluster.

Each row shows:
- **Name** — The preset's name (clickable to open its detail page)
- **Namespace** — The namespace the preset belongs to (or `-` for cluster-scoped)
- **Annotations** — Key labels attached to the preset (e.g., `ace.appscode.com/managed: true`, `app.kubernetes.io/managed-by`)
- **Age** — How long ago the preset was created

![Cluster Presets list page — showing presets with their names, annotations, and age](../images/cluster-presets/preset.png)

> Presets are automatically created when you enable a Feature Set that requires preset configuration (such as Backup & Recovery). After enabling a Feature Set, you may see a new preset appear in this list.
>
> ![Feature Set list — pointing to the "Backup & Recovery" feature](../images/cluster-presets/preset-enable.png)

![Cluster Presets list after enabling a new Feature Set — "stash-presets" and "kubedb-ui-presets" visible](../images/cluster-presets/presets-after-feature-enable.png)

---

## Step 2 — Open a Preset's Detail Page

Click on a preset name (e.g., `stash-presets`) to open the **Preset Detail** page. This page has two tabs in the left panel:

- **Basic Info** — Lists the preset's name, UID, and any namespace-scoped copies (Namespace Presets)
- **Edit Values** — Lets you modify the preset's configuration values

The **Basic Info** tab also shows a **Namespace Presets** table with all namespace-level copies of this preset. If no copies exist yet, it shows *"No Data Available."*

A green **Extend to Namespace** button (top-right) creates a namespace-scoped copy of this preset.

![Preset detail page — Basic Info tab showing Name, UID, and an empty Namespace Presets table](../images/cluster-presets/present-basic-info.png)

---

## Step 3 — Edit Preset Values

Click the **Edit Values** tab in the left panel to modify the preset's default configuration.

The edit form presents each configurable section as a collapsible card. For example, the `stash-presets` preset exposes:

| Section | Fields |
|---|---|
| **Encryption Secret** | Namespace, Name |
| **Retention Policy** | Namespace, Name |
| **Storage Ref** | Namespace, Name |
| **Schedule** | A cron expression (e.g., `*/15 * * * *`) |

Update the values as needed and click **Preview** to advance to the review step.

![Edit Values form — collapsible sections for Encryption Secret, Retention Policy, Storage Ref, and Schedule](../images/cluster-presets/stash-preset-edit-values1.png)

### Preview the Generated YAML

After clicking **Preview**, the page displays the full generated `stash-presets` specification in YAML (or JSON) format on the right. You can directly edit this YAML or JSON.


Click **Submit** to apply the updated preset values to the cluster.

![Preview step — full YAML spec rendered in the editor with Submit button at bottom-right](../images/cluster-presets/stash-preset-edit-values2.png)

---

## Step 4 — Edit KubeDB Presets

Click on the `kubedb-ui-presets` preset to open its detail page. Click the **Edit Values** tab in the left panel to modify the general KubeDB configuration.

The KubeDB preset configuration is organized into four main sections:

1. **Machine specifics** — Configure deployment type (Shared/Dedicated), cluster tiers, and node topologies.
2. **Database specifics** — Manage versions and modes for supported databases (Postgres, Redis, MongoDB, etc.), storage classes, and TLS settings.
3. **Monitoring & Backups specifics** — Configure monitoring agents and default backup settings.
4. **Extras** — Additional configuration fields.

![KubeDB Edit Values form — overview of Machine, Database, and Monitoring sections](../images/cluster-presets/db-preset-edit-values1.png)

### Machine Specifics

In this section, you can define if users are allowed to modify the deployment type, cluster tier, and node placement. You can also specify the available options and default values for these fields.

![Machine Specifics — configuring Deployment Type and Cluster Tier defaults](../images/cluster-presets/db-preset-edit-values2.png)

### Database Specifics

The **Database Specifics** section is where you manage settings for different database engines. You can enable or disable specific versions and modes for each database type.

![Database Specifics — list of supported databases in the preset](../images/cluster-presets/db-preset-edit-values3.png)

For example, in the **Postgres** subsection, you can toggle which versions (e.g., 13.x, 14.x) and modes (Standalone, Cluster) are available to users.

![Postgres settings — enabling specific versions and replica modes](../images/cluster-presets/db-preset-edit-values4.png)

You can also configure default **Auth Credentials**, **Storage Classes**, and **TLS** settings that will be applied to new database instances.

![Additional Database settings — Auth Credentials, Custom Configuration, and Storage Class](../images/cluster-presets/db-preset-edit-values5.png)

### Monitoring & Backup Specifics

Configure the default monitoring agent and resources (CPU/Memory). You can also enable or disable backups by default and specify if they should be managed via `BackupConfiguration` or `BackupBlueprint`.

![Monitoring & Backups — setting up Prometheus agent and default backup behavior](../images/cluster-presets/db-preset-edit-values6.png)
![Backup and Archiver settings — Point In Time Recovery configuration](../images/cluster-presets/db-preset-edit-values7.png)


### Preview and Submit

After completing your changes, click **Preview** to review the generated YAML specification.

![KubeDB Preset Preview — reviewing the final YAML before submission](../images/cluster-presets/db-preset-edit-values8.png)

Click **Submit** to update the `kubedb-ui-presets` configuration in your cluster.

---

## Step 5 — Extend a Preset to a Namespace

Presets can be scoped to specific namespaces so that workloads in those namespaces inherit the preset's configuration. To do this, click the **Extend to Namespace** button (top-right on the Preset Detail page).

A **Presetless Namespace** dropdown appears, listing all namespaces in the cluster that do not yet have a copy of this preset (e.g., `default`, `kubedb`, `flux-system`, `kube-system`, `monitoring`, etc.).

Select the target namespace from the list.

![Extend to Namespace page — dropdown listing available namespaces for the preset to be applied to](../images/cluster-presets/preset-extend-to-namespace1.png)

After selecting the namespace, a **Preset Values** editor appears (YAML/JSON). You can customize the values specifically for this namespace before applying. Click **Apply** to create the namespace-scoped preset copy.

![Preset Values editor — namespace-specific YAML with Apply button at the bottom](../images/cluster-presets/preset-extend-to-namespace2.png)

---

## Quick Reference

| Task | How to do it |
|---|---|
| View all presets | Left sidebar → **Preset** |
| Open a preset | Click the preset name in the list |
| Edit preset values | Preset detail → **Edit Values** tab → update fields → **Preview** → **Submit** |
| Apply to a namespace | Preset detail → **Extend to Namespace** → pick namespace → **Apply** |
| Check namespace copies | Preset detail → **Basic Info** → Namespace Presets table |
