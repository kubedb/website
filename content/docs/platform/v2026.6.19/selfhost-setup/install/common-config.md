---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: selfhost-common-config
    name: Common Configurations
    parent: selfhosted-installer
    weight: 1
menu_name: docsplatform_v2026.6.19
section_menu_id: selfhost-setup
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Common Configuration Sections

Several configuration sections of the installer wizard are identical across all
Self-Hosted deployment modes. They are documented here once and referenced from
each mode-specific guide. Use the links in those guides to jump to the relevant
section below.

## Registry

KubeDB Platform requires access to various container registries and Helm repositories to pull necessary images and charts.

**Docker Registry:** Go to the docker registry section first then look for the following settings
* **Proxies:** Put registry name for Appscode `r.appscode.com` and other Public Registries like Docker Hub, GitHub Container Registry (`ghcr.io`), Kubernetes Registry, Microsoft (`mcr.microsoft.com`), and Quay.
* **Helm Repositories:** In the helm repositories section put your helm repository url
If using private or authenticated registries, provide:
* **Credentials:** Username and Password.
* **Certs:** Upload CA Cert, Client Cert, and Client Key if required for mutual TLS.
* **Image Pull Secrets:** Define the secrets used by the cluster to authenticate with the registries. You can enable create namespace during helm install, allow nondistributable artifacts and insecure option for insecure registry

## Monitoring

Use the **Monitoring** section to configure Alertmanager notifications for platform alerts for the site admin.

* **Alert Manager Email:** Enable email notifications for Alertmanager alerts.
  * **Enable Email:** Turns email notifications on or off.
  * **To:** The recipient email address. For Gmail, you can also use plus addressing such as `user+alerts@example.com`.
  * **From:** The sender email address shown in the message. For Gmail, use the same address as **Auth Username** unless you have configured a verified alias.
  * **Smarthost:** The SMTP server address. For Gmail, use `smtp.gmail.com:587`.
  * **Auth Username:** The SMTP login username. For Gmail, this should be the real Gmail or Google Workspace mailbox used to authenticate.
  * **Password:** The SMTP password. For Gmail, use an App Password generated from `https://myaccount.google.com/apppasswords`.
  * **Require TLS:** Enables TLS for the SMTP connection. Leave this enabled for Gmail.
  * **Send Resolved:** Sends a follow-up notification when an alert returns to a healthy state.
* **Alert Manager Webhook:** Send alerts to an endpoint that accepts Alertmanager's generic webhook payload.
  * **Enable Webhook:** Turns webhook delivery on or off.
  * **URL:** The destination webhook URL. Some systems embed the secret directly in the URL.
  * **Send Resolved:** Sends a follow-up notification when an alert returns to a healthy state.

<br/>

![Monitoring Alertmanager](../../images/monitoring-alertmanager.png)

> **Tip:** For Google Chat, a supported workaround is to generate a space email address in Google Chat settings and use that address in the **To** field.

## TLS

Configure TLS certificates for secure communication. You can choose the Issuer type from the following list.
  * **External**: Use this if you already have certificates from an external provider.
      * CA CERT: Paste the Certificate Authority certificate.
      * Certificate CERT: Paste the certificate issued for your domain.
      * Certificate Key: Paste the private key associated with the certificate.

  * **CA:** Use this if you want AppsCode to manage your certificates with its internal CA.
      * CA CERT: Paste the internal CA certificate.
      * CA Key: Paste the internal CA key.

## NATS

Configure NATS, which is used as the internal messaging system for the platform.

**Expose Via:**
  Choose how NATS will be exposed:

  * **HostPort:** Exposes NATS directly on the node’s network interface.

    * **Node Selector:** Specify the node label (Key and Value) to control where NATS will be scheduled.
  * **Ingress:** Use this option to expose NATS externally via an ingress controller.
**Replicas:** For production, ensure at least 1 replica is active (consider 3 for high availability).
**Resources:** Configure CPU Requests, CPU Limits, Memory Request and  Memory Limit

<br/>

![Nats](../../images/nats.png)

## Branding & UI Customization

Administrators can globally re-brand the KubeDB Platform interface to match corporate identity.

* **App Name:** Changes the browser tab title.
* **Primary Color:** Enter a Hex code (default: `#009948`).
* **Assets:**
    * **Logo:** Upload a 200x30px image (SVG/PNG recommended).
    * **Favicon:** Upload a 20KB icon file.
* **App Tag:** Toggle **"Show App Tag"** to display or hide the version/tagging info in the UI.

<br/>

![Branding](../../images/branding.png)


## Prerequisites

Before you begin, please ensure your Kubernetes cluster meets the following minimum system requirements:
* **Worker Nodes**: At least one dedicated worker node.
* **CPU**: 4–6 vCPUs.
* **Memory**: 16 GB of RAM.
* **Networking**: A routable IP address for external connectivity.

You will get an instruction to deploy a k3s cluster in Ubuntu VM, or you can skip this step if you already have a cluster.

## Global Administrative Settings

These credentials define the primary super-user and the initial organizational structure.

* **System Admin:** In this section, provide the administrator's following information.
  - **Admin Account Display Name:** The display name for the administrator account.
  - **Admin Account Email:** The email address for the administrator account.
  - **Admin Account Password:** The password for the administrator account. You may manually set a password or leave it blank to allow the system to **auto-generate** a secure administrative password.
  - **Initial Organization Name:** You can choose what will be the initial organization name for your account

<br/>

![Admin Setting](../../images/admin-setting.png)

## Additional configuration for EKS cluster

**Prerequisite:**
* EBS CSI Driver must be installed
* AWS Load Balancer Controller must be installed

Run the following command to get the Kube API Server and put it in the API server field:

```
aws eks describe-cluster --name <cluster-name> --region <region> --query "cluster.endpoint" --output text
```

Run the following command to get the Subnet IDs and add them:

```
aws ec2 describe-subnets --filters "Name=vpc-id,Values=$(aws eks describe-cluster --name <cluster-name> --region <region> --query "cluster.resourcesVpcConfig.vpcId" --output text)" "Name=map-public-ip-on-launch,Values=true" --region <region> --query "Subnets[*].SubnetId" --output text
```

**Subnet IDs:** Make sure you have added the allocation id of Target IP as well. Run the following command to create EIP Allocation IDs `aws ec2 allocate-address --region <region>`

**EIP Allocation IDs:** Give EIP allocation IDs for your public subnets.

## Domain White List and Proxy Servers

* Add domain one by one for whitelisting
* **Proxy Servers:** If you have proxy servers then put **HTTP Proxy**, **HTTPS Proxy** and **No Proxy**
* Put Login and Logout URL for your app

<br/>

![Domain Whitelisting](../../images/domain-whitelisting.png)

## Ingress & Gateway

Configure how the application is exposed to the internet or your internal network.

* **Ingress & Gateway:** Enable either the **Gateway API** or standard **Ingress**.

<br/>

![Ingress Gateway](../../images/ingress-gateway.png)

## Self Management

In this section you can enable or disable features.

<br/>

![Features](../../images/features.png)
