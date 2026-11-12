---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: license-management-license-proxyserver
    name: License Proxy Server
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

## The License Proxy Server

The `license-proxyserver` is a critical component of the AppsCode License Management System, deployed within customer Kubernetes clusters to validate and apply licenses to KubeDB Platform products. 
### 1. Purpose and Architecture

The primary purpose of the `license-proxyserver` is to:

- **Serve Licenses:** Provide valid license tokens to KubeDB Platform products (e.g., KubeDB, KubeStash, KubeVault operators and provisioners) running within the same Kubernetes cluster.
- **Validate Licenses:**
    - In **Online Mode**, The `license-proxyserver` connects periodically to the Billing Server to validate and rotate licenses. This mode provides automatic license updates and ensures that changes to contract status are reflected promptly in the customer environment.
    - In **Offline Mode**, The `license-proxyserver` operates without connecting to the Billing Server. Instead, it uses `pre-generated` licenses embedded in the installer until the embedded licenses are expired. This mode is ideal for `air-gapped` environments or scenarios where external connections are restricted.
- **Centralized License Management within the Cluster:** Simplifies license management for multiple KubeDB Platform products within a single cluster by acting as a common point for license queries.

#### Architectural Flow

1. **KubeDB Platform Product Request:** When a KubeDB Platform product (e.g., KubeDB operator) starts or performs a licensed operation, it requests a license from the License Proxy Server running in its cluster.
2. **License Proxy Server Response:**
    - **Online Mode:** If the `license-proxyserver` has a valid, cached license, it provides it immediately. If the license is nearing its expiration, has already expired, or is otherwise invalid, the `license-proxyserver` attempts to contact AppsCode `Billing Backend` to fetch a new license. This new license is based on the active contracts associated with that specific cluster.
    - **Offline Mode:** The `license-proxyserver` primarily uses the pre-generated licenses embedded in its installer. It operates without connecting to the Billing Console for routine validation. However, if all embedded licenses are found to be expired or have been revoked, the `license-proxyserver` will, as a fallback, attempt to fetch new licenses from the AppsCode billing backend. This means that even in air-gapped environments, a temporary or controlled outbound connection might be necessary for license renewal or recovery if the embedded licenses become invalid over time. 
   > Each mode offers distinct advantages and is suitable for different operational contexts.
3. **Product Operation:** A valid license allows the product to operate with its full feature set, while an invalid or absent license may lead to reduced functionality or prevent the product from operating.

> This architecture ensures that licensing checks are performed locally within the cluster, minimizing latency and dependency on external services for routine operations, especially after initial license acquisition.

### 2. Generating the License Proxy Server Installer

The AppsCode Billing Console provides a dedicated interface for generating the necessary deployment manifests (typically a `Helm chart` or `YAML files`) for the `license-proxyserver`. The generation process requires the administrator to choose the operational mode for which the installer is being created: `online` or `offline`. 
This choice dictates how the installer is packaged and how the deployed `license-proxyserver` will behave regarding license validation.

#### Online Mode Deployment

Online mode is suitable for clusters with reliable internet connectivity, allowing for dynamic license management and regular validation.

##### Installer Generation for Online Mode

When the `Online` option is selected for installer generation in the Billing Console, the system prepares a standard `license-proxyserver` installer. ![Online Installer](../images/online-installer.png) 
This installer is typically provided as a `Helm` commands or `YAML files`, as seen in the `Scripts` pop-up. ![Online Installer Scripts](../images/online-installer-scripts.png)

The generated installer configures the license-proxyserver to communicate with the AppsCode licensing backend. The cluster where this `license-proxyserver` is installed must be `associated with one or more online contracts` in the Billing Console for successful license acquisition.
Key configurations embedded in the installer include:

- The base URL for the AppsCode licensing backend, explicitly set (e.g., `-set platform.baseURL=https://AppsCode.com`). This ensures the `license-proxyserver` knows where to connect for license validation and updates.
- A platform token (e.g., `-set platform.token=dc823391fc8d6d9ca10f47a1ed07************`). This token is used by the `license-proxyserver` to authenticate itself with the AppsCode backend and identify which licenses it is eligible for.


#### License Acquisition and Rotation

- **Initial Acquisition:** Upon startup, the `license-proxyserver` contacts AppsCode.com, identifies its cluster (based on its configuration or a token provided during installation), and requests licenses for the products covered by any active online contracts associated with that cluster.
- **Periodic Rotation:** Licenses issued in online mode have a finite, relatively short lifespan (e.g., the default is 7 days). Before a license expires, the `license-proxyserver` automatically attempts to renew it by contacting the AppsCode backend. This ensures continuous legal operation of the products.

**Benefits:**
- **Up-to-date Compliance:** Ensures the cluster is always checked against the latest contract status. If a contract is terminated or expires, new licenses will not be issued, maintaining compliance.
- **Dynamic Updates:** Allows AppsCode to propagate updates to license terms or features if necessary, which would be picked up during a renewal cycle.

> **Requirements:**
> - The `license-proxyserver` must have consistent outbound `HTTPS` (typically port 443) connectivity to the AppsCode licensing endpoints. 
> - `Firewall` rules in the customer's environment must `permit` this communication.

#### Offline Mode Deployment

Offline mode caters to environments that are air-gapped or have stringent restrictions on external network communications. It is ideal for sectors like finance, government, or critical infrastructure, where Kubernetes cluster environments are completely offline.

#### Enabling Offline Contracts
The prerequisite for generating an offline `license-proxyserver` installer is that the relevant contract(s) in the AppsCode Billing Console must be explicitly 
designated as `offline` type by an [AppsCode administrators](https://AppsCode.com/contact/). This tells the system that licenses derived from this contract should be `long-lived` and not require `online renewal`.

#### Installer Generation for Offline Mode
Generating an installer for offline mode is a multi-step process, designed to embed specific licenses for a chosen cluster:

1. **Select Offline Mode:** In the `License Proxy Server` section of the Billing Console, choose the `Offline` option.
2. **Identify Target Cluster:** The console will then display a list of clusters that are associated with at least one `offline` contract, along with their `Name`, `UID`, and the `count` of Associated Contracts (e.g., `doc-preview` with `6 Contracts`, `prod-us-east-1` with `2 Contracts`). The administrator must select the specific cluster for which the offline installer is to be generated. ![Offline Installer Cluster Selection](../images/offline-installer-cluster-selection.png) Click on the `Associated Contracts` button next to the desired cluster to embed the licenses against the selected contracts. <br><br>
3. **Select Contracts for Embedding:** Once a cluster is chosen, the `Billing Console` shows all offline contracts currently linked to the selected cluster, allowing the administrator to choose which of these contracts' licenses should be embedded into the `license-proxyserver` installer. This provides granular control, especially if a cluster is associated with multiple offline contracts for different products or terms. ![Offline Installer Contract Selection](../images/offline-installer-contract-selection.png) After making the selections, click the `Generate License Proxy Installer` button within this pop-up to proceed. <br><br>
4. **Generate the Installer Bundle:** Upon clicking `Generate License Proxy Installer`, the Billing Console compiles the installer package. This package includes the `license-proxyserver` deployment manifests (typically `Helm` commands or `YAML` files) and the actual license data for the selected contracts. This license data is encoded (e.g., as a `Base64` string) and embedded directly within the configuration, as indicated by parameters like `-set encodeLicenses` in the generated scripts. ![Offline Installer Scripts](../images/offline-installer-scripts.png) The generated installer is then ready for download and deployment to the target cluster.

#### License Characteristics in Offline Mode

- **Full Duration Licenses:** Offline licenses are valid for the entire contract term, e.g., June 1, 2025, to May 31, 2026.
- **No Periodic Online Rotation (Initially):** Self-contained licenses don’t need AppsCode server contact until expiration.
- **Fallback to Online Mode:** Expired offline licenses trigger the license-proxyserver to fetch new licenses online, mimicking online mode.
- **Self-Contained Deployment:** Licensing data is embedded in the license-proxyserver, allowing disconnected operation while licenses are valid.
- **Updates Require New Installer:** Contract extensions or expired licenses require a new installer from the Billing Console, which must be upgraded or reinstalled to maintain or restore offline functionality.


### 3. Verifying Product License Status

After the `license-proxyserver` is installed and KubeDB Platform products are deployed, administrators can verify the license status directly within the Kubernetes cluster using `kubectl`.

#### Using kubectl for License Verification

The `license-proxyserver` component functions as an `extended API server` within the Kubernetes cluster. This means it extends the Kubernetes API by exposing new endpoints, including those to check license status. Administrators can query these endpoints directly using the following command.

```bash
kubectl get licensestatus
```

This command will list the status of licenses being consumed by various KubeDB Platform products within the cluster.

##### Interpreting licensestatus Output

The output of `kubectl get licensestatus` provides several key pieces of information for each licensed component:

- **ID:** A unique identifier for this specific license.
- **PRODUCT:** The name of the KubeDB Platform product that this license status pertains to (e.g., `kubedb`, `kubestash`, `platform` etc.).
- **REQUESTER:** The specific `component` or `service account` within the cluster that requested and is utilizing this license. This helps pinpoint which part of a KubeDB Platform product installation is covered by this license entry (e.g., `system:serviceaccount:kubedb:kubedb-kubedb-provisioner`).
- **CONTRACT:** This field indicates the identifier of the AppsCode contract which is utilized providing the license. There are two scenarios on how this field is populated: <br><br>
  - If a cluster is not explicitly associated with any contract in the Billing Console, AppsCode automatically provides a `1-month (30-day)` free trial license. In such cases, the `CONTRACT` column in the `licensestatus` output will display `0`. This temporary license is particularly helpful for customers during initial testing and evaluation periods. Each cluster is eligible for this free trial only once. ![Free Trial License](../images/license-status-free-contract.png)
  - Otherwise, if a cluster is associated with a specific contract, this column will display the actual `CONTRACT ID` from the Billing Console, allowing administrators to `cross-reference` the license with the detailed contract terms. ![Paid License](../images/license-status-paid-contract.png)
- **VALID:** This field indicates the remaining validity period for the current license instance.
- **ROTATES:** This field indicates when the license is next scheduled for rotation or renewal.
