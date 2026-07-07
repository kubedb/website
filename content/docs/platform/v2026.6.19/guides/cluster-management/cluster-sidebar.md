---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-sidebar
    name: Customize Cluster Sidebar
    parent: cluster-management
    weight: 60
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Customize the Cluster Sidebar

The **Cluster Sidebar** is the navigation panel inside a connected cluster. By default it shows a set of Kubernetes workloads and AppsCode custom resources. The **Sidebar Settings** page lets you customize which menu items appear.

---

## Step 1 — Open the Cluster Overview

From the platform console, click on your cluster (e.g., `default`) to open the **Cluster Overview** page. The left sidebar shows the default set of sections: **Kubernetes**, **Workloads**, **Helm**, **Datastore**, **Service & Discovery**, **Config**, **Storage**, **Monitoring**, **Security**, and **Admin**.

![The default Cluster Overview page with the default sidebar navigation](../images/cluster-sidebar/sidebar-before-update.png)

> **Tip:** The default sidebar already covers the most common resources. You only need to open Sidebar Settings if you want to add, remove, or rearrange menu items.

---

## Step 2 — Open Sidebar Settings

Click the **⚙ Gear icon** in the top-right navbar to enter the cluster's **Settings** area. In the left settings menu, click **Sidebar**.

You will land on the **Sidebar Settings** page, which has two main panels:

| Panel | Description |
|---|---|
| **All Available Menus** (left) | Every resource group and kind available to add to your sidebar |
| **Updated List** (right) | The current sidebar layout that is live on your cluster |

At the top-right of the page are two action buttons:
- **Default** — Resets the sidebar back to the original default layout
- **Save** — Saves your current changes

![Sidebar Settings page showing Available Menus on the left and Updated List on the right](../images/cluster-sidebar/sidebar-1.png)

---

## Step 3 — Search for a Resource (Optional)

The **All Available Menus** panel lists hundreds of resource types grouped by API category. To quickly find what you need, use the **search box** (🔍) at the top of that panel.

For example, typing `cert` instantly filters the list and highlights all matches — such as **Cert Manager → Certificate**, **Certificate → CertificateSigningRequest**, and so on. A result counter (e.g., *Found 4 Search Results for 'cert'*) and pagination controls help you navigate through matches.

![Search bar in action — typing "cert" narrows the list and highlights matching resources](../images/cluster-sidebar/sidebar-search-menu.png)

> **Note:** The search is case-insensitive. Matched groups and items are highlighted in green so they stand out clearly.

---

## Step 4 — Add or Rearrange Items (Drag & Drop)

To add a resource to your sidebar, **drag** it from the **All Available Menus** panel on the left and **drop** it into the **Updated List** panel on the right at the position you prefer.

In the example below, the user is dragging **Appscode K8s Management → ProjectQuota** into the current sidebar layout. You can see it appearing as a floating drag indicator (`⠿`) in the left panel.

![Dragging "ProjectQuota" from Available Menus into the Updated List](../images/cluster-sidebar/sidebar-updating.png)

You can also drag existing items within the **Updated List** panel to reorder them according to your workflow preferences.

---

## Step 5 — Save and Verify

Once you are satisfied with your layout, click the green **Save** button in the top-right corner.

The sidebar of the cluster will immediately reflect your changes. In the example below, after saving, the **Appscode K8s Management** group with **ProjectQuota** now appears in the cluster sidebar on the left.

![The Cluster Overview page after saving — the sidebar now shows ProjectQuota under Appscode K8s Management](../images/cluster-sidebar/sidebar-after-update.png)

---

## Quick Reference

| Action | How to do it |
|---|---|
| Open Sidebar Settings | Click the ⚙ icon in the top-right navbar → **Sidebar** |
| Find a resource | Use the 🔍 search box in the **All Available Menus** panel |
| Add a resource to sidebar | Drag it from the left panel into the right panel |
| Remove a resource | Drag it back from the right panel to the left panel |
| Reorder sidebar items | Drag items within the right panel |
| Reset to defaults | Click the **Default** button |
| Apply changes | Click the **Save** button |
