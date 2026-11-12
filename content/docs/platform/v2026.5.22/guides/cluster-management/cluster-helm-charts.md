---
layout: docs
menu:
  docsplatform_v2026.5.22:
    identifier: cluster-management-helmcharts
    name: Manage Cluster Helm Charts
    parent: cluster-management
    weight: 50
menu_name: docsplatform_v2026.5.22
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.5.22
---

# Manage Helm Charts in Platform Console

Platform Console's Helm Chart Management lets you manage Helm releases within your Kubernetes clusters — installing new charts, modifying existing releases, and rolling back versions from the UI.

## Accessing Helm Chart Management

To navigate to the Helm Chart Management page:

1. From the [Platform Console](https://console.appscode.com), click on your imported cluster to go to the Cluster Overview page.
2. In the left sidebar, under **Helm**, select **Releases** to access the Helm Chart Management page.

## Helm Chart Management Features

### Install New Charts

1. **Choose Chart Source:** Select a chart source from publicly available URLs or provide a custom URL.
2. **Select Chart and Version:** Browse and choose the desired chart and version.
3. **Customize Installation:** Provide a custom release name, namespace, and specify a custom values file during installation.

### Interact with Existing Releases

- **Modify Releases:** Adjust existing Helm releases based on evolving requirements.
- **Rollback to Previous Versions:** Revert to previous versions of Helm releases if needed.
