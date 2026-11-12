---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: rancher-extension
    name: KubeDB Rancher Extension
    parent: integrations
    weight: 50
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# KubeDB Rancher Extension

The **KubeDB Rancher Extension** enables you to manage **KubeDB** resources directly from the Rancher UI. With this extension, you can **deploy**, **monitor**, and **manage** production-grade databases in your Kubernetes clusters without leaving the Rancher dashboard.

This guide walks you through deploying and configuring the KubeDB Rancher Extension so you can start managing your databases seamlessly within Rancher.

---

## 1. Prerequisites

Before proceeding, make sure you have:

- A Rancher setup with access to the **Local** cluster.
- An account on [appscode.com](https://appscode.com/).
- The [KubeDB Platform](https://appscode.com/docs/en/selfhost-setup/) deployed on your Rancher cluster.

---

## 2. Deploying the KubeDB Rancher Extension

### Step 1 – Deploy KubeDB Platform
1. Create an account at [appscode.com](https://appscode.com/).
2. Follow the [self-hosting KubeDB Platform guide](https://appscode.com/docs/en/selfhost-setup/) to deploy KubeDB Platform on your Rancher cluster.  
   You can also watch this video tutorial for step-by-step instructions: [Self-Hosting KubeDB Platform Video Guide](https://www.youtube.com/watch?v=1diG8qq73f4&list=PLoiT1Gv2KR1iqWFGkCozbLqYe31QMsQcX&index=2)


---

### Step 2 – Create a Rancher-Type Organization in KubeDB Platform
1. Visit your KubeDB Platform URL and log in with your **admin account**. ![KubeDB Platform URL](../images/ace-url.png)
2. Navigate to **Organizations** and create a new organization with the type set to **Rancher**.
3. Provide a valid **Sync Token**.
   > The Sync Token is used to synchronize Rancher users into the KubeDB Platform.

![Create Organization](../images/organization-create.png)

---

### Step 3 – Sync Rancher Users 
1. Go to **Organization Settings → Rancher Extension**. ![Organization Settings](../images/organization-settings.png)
2. Click **Sync User** to import Rancher users into KubeDB Platform. ![Sync User](../images/organization-settings-sync-users.png)

---

### Step 4 – Install the Rancher Proxy in Local Cluster
1. Click **Generate Rancher Proxy Installer** to generate the Rancher proxy installation command. ![Generate Rancher Proxy Installer](../images/organization-settings-generate-installer.png)
2. First, Click the **Download** button to download the CA. We are passing it by --set-file in helm command. Then Copy the generated Helm installation command. ![Rancher Proxy Installer](../images/acer-proxy-installer.png)
3. Open a terminal connected to your Rancher **Local** cluster.
4. Run the copied Helm command to install the Rancher proxy.

---

### Step 5 – Verify Installation
Run the following command in your **Local** cluster to confirm that the Rancher proxy pod is running:

```bash
kubectl get pods -n kubeops | grep acerproxy

acerproxy-6cdcd88df-nts6w   1/1     Running   0     6d
```

## 3. Install KubeDB Extension from Rancher UI

Follow these steps to install the KubeDB extension in Rancher:

#### 1. Open Extensions Page  
   In your Rancher UI, click on **Extensions**.  
   ![Extensions](../images/extensions.png)

#### 2. Open Managed Repositories  
   In the list of available extensions, click the **three dots** menu (as shown below) and select **Managed Repositories**.  
   ![Three Dot](../images/three-dot.png)  
   ![Manage Repo](../images/manage-repo.png)

#### 3. Create a New Repository  
   Click the **Create** button.  
   ![Create Repo](../images/create-repo.png)

#### 4. Enter Repository Details  
   Fill in the required fields as shown in the screenshot, then click **Create**.  
   ![Repo Info](../images/repo-info.png)

#### 5. Locate the KubeDB Extension  
   After adding the repository, you will see **KubeDB** in the list of available extensions.  
   ![KubeDB Extension](../images/kubedb-in-list.png)

#### 6. Install the Extension  
   Click **Install** to add the KubeDB extension to Rancher.  
   ![Install KubeDB](../images/install-ext.png)

#### 7. Access KubeDB in a Cluster  
   Open any cluster in Rancher — you will now see a **KubeDB** dropdown in the sidebar.  
   From here, you can deploy, monitor, and manage your databases directly from the Rancher UI.  
   ![KubeDB In Rancher](../images/kubedb-in-rancher.png)

---


✅ Installation Complete!  
You can now deploy and manage your databases directly from the KubeDB menu in your cluster.  
NB: Import your Rancher cluster into the KubeDB Platform UI under the Rancher organization you created earlier before using the Rancher extension, or it won’t work.
