---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: database-management-scale
    name: Scaling Databases
    parent: database-management
    weight: 30
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Scaling Databases

Adjust the computational resources and replica count of your database. Three scaling approaches are available — **Vertical Scaling** for manual CPU and memory adjustments, **Compute Autoscaling** for policy-driven automatic resource management, and **Horizontal Scaling** for changing the number of database replicas.

---

## 1. Getting Started

Select **Scale Vertically** from the **Operations** section in the left sidebar. The scaling form shows two method cards at the top:

- **Vertical Scaling** — Manually adjust CPU and memory allocated to your database nodes.
- **Compute Autoscaling** — Automatically scale CPU and memory in response to workload demands using predefined policies.

Below the method cards, the form contains sections for **Configure Your Machine Profile**, **Node Selection**, **Exporter**, and **OpsRequest Options**.

![Vertical Scale form overview showing method cards, Machine Profile, Node Selection, Exporter, and OpsRequest Options sections](../images/vertical-scaling.png)

---

## 2. Vertical Scaling

Use this method to manually set the CPU and memory resources for your database nodes.

### 2.1 - Configure Your Machine Profile

The **Configure Your Machine Profile** panel lets you compare your current resource allocation with the proposed new configuration before applying it.

![Machine Profile panel showing Current Machine profile (250m CPU, 512Mi Memory) and New Machine profile with custom resource dropdown](../images/vertical-machine-profile.png)

- **Current Machine Profile** — Displays the existing CPU and memory allocation (read-only, shown for reference).
- **New Machine Profile** — Select a preset resource profile from the **Resources** dropdown, or choose **custom** to enter CPU and Memory values manually.

![Machine Profile with Resources dropdown expanded showing available preset CPU and Memory options](../images/vertical-machine-profile2.png)

> **Tip:** Use a preset profile for common workload sizes. Switch to **custom** if you need precise control over CPU and memory values beyond the available presets.

### 2.2 - Node Selection

The **Node Selection** panel controls which Kubernetes nodes the database pods are scheduled onto after scaling.

![Node Selection panel showing Node Selection Policy dropdown, Label Selector and Taints hint, and Topology key-value fields](../images/vertical-node-selection.png)

| Field | Description |
|---|---|
| **Node Selection Policy** | Choose a policy to control node targeting — use **Label Selector** to match nodes by key-value labels, or **Taints** to define tolerations that allow pods to run on tainted nodes. |
| **Topology - Key** | The node label key used to define a topology domain (e.g., `zone`). |
| **Topology - Value** | The value for the topology key (e.g., `us-central1-a`). Workloads will be deployed in nodes matching this topology. |

### 2.3 - Exporter

The **Exporter** panel sets the CPU and memory resources allocated to the metrics exporter sidecar container.

![Exporter panel showing CPU field set to 100m and Memory field set to 256Mi](../images/vertical-exporter.png)

| Field | Description |
|---|---|
| **CPU** | CPU request for the exporter sidecar (e.g., `100m`). |
| **Memory** | Memory request for the exporter sidecar (e.g., `256Mi`). |

### 2.4 - OpsRequest Options and Apply

Expand **OpsRequest Options** to configure the timeout and apply policy for the vertical scaling operation.

1. **Timeout:** Maximum time allowed for the operation (e.g., `30sec`, `1min`, `2h`).
1. **Apply:** Choose **IfReady** to apply only when the database is healthy, or **Always** to apply unconditionally.
1. **Preview:** Click **Preview** to review the generated OpsRequest manifest.
1. **Submit:** Once satisfied, click **Submit** to apply the vertical scaling changes.

> **Tip:** On the Preview page, you can switch to **YAML** or **JSON** view to edit the manifest directly before submitting.

---

## 3. Compute Autoscaling

Use this method to automatically adjust CPU and memory based on actual workload demands. The autoscaler monitors resource usage and applies changes according to the policies you configure.

![Compute Autoscaling method selected showing Trigger toggle, Pod Lifetime Threshold, Standalone, NodeTopology, and OpsRequest Options sections](../images/auto-scaling.png)

### 3.1 - Trigger and Pod Lifetime Threshold

1. **Trigger:** Toggle to enable or disable the autoscaling policy. When enabled, the autoscaler actively monitors and adjusts resources.
1. **Pod Lifetime Threshold:** Specifies the minimum duration a pod must have been running before it is considered for autoscaling decisions. This prevents scaling actions on freshly started pods that have not yet stabilised.

### 3.2 - Standalone Resource Configuration

The **Standalone** panel defines the resource boundaries and scaling sensitivity for standalone database nodes.

![Standalone panel showing ResourceDiff slider at 20%, Min Allowed and Max Allowed CPU and Memory, Controlled Resources, and Container Controlled Values](../images/auto-scaling-standalone.png)

| Field | Description |
|---|---|
| **ResourceDiff Percentage** | The minimum percentage difference between the current and recommended resource values required to trigger a scaling action. Adjust using the slider (0-100%). |
| **Min Allowed - CPU** | The minimum CPU the autoscaler is allowed to set (e.g., `400m`). |
| **Min Allowed - Memory** | The minimum memory the autoscaler is allowed to set (e.g., `400Mi`). |
| **Max Allowed - CPU** | The maximum CPU the autoscaler is allowed to set (e.g., `1`). |
| **Max Allowed - Memory** | The maximum memory the autoscaler is allowed to set (e.g., `2Gi`). |
| **Controlled Resources** | The resource types the autoscaler manages — typically `cpu` and `memory`. |
| **Container Controlled Values** | Determines whether the autoscaler adjusts `RequestsAndLimits`, `RequestsOnly`, or `LimitsOnly`. |

### 3.3 - NodeTopology

The **NodeTopology** panel lets you constrain autoscaling decisions to a specific node topology group, ensuring recommendations stay within the resource limits of a particular node class.

![NodeTopology panel showing Select NodeTopology dropdown](../images/auto-scaling-nodetopology.png)

1. **Select NodeTopology:** Choose a node topology from the dropdown to scope the autoscaler's resource recommendations to the capacity of nodes in that topology.

### 3.4 - Readiness Criteria

The **Readiness Criteria** panel defines conditions that must be met before the autoscaler applies a scaling recommendation.

![Readiness Criteria panel showing Objects Count Diff Percentage slider at 50% and Oplog Max Lag Seconds field set to 10](../images/auto-scaling-readiness.png)

| Field | Description |
|---|---|
| **Objects Count Diff Percentage** | Maximum acceptable difference (%) in object counts between primary and secondaries before scaling is allowed (0-100%, e.g., `50`). |
| **Oplog Max Lag Seconds** | Maximum acceptable replication lag in seconds before scaling is allowed (e.g., `10`). |

> **Note:** These criteria ensure autoscaling only occurs when the database is in a consistent, healthy state — preventing resource changes during replication lag or data inconsistency.

### 3.5 - OpsRequest Options and Apply

Expand **OpsRequest Options** to configure how the autoscaling OpsRequest is applied.

1. **Timeout:** Maximum time allowed for the autoscaling operation.
1. **Apply:** Choose **IfReady** (recommended) or **Always**.
1. **Preview:** Click **Preview** to review the generated autoscaling manifest.
1. **Submit:** Once satisfied, click **Submit** to activate the autoscaling policy.

---

## 4. Horizontal Scaling

Use **Horizontal Scale** to increase or decrease the number of database replicas. More replicas improve fault tolerance and distribute read load; fewer replicas conserve cluster resources.

![Horizontal Scale form showing Current Replicas (3) and New Replicas spinner input](../images/horizontal-scale-form.png)

1. **Current Replicas:** Displays the current replica count (read-only, shown for reference).
1. **New Replicas:** Enter the desired replica count using the spinner or by typing directly. Each replica is an independent copy of your database — for example, setting this to `3` creates three copies for improved availability.
1. **Preview:** Click **Preview** to review the generated OpsRequest manifest.
1. **Submit:** Once satisfied, click **Submit** to apply the replica change.

> **Note:** After every **Preview**, you must click **Submit** to save your changes.

> **Tip:** On the Preview page, you can switch to **YAML** or **JSON** view to edit the manifest directly before submitting.

---

## Quick Reference

| Action | How to do it |
|---|---|
| Manually set CPU and memory | Select **Vertical Scaling** → configure Machine Profile → **Preview** → **Submit** |
| Choose a node preset profile | **Configure Your Machine Profile** → select from **Resources** dropdown |
| Pin database to specific nodes | **Node Selection** → set Node Selection Policy and Topology |
| Set exporter sidecar resources | **Exporter** → enter CPU and Memory values |
| Enable compute autoscaling | Select **Compute Autoscaling** → enable **Trigger** → configure Standalone bounds → **Preview** → **Submit** |
| Scope autoscaling to a node class | **NodeTopology** → select a topology from the dropdown |
| Set autoscaling readiness gates | **Readiness Criteria** → set Objects Count Diff % and Oplog Max Lag Seconds |
| Change the number of replicas | Select **Horizontal Scaling** → set New Replicas → **Preview** → **Submit** |
| Edit manifest before applying | Use the **YAML** / **JSON** toggle on the Preview page |
