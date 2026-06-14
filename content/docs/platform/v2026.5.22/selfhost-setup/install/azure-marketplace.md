---
layout: docs
menu:
  docsplatform_v2026.5.22:
    identifier: azure-marketplace
    name: Azure Marketplace
    parent: selfhosted-installer
    weight: 7
menu_name: docsplatform_v2026.5.22
section_menu_id: selfhost-setup
info:
  product: kubedbplatform
  version: v2026.5.22
---

# 1. Deploying KubeDB Platform: Azure Marketplace

Welcome to the KubeDB Platform's **Azure Marketplace** deployment! This guide will walk you through the deployment process via the Azure Marketplace, ensuring your environment is configured correctly for a seamless installation.

### Prerequisites

See [Prerequisites](common-config.md#prerequisites) in the Common Configuration guide for the minimum cluster requirements and the optional k3s setup note.

## Getting Started

The **Azure Marketplace** installation wizard will prompt you for specific configuration parameters. Having these details ready beforehand will streamline your setup.

If you encounter any issues during the deployment, please refer to our Official Documentation or contact with us.

### 2. Visit the KubeDB Platform Self-Hosted Page

Navigate to [KubeDB Platform Self-Hosted](https://appscode.com/selfhost). Here you will find your previously generated self-hosted installers. <br>
Click on the `Create New Installer` button to get started.

### 3. Choose Deployment Mode And Environment

Choose `Deployment Type` -> `Azure Marketplace` and give it a name in the installer name section.

For deploying KubeDB Platform using azure marketplace, you usually need these four pieces of information to establish a secure connection. These represent the "Identity" of your application and the "Address" of your billing/directory structure.

#### 1. Subscription ID
The unique identifier for your **Azure Subscription**. This is where the actual billing for Marketplace services occurs. To get Subscription ID: 
  1.  Log in to the [Azure Portal](https://portal.azure.com).
  2.  Search for **Subscriptions** in the top search bar.
  3.  Select your active subscription. 
  4.  Copy the **Subscription ID** (e.g., `a1b2c3d4-5678-90ab-cdef-1234567890ab`).

#### 2. Tenant ID
The identifier for your **Microsoft Entra ID** (formerly Azure AD) instance. It represents your entire organization in the cloud. To get Tenant ID: 
  1.  In the Azure Portal, search for **Microsoft Entra ID**.
  2.  On the **Overview** page, look for **Tenant ID**.
  3.  Copy the GUID.

#### 3. Client ID
This is the "username" for your application. When you register an app in Azure to interact with the Marketplace API, it is assigned this ID. To get Client ID: 
  1.  Go to **Microsoft Entra ID** > **App registrations**.
  2.  Select your application (if you haven't made one, click **New registration**).
  3.  Copy the **Application (client) ID** from the Essentials section.
Your application must have the necessary permissions to create deployment resources. It requires permissions to manage the cluster and blob storage, as well as to list regions. In this case, we have assigned the Contributor role.

#### 4. Client Secret
This is the "password" for your application. It allows the app to prove its identity to Azure. To get Client Secret: 
  1.  Inside your **App registration**, click **Certificates & secrets** in the left menu.
  2.  Click **+ New client secret**.
  3.  Add a description and expiry (e.g., 12 months).
  4.  **CRITICAL:** Copy the **Value** (not the Secret ID) immediately. Once you leave the page, it will be hidden forever.

Put **Subscription ID**, **Tenant ID**, **Client ID** and **Client Secret** in the respective field. For openshift cluster toggle Red Hat OpenShift cluster and give Kube API Server endpoint 

### 4. Global Administrative Settings

See [Global Administrative Settings](common-config.md#global-administrative-settings) in the Common Configuration guide for the System Admin account fields (display name, email, password, and initial organization).

For openshift cluster toggle Red Hat OpenShift cluster and give Kube API Server endpoint 

### 5. Registry

See [Registry](common-config.md#registry) in the Common Configuration guide for Docker registry proxies, Helm repositories, credentials, certs, and image pull secrets.

### 6. Monitoring

See [Monitoring](common-config.md#monitoring) in the Common Configuration guide for Alertmanager email and webhook configuration.

### 7. Settings

#### Domain White List
* Add domain one by one for whitelisting
* Put Login and Logout URL 

<br/>
<img width="50%" src="../images/domain-whitelisting.png">

### 8. Self Management

In this section you can enable or disable features.  You can also create an initial `CAPI Cluster` from this section. 

### 9. Branding & UI Customization

See [Branding & UI Customization](common-config.md#branding--ui-customization) in the Common Configuration guide to re-brand the platform interface.

### 10. Generate Installer and Documentation

Click the "Deploy" button to submit your information. KubeDB Platform will generate the installer and provide the necessary documentation.

### 11. Deploy KubeDB Platform

#### Step 1: Create Azure application
Go to Azure Marketplace and select AppsCode Cloud w/ Usage Billing application. [AppsCode Cloud w/ Usage Billing from Marketplace](https://portal.azure.com/#create/appscode.ace_paygace-payg)

<br/>
<img width="50%" src="../images/azureStep1.png">

#### Step 2: Basic Information
Provide basic information for the Azure application. Put your resource group and application name. 

<br/>
<img width="50%" src="../images/azureStep2.png">

#### Step 3: Select VM
Select a virtual machine for the Installer with at least 4 core CPU and 16GB of RAM.

<br/>
<img width="50%" src="../images/azureStep3.png">

#### Step 4: Authentication Type
By default Username user will be created to your Installer VM.
You can use one of the Password or SSH Key Pair to authenticate into the VM.

<br/>
<img width="50%" src="../images/azureStep4.png">

#### Step 5: Installer Information
Provide the URL link you found from the instruction in the Installer Url field

<br/>
<img width="50%" src="../images/azureStep5.png">

You can monitor the deployment progress through the **Managed Resource Group's** overview page and the **Activity Log**. Once the deployment is complete, the necessary resources will be provisioned within that managed resource group.
<div style="display: flex; justify-content: space-between;">
  <img src="../images/ace-status.png" style="width: 48%;">
  <img src="../images/managed-resources.png" style="width: 48%;">
</div>

### 12. Explore the Deployed Platform

Once deployed, access the **KubeDB Platform** using the specified domain. Log in with the admin account credentials provided during the creation process.
