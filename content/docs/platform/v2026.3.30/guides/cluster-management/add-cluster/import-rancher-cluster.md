---
layout: docs
menu:
  docsplatform_v2026.3.30:
    identifier: cluster-management-add-rancher
    name: Import Rancher Managed Clusters
    parent: cluster-management-add
    weight: 15
menu_name: docsplatform_v2026.3.30
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.3.30
---

# Adding a Rancher Managed Cluster to Platform Console

Adding a `Rancher-Managed` cluster to the Platform Console involves a slightly different process. In order to import a `Rancher-Managed` cluster to the Platform Console, you need to create a Rancher Managed Organization and a Rancher Type Credential.

## Create Rancher Type Credential

To create a Rancher type credential, refer to the [Credentials Management Documentation](../../account-management/kubernetes/credentials.md#rancher) and follow the instructions to add a new credential of type "Rancher."

## Create a Rancher Managed Organization

Unlike personal accounts, Rancher clusters are associated with Rancher Managed organizations. Follow the [Create a New Organization](../../account-management/orgs-members.md#create-a-new-organization) documentation with the following additional steps:

1. Choose the organization's Origin as `Rancher Managed`.
2. Provide the Rancher `API Endpoint`, which you can find under the `Account & API Keys` page.
3. Click `Create` to complete the organization creation process.

## Import the Cluster

Before importing a Rancher Managed cluster into the Platform Console, you must switch to the Rancher organization. Follow these steps:

1. Go to [AppsCode Console](https://console.appscode.com).
2. Click on the Profile Icon or username.
3. Choose `Switch Account`.
4. Select your Rancher organization.

Once you are in the Rancher organization, follow the standard cluster import process outlined in the [Import Vendor Managed Clusters](import-vendor-managed.md) documentation.
