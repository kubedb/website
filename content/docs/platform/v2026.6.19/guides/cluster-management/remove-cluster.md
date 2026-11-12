---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-deletecluster
    name: Remove / Delete Cluster
    parent: cluster-management
    weight: 20
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Remove / Delete Cluster

From the cluster list, click the **⋮** (three-dot) menu on any cluster card to access two actions: **Remove** and **Delete**.

![Cluster options menu showing KubeConfig, Remove, and Delete actions](../images/remove-cluster/cluster-options-menu.png)

---

## Remove

**Remove** unregisters the cluster from the Cluster UI. The actual Kubernetes cluster and its workloads are left untouched.

1. Click **⋮** on your cluster card.
2. Click **Remove**.
3. A confirmation modal opens. Optionally check any cleanup actions to run before removal:
   - **Remove FluxCD** — uninstalls FluxCD from the cluster.
   - **Remove All Features** — uninstalls all installed feature-sets from the cluster.
4. Click **Yes, Remove**.

![Remove Cluster modal with optional checkboxes for Remove FluxCD and Remove All Features](../images/remove-cluster/remove-cluster-modal.png)

---

## Delete

**Delete** permanently destroys the cluster and its underlying infrastructure. This action is irreversible.

1. Click **⋮** on your cluster card.
2. Click **Delete**.
3. Confirm in the modal by clicking **Yes, Delete**.

![Delete Cluster modal asking for confirmation with Yes, Delete button](../images/remove-cluster/delete-cluster-modal.png)

> **Warning:** Delete tears down the actual infrastructure. Use **Remove** if you only want to unregister the cluster from the UI.

---

## Quick Reference

| Action | What happens | Cluster destroyed? |
|---|---|---|
| **Remove** | Unregisters cluster from Cluster UI | No |
| **Delete** | Destroys cluster + infrastructure | Yes |
