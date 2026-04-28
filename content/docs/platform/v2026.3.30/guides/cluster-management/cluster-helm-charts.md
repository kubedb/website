---
layout: docs
menu:
  docsplatform_v2026.3.30:
    identifier: cluster-management-helmcharts
    name: Manage Cluster Helm Charts
    parent: cluster-management
    weight: 50
menu_name: docsplatform_v2026.3.30
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.3.30
---

# Manage Helm Charts in Platform Console

Platform Console offers a robust Helm Chart Management feature, allowing users to effortlessly manage Helm releases within their Kubernetes clusters. This functionality streamlines the installation of new charts, interaction with existing releases, and provides an overall intuitive interface for Helm chart management.

## Accessing Helm Chart Management

To navigate to the Helm Chart Management page:

1. From the [Platform Console](https://console.appscode.com), click on your imported cluster to go to the Cluster Overview page.
2. In the left sidebar, under **Helm**, select **Releases** to access the Helm Chart Management page.

## Helm Chart Management Features

### Install New Charts

Installing new Helm charts is a straightforward process:

1. **Choose Chart Source:** Select a chart source from publicly available URLs or provide a custom URL.
2. **Select Chart and Version:** Browse and choose the desired chart and version.
3. **Customize Installation:** Provide a custom release name, namespace, and specify a custom values file during installation.

### Interact with Existing Releases

Efficiently manage existing Helm releases:

- **Modify Releases:** Adjust existing Helm releases based on evolving requirements.
- **Rollback to Previous Versions:** Easily revert to previous versions of Helm releases if needed.

### User-Friendly Interface

The Helm Chart Management page in the Platform Console ensures an intuitive and user-friendly interface. This allows users to manage Helm releases seamlessly, minimizing the reliance on complex Helm CLI commands.

Explore the power of Helm chart management within the Platform Console and enhance your Kubernetes experience.
