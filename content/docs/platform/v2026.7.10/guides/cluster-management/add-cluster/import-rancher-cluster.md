---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: cluster-management-add-rancher
    name: Import Rancher Managed Clusters
    parent: cluster-management-add
    weight: 15
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Adding a Rancher Managed Cluster to Platform Console

Importing a `Rancher-Managed` cluster requires a Rancher Type Credential and a Rancher Managed Organization.

## Create Rancher Type Credential

Add a credential of type "Rancher" — see [Credentials Management](../../../account-management/kubernetes/credentials/#rancher).

## Create a Rancher Managed Organization

Rancher clusters belong to Rancher Managed organizations, not personal accounts. Follow [Create a New Organization](../../../account-management/orgs-members/#create-a-new-organization) with these settings:

1. Set the organization's Origin to `Rancher Managed`.
2. Provide the Rancher `API Endpoint` (found on the `Account & API Keys` page).
3. Click `Create`.

## Import the Cluster

1. Switch to the Rancher organization: in the [AppsCode Console](https://console.appscode.com), click your profile, choose `Switch Account`, and select the Rancher organization.
2. Follow the standard import process in [Import Vendor Managed Clusters](../import-vendor-managed.md).
