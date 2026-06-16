---
layout: docs
menu:
  docsplatform_v2026.5.22:
    identifier: account-management-siteadmin-ace-upgrade
    name: KubeDB Platform Upgrade
    parent: account-management-siteadmin
    weight: 60
menu_name: docsplatform_v2026.5.22
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.5.22
---

# KubeDB Platform Upgrade

Site administrators can upgrade the KubeDB Platform management cluster directly from the platform UI by uploading a configuration file downloaded from the AppsCode portal.

---

## Prerequisites

Before starting the upgrade, download the required values file from the AppsCode portal:

1. Log in to [appscode.com](https://appscode.com) and switch to your organization.
2. Locate the installer currently in use and click **View Details**, then select **Upgrade**.
3. Click **Download** to save the archive to your local machine. It contains the `values.yaml` file needed for the upgrade.

---

## Step 1 — Open KubeDB Platform Upgrade

![KubeDB Platform Version Page](../../images/upgrade-version-1.png)

Go to **SITE ADMINISTRATION > KubeDB Platform Upgrade** from the left-hand menu.

The page displays the current KubeDB Platform version and the upgrade status of all platform components. Click the **Upgrade Version** button at the top right to begin.

---

## Step 2 — Upload the Values File

![Upload Values File](../../images/upgrade-version-2.png)

On the **Upgrade KubeDB Platform** screen:

- Click **Upload values file...** and select the `values.yaml` file downloaded from the AppsCode portal.
- Click **Update Version** to start the upgrade process.

---

## Step 3 — Monitor Upgrade Progress

![Upgrade In Progress](../../images/upgrade-version-3.png)

The platform will upgrade individual components one by one. You can track progress directly on this page:

- Components currently being updated show a **refresh icon**.
- Completed components show a **green checkmark**.
- The overall status displays as **Progressing** while the upgrade is running.

---

## Step 4 — Verify Completion

![Upgrade Complete](../../images/upgrade-version-4.png)

Once all components have been updated, the status changes to **Updated**. Confirm that the new version number is correctly reflected at the top of the page.
