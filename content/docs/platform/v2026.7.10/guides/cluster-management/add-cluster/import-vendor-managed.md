---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: cluster-management-add-vendormanaged
    name: Import Vendor Managed Clusters
    parent: cluster-management-add
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Adding a Vendor-Managed Cluster to Platform Console

1. Go to the [Platform Console](https://console.appscode.com/) and click `Add Cluster`.

### Choose Provider

2. In the `Vendor Managed` section, select the provider hosting your cluster.

### Select Credential

3. Choose a credential with permission to access and import the cluster, then click `Next`. To create one, use the `+Create Credential` button (see [Credentials](../../../account-management/kubernetes/credentials.md)).

![AWS credential form showing Access Key and Secret Key fields](../../images/add_cluster/credential-aws.png)

![DigitalOcean credential form showing Token field](../../images/add_cluster/credential-digitalocean.png)

![Azure credential form](../../images/add_cluster/credential-azure.png)

![GCP credential form showing Service Account JSON field](../../images/add_cluster/credential-gcp.png)

![Hetzner credential form showing SSH Key Name and Token fields](../../images/add_cluster/credential-hetzner.png)

![KubeVirt credential form showing Kubeconfig YAML field](../../images/add_cluster/credential-kubevirt.png)

### Select Cluster

4. Selection depends on the provider:
   - `Linode` / `Digital Ocean`: select the cluster directly.
   - `AKS` / `EKS` / `GKE`: choose the `Resource Group`, `Region`, or `Project`, then select the cluster.

![EKS Select Cluster screen showing Region dropdown and cluster list table](../../images/add_cluster/select-cluster-eks.png)

### Customize Features and Import

5. Click `Import` to bring the cluster into the Platform Console, then explore it in the dashboard.