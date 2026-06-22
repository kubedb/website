---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: license-management-contract
    name: Contract
    parent: license-management
    weight: 40
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

## Contract

A contract is basically a digital agreement of the licensing relationship between AppsCode and its customers. Each contract represents a formal agreement for the use of 
specific KubeDB Platform products, such as KubeDB or platform-enterprise, with defined validity periods and feature sets.

The contract management system within the Billing Console provides comprehensive tools for creating, modifying, and monitoring contracts. Administrators can specify 
product details, validity periods, and associated features, ensuring that customers have access to the appropriate resources for their needs.

![contract-details](../images/contract-details.png)

Key information typically contained within a contract includes:

- **Product:** The specific KubeDB Platform product or bundle covered by the contract (e.g., `kubedb-enterprise`, `platform-enterprise` etc.).
- **Org/User:** The organization or user account to which the contract is assigned.
- **Status:** The current state of the contract (e.g., active, expired, revoked), managed by AppsCode administrators.
- **Start Date:** The date from which the contract, and thus the license, becomes valid (not_before).
- **End Date:** The date on which the contract, and the license, expires (not_after).


Contracts ensure that product usage is aligned with the purchased entitlements, providing clarity for both the customer and AppsCode.

### Managing Cluster Associations with Contracts

For KubeDB Platform products to operate with a valid license on a Kubernetes cluster, customers must explicitly associate that cluster with one or more active contracts 
made available to them in the Billing Console. This capability is a key `self-service` feature, allowing customers to dynamically manage which of their Kubernetes 
environments are licensed under a given contract, within the overall terms and capacity of that agreement.

### Adding Clusters to Contracts

To add a Kubernetes cluster to a contract and enable license validation within that environment, customers need to perform the following steps:

1. **Navigate to Contract Details:** Access the specific contract detail page within the Billing Console.
2. **Initiate Cluster Addition:** Locate the `Cluster` section on the contract page and `click on` the `Add Cluster` button. ![Add Cluster](../images/add-cluster-button-rectangle.png)
3. **Provide Cluster Information:** A dialog box will appear, prompting for cluster details. Customers need to provide:
   - **Cluster ID:** The unique identifier of the Kubernetes cluster. This can be retrieved using the command: `kubectl get ns kube-system -o=jsonpath='{.metadata.uid}`.
   - **Cluster Name (optional):** A descriptive name, such as `dev-us-east-1` or `prod-us-east-2`, for easy identification within the console. Customers can enter multiple `ClusterID` and `ClusterName` pairs, each on a new line, separated by a space. ![Add Cluster Information](../images/add-cluster-information.png)
4. **Preview and Confirm:** After entering the details, selecting `Preview` will display the entered cluster(s) for verification. Once confirmed, click `Add` to finalize the association. ![Add Cluster Information](../images/add-cluster-preview.png)
5. **View Associated Clusters:** Upon successful addition, the cluster(s) will appear in the `Cluster` section of the contract's detail page, listed by their `Cluster ID` and `Name`. ![Add Cluster Information](../images/add-cluster-confirm.png)

### Removing Clusters from Contracts

To remove a cluster's authorization to use licensed products under a specific contract:

1. **Navigate to Contract Details:** Access the specific contract detail page within the Billing Console.
2. **Locate and Remove:** In the `Cluster` section, find the cluster in the associated clusters list that needs to be removed.
3. **Confirm Removal:** Select the `Remove` option (often represented by a `trash` icon) next to the cluster and confirm the action when prompted. ![Cluster Delete](../images/cluster-delete.png)

After removal, the cluster will no longer be authorized to use the licensed products associated with that contract. Any installed KubeDB Platform products on that cluster may revert to their community or limited functionality, depending on their licensing model.

**Audit Trail:** The Billing Console maintains an audit trail of changes to cluster associations, logging which user performed the action and when. This feature is vital for tracking, security, and troubleshooting. ![Audit Trail](../images/audits.png)

### Cluster Contract Relationship

The AppsCode License Management System supports flexible relationships between clusters and contracts:
1. **Many-to-One:** Multiple clusters can be associated with a single contract.
2. **One-to-Many:** A single cluster can be associated with multiple contracts for different products.
3. **Many-to-Many:** Multiple clusters can be associated with multiple contracts.

This flexibility allows organizations to structure their licensing in a way that aligns with their operational needs and deployment architecture.

### Contract Operational Modes: Online vs. Offline

The operational mode of a contract (`online` or `offline`) is a critical setting configured by AppsCode administrators, usually at the time of contract creation or during major revisions, based on the customer's operational environment and requirements. This choice significantly impacts license validation:

**Online Mode:**
- This is the standard mode for contracts where clusters have internet access.
- The `license-proxyserver` in the customer's cluster regularly connects to AppsCode's central licensing servers (e.g., `AppsCode.com`s) for license `validation` and `renewal`.
- Licenses are typically issued for shorter durations (e.g., `7 days` by default) and are automatically rotated.
- This mode facilitates dynamic license management and ensures continuous validation against the current contract status.

**Offline Mode:**
- Designed for environments without `internet access` (air-gapped) or with highly restricted outbound connectivity.
- When a contract is configured as `offline` by AppsCode's administrators, the `license-proxyserver` installer generated by the customer will include licenses covering the contract's entire duration.
- These licenses do not require periodic online `validation` or `rotation`.
- Any changes to the contract term requires the customer to generate & deploy a new offline License Proxy Server installer.
- In offline contract you can download the license file from the contract details page. ![Download Offline License](../images/download-offline-license.png)

> The Billing Console enables customers to generate the appropriate License Proxy Server installer based on the mode of their contract.
