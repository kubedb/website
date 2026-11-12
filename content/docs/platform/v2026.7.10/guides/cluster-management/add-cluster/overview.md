---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: cluster-management-add-overview
    name: Overview
    parent: cluster-management-add
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Adding a Cluster to Platform Console

Adding a Kubernetes cluster to the Platform Console takes two steps:

## Step 1: Select the Cluster

- **Vendor-Managed:** [Import Vendor Managed Clusters](../import-vendor-managed.md)
- **Rancher-Managed:** [Import Rancher Managed Clusters](../import-rancher-cluster.md)
- **Self-Managed:** [Import Self-Managed Clusters](../self-managed/import-self-managed.md)

## Step 2: Customize Features

Choose the features to install during import. The selected features are deployed into the cluster as part of the import process.