---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: account-management-oauth2apps
    name: Setup OAuth2 Applications
    parent: account-management
    weight: 40
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Application Overview

![OAuth2 Applications Overview](../images/OAuth1.png)

Navigate to **User Settings > Applications** to manage how third-party services interact with your account. This page is divided into two sections:

- **OAuth2 Applications:** A list of applications you have created, where you can **Edit** settings or **Remove** them entirely.
- **Authorized OAuth2 Applications:** A list showing external services you have specifically granted access to your personal account.
- To begin, click the green **\+ Create Application** button

## Create a New Application

![Create New Application](../images/OAuth2.png)

On the creation screen, you must provide the following required information:

- **Application Name:** The name that will identify your application.
- **Redirect URL:** The specific address where users are sent after they authorize the application.
- Click **\+ Create Application** to generate your credentials

## Secure Your Credentials & Customize

![Client Credentials and Customization](../images/OAuth3.png)

Once the application is generated, you will see your **Client ID** and **Client Secret**.

- ⚠️ **Important:** Copy your **Client Secret** immediately using the **Copy Client Secret** link; for security, it will **not be shown again**.
- **Regenerate Secret:** If you lose your secret, use this link to create a new one.
- **Application Icon:** You can personalize your app by dragging and dropping an image (Max size: **1MB**, Max resolution: **4096 x 3072**).
- Click **Save Changes** to apply any updates to the name, URL, or icon

## Confirmation of Success

![Success Notification](../images/OAuth4.png)

After saving your changes or creating an application, a green "Successfully updated" notification will appear at the top of the screen. Your new application will now be visible in the OAuth2 Applications list, ready for use with its assigned Client ID
