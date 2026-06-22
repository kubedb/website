---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-feature
    name: Manage Feature Sets
    parent: cluster-management
    weight: 30
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Manage Feature Sets

**Feature Sets** are groups of AppsCode product capabilities that you can install or remove on any connected cluster. This page covers all 19 available Feature Sets and shows the enable flow for two common ones: **Backup & Recovery** and **Databases**.

> For a per-feature breakdown of every Feature Set — what each feature does, why you'd enable it, and its prerequisites — see the [Feature Set Reference](feature-reference.md).

---

## Available Feature Sets at a Glance

The Feature Sets grid on the Cluster Overview page shows all available product modules and their current installation status.

![Feature Sets overview grid — all 18 Feature Sets with their status badges](../images/cluster-features/features.png)

| Feature Set | Description |
|---|---|
| **Opscenter Core** *(Required)* | Core platform capabilities — must be installed first. All other Feature Sets depend on it. |
| **Backup & Recovery** | Scheduled backup and recovery for Kubernetes-native applications using KubeStash (Stash 2.0). |
| **Cluster API AWS (CAPA)** | Lifecycle management tools for clusters running on AWS via the Cluster API. |
| **Cluster API GCP (CAPG)** | Lifecycle management tools for clusters running on GCP via the Cluster API. |
| **Cluster Management** | Cluster provisioning and management tools. |
| **Cost Management** | Measure and allocate infrastructure and container resource costs. |
| **Crossplane** | The cloud-native control plane framework for infrastructure as code. |
| **Databases** | Production-grade database management powered by KubeDB — supports Elasticsearch, Kafka, MongoDB, MySQL, Postgres, Redis, and more. |
| **Kubernetes Native Service** | Components for building Kubernetes-native service patterns. |
| **Multicluster Hub** | Deploy and manage a central hub for a fleet of clusters. |
| **Multicluster Spoke** | Connect this cluster as a spoke to an existing Multicluster Hub. |
| **Networking Addons** | Various networking plugins and extensions for Kubernetes. |
| **Observability** | Cluster monitoring, metrics, and dashboards using Prometheus and Grafana. |
| **Opscenter Tools** | DevOps tooling and management utilities for KubeDB Platform. |
| **Policy Management** | Platform-level policy enforcement tools. |
| **Secret Management** | Tools for secure secret storage and distribution across namespaces. |
| **Security** | TLS certificate management, secret scanning, and image vulnerability tooling. |
| **Storage Addons** | Additional storage drivers and integrations for Kubernetes. |

> **Tip:** Feature Sets marked **Required** must be installed before enabling any others. **Opscenter Core** is always required first.

Once you have enabled some Feature Sets, the Cluster Overview grid reflects the updated statuses — cards previously showing **Not Installed** will update to **Ready**.

![Cluster Overview Feature Sets grid after enabling Backup & Recovery and Databases — both show Ready](../images/cluster-features/features-after-enable-some-features.png)

---

## Feature Set: Backup & Recovery

**Backup & Recovery** enables scheduled backup and recovery for Kubernetes-native applications using KubeStash (formerly Stash). It consists of three components: **Stash 2.0** (aka KubeStash), **Stash Presets**, and **Stash**.

### Step 1 — Open the Backup & Recovery Feature Set Page

From the Cluster Overview, click the **Backup & Recovery** card. The Feature Set page opens, showing:
- A blue info banner: *"No feature enabled yet for this feature set."*
- A **Components** section with three cards: **Stash 2.0** *(Recommended)*, **Stash Presets** *(Recommended)*, and **Stash**
- A green **Enable** button on each component card, and a master **Enable** button at the top-right

![Backup & Recovery Feature Set page — Components listed with individual Enable buttons](../images/cluster-features/features-backup1.png)

### Step 2 — Select Components and Configure the Preset

Click the top-right **Enable** button to open the **Enable Feature Set modal**. The modal shows:

- A checklist of available components — select the ones you want to enable (e.g., **Stash 2.0** and **Stash Presets** are pre-checked as Recommended)
- A **Preset Configuration** section with required fields:
  - **Backend Provider** — the storage backend (e.g., AWS S3, GCS, Azure)
  - **Bucket** — the bucket or container name
  - **End Point** — the storage endpoint URL
  - **Insecure TLS** — toggle if using insecure TLS
  - **Prefix** — optional path prefix inside the bucket
  - **Region** — the storage region (e.g., `us-east-1`)

> **Note:** Enabling a feature auto-enables any prerequisite features — a blue banner at the top of the modal confirms this.

Fill in all required fields and click **Preview** to advance.

![Backup & Recovery Enable modal — component checkboxes and Preset Configuration form](../images/cluster-features/features-backup2.png)

### Step 3 — Review the Generated Helm Values

The modal advances to the **Values Preview** step:

- The **left panel** lists each generated Helm release file (e.g., `kubestash.yaml`, `stash_presets.yaml`)
- The **right panel** shows the full YAML values for the selected file
- Switch between **Edit** and **Preview Changes** tabs to review or compare against defaults
- Click **Compare default values** to diff against the out-of-the-box configuration
- Click **← Previous** to go back, or **Deploy** to apply

![Values preview — Helm release YAML editor with Edit/Preview Changes tabs and Deploy button](../images/cluster-features/features-backup3.png)

### Step 4 — Deploy and Monitor Progress

After clicking **Deploy**, the modal shows a **live deploy log**. You will see output like:

```
Enabling FeatureSet `opscenter-backup` started!
```

Wait for the log stream to complete, then close the modal.

![Deploy progress modal showing live log output for Backup & Recovery](../images/cluster-features/features-backup4.png)

### Step 5 — Verify the Feature Set Status

After deployment, the Feature Set page shows the updated component statuses. If a dependency is still being pulled, a banner reads: *"Feature 'stash-presets' is enabled but not ready."* The affected component cards show a ⚠️ warning icon with a tooltip *"Required workload does not exist."*

![Backup & Recovery page in partially-ready state — warning icons on components still initializing](../images/cluster-features/features-backup5.png)

Once all components are running, all cards show a green ✓ checkmark and both **Configure** and **Disable** buttons appear at the top-right — confirming the Feature Set is fully **Ready**.

![Backup & Recovery page fully Ready — all components show green checkmarks, Configure and Disable buttons visible](../images/cluster-features/features-backup6.png)

---

## Feature Set: Databases

**Databases** enables production-grade database management powered by **KubeDB**. It supports a wide range of database engines and is managed by a single component: **KubeDB** (with sub-components KubeDB Opscenter and KubeDB UI Presets).

### Step 1 — Open the Databases Feature Set Page

Click the **Databases** card on the Cluster Overview. The Feature Set page opens, showing:
- A blue info banner: *"No feature enabled yet for this feature set."*
- A single **KubeDB** component card *(Recommended)* with sub-components: `KubeDB`, `KubeDB Opscenter`, `KubeDB UI Presets`, and **More**
- A green **Enable** button on the component card and at the top-right

![Databases Feature Set page — KubeDB component with Enable button](../images/cluster-features/feature-databases1.png)

### Step 2 — Select Database Types

Click the **Enable** button to open the **Enable Feature Set modal**. The modal shows:

- A checklist of **KubeDB components**: KubeDB, KubeDB Opscenter, KubeDB UI Presets, and Prepare Cluster
- A **Select Database Types** multi-select field — choose which database engines to enable:
  - Elasticsearch, Kafka, MariaDB, MongoDB, MySQL, Postgres, Redis, Cassandra, ClickHouse, Druid, FerretDB, Hazelcast, Ignite, Oracle, PerconaXtraDB, PgBouncer, Pgpool, ProxySQL, RabbitMQ, Singlestore, Solr, ZooKeeper
- A blue note: *"Enabling a feature auto enables any prerequisite features."*

Select your required database types and click **Preview**.

![Databases Enable modal — KubeDB component checkboxes and database type multi-select](../images/cluster-features/feature-databases2.png)

### Step 3 — Review the Generated Helm Values

The modal advances to the YAML values preview. Three Helm release files are listed on the left:
- `kubedb.yaml`
- `kubedb_opscenter.yaml`
- `kubedb_ui_presets.yaml`

The YAML editor on the right shows the `featureGates` configuration — each selected database type is set to `true`, others to `false`. Use **Edit / Preview Changes** tabs to review, then click **Deploy**.

![Databases Values preview — featureGates YAML showing enabled database types](../images/cluster-features/feature-databases3.png)

### Step 4 — Deploy and Monitor Progress

After clicking **Deploy**, the live deploy log shows:

```
Enabling FeatureSet `opscenter-datastore` started!
Deploying resources for FeatureSet `opscenter-datastore` started!
```

Wait for the log to complete, then close the modal.

![Databases deploy progress modal showing live log output](../images/cluster-features/feature-databases4.png)

### Step 5 — Verify the Feature Set Status

After deployment, the Databases page shows the KubeDB component status. While resources are still initializing, the banner reads: *"Feature 'kubedb' is enabled but not ready."* The component card shows a ⚠️ warning icon and tooltip *"Required workload does not exist."*

![Databases page in partially-ready state — KubeDB component showing warning with tooltip](../images/cluster-features/feature-databases5.png)

Once KubeDB is fully running, the component card shows a green ✓ checkmark and the page header shows **Configure** and **Disable** buttons — confirming the Feature Set is fully **Ready**.

![Databases page fully Ready — KubeDB component showing green checkmark](../images/cluster-features/feature-databases6.png)

---

## Quick Reference

| Task | How to do it |
|---|---|
| View all Feature Sets | Cluster Overview → Feature Sets grid |
| Open a Feature Set | Click any Feature Set card |
| Enable a Feature Set | Click **Enable** → select components → configure → **Preview** → **Deploy** |
| Check component status | ✓ = Ready, ⚠️ = Not Ready, **Enable** button = Not Installed |
| Disable a Feature Set | Open Feature Set page → click **Disable** (top-right) |
| Reconfigure a Feature Set | Open Feature Set page → click **Configure** (top-right) |
