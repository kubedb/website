---
layout: docs
menu:
  docsplatform_v2026.3.30:
    identifier: cluster-management-add-vendormanaged
    name: Import Vendor Managed Clusters
    parent: cluster-management-add
    weight: 10
menu_name: docsplatform_v2026.3.30
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.3.30
---

# Adding a Vendor-Managed Cluster to Platform Console

Enhance your platform experience by seamlessly connecting your vendor-managed Kubernetes cluster to the [Platform Console](https://console.appscode.com/). Follow these step-by-step instructions:

1. Visit [Platform Console](https://console.appscode.com/).
2. Click on the `Add Cluster` button.

### Choose Provider

3. From the `Vendor Managed` section, select the provider hosting your Kubernetes cluster.

### Select Credential

4. Choose a credential with the necessary permissions for accessing and importing the cluster. If you don't have a credential, create one by clicking the `+Create Credential` button [here](../../account-management/kubernetes/credentials.html).
5. Select the created credential and click `Next`.

### Select Cluster

6. This step varies based on your provider:
   - For `Linode` or `Digital Ocean`, directly select the cluster.
   - For `AKS`, `EKS`, and `GKE`:
      - Choose the appropriate `Resource Group`, `Region`, or `Project` where the cluster resides.
      - Select the specific cluster for import.

### Customize Feature and Import

7. Complete the process by clicking `Import` to bring the selected cluster into the Platform Console.

### Explore
8. Once imported, explore the cluster's details and capabilities within the dashboard.

By following these steps, you'll seamlessly integrate your vendor-managed Kubernetes cluster, unlocking its full potential within the platform. Feel free to refer back to this tutorial for guidance.