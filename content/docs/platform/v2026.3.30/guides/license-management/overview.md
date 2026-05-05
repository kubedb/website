---
layout: docs
menu:
  docsplatform_v2026.3.30:
    identifier: license-management-overview
    name: Overview
    parent: license-management
    weight: 10
menu_name: docsplatform_v2026.3.30
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.3.30
---

## Overview <br>

The AppsCode License Management System simplifies managing product licenses for Kubernetes deployments. It offers a centralized billing console for efficient license administration and secure validation, supporting both online and offline modes to suit various needs.

This guide explores the Billing Console, covering its key components, contract management, license-proxyserver deployment, and troubleshooting tips for common issues. By the end, you’ll know how to effectively manage licenses with this tool.

**Target Audience:** This guide is intended for `administrators` and `personnel` responsible for managing AppsCode's product licenses.

## AppsCode Billing Console <br>

A centralized web-based platform serving as the primary interface for licensing operations in the AppsCode ecosystem. Hosted on [AppsCode Billing Console](https://appsCode.com/billing), this self-managed system allows customers to manage `contracts` by associating clusters, generating `license-proxyserver` installers and tracking clusters for which licenses are generated.

While AppsCode administrators are responsible for the core lifecycle of contracts—including their `creation`, `modification`, `revocation`, and `extension`—customers retain the ability to perform specific operations pertinent to the licensing lifecycle. This includes `associating` and `disassociating` their Kubernetes clusters with allocated contracts, generating `installers` for the `license-proxyserver` through the console, and track the `clusters` for which licenses have been issued.

![home-billing-console](../images/home-billing-console.png)

### Key Components

- **Contracts:** Digital agreements, typically established by [AppsCode administrators](https://appsCode.com/contact/) within the Billing Console, that define the terms of AppsCode's product (e.g., ACE, KubeDB, KubeStash, KubeVault etc.) usage. This includes the specific AppsCode products which can be licensed, the duration of the contract, applicable features, and the clusters authorized to use these licenses. Contracts ensure that usage aligns with legal and financial terms, providing a foundation for all subsequent actions in the console. Contracts can be configured for either online or offline license validation.
<br> <br>
- **Licensed cluster:** The `Licensed Cluster` section within the AppsCode Billing Console offers a comprehensive overview and detailed management capabilities for Kubernetes clusters that have been issued AppsCode product licenses. This component is pivotal for administrators to monitor the cluster(s) `licences` and `events` of licensed products across their infrastructure.
<br> <br>
- **License Proxy Server:** A lightweight in-cluster component that validates licenses, either by connecting to AppsCode servers (online) or using preloaded licenses (offline). The console generates customized installers for deployment. Depending on the contract type (`online` or `offline`), it either periodically refreshes and validates licenses with AppsCode's central licensing servers or uses static preloaded licenses embedded during deployment for the full contract duration.

These components work together to provide a seamless experience for license administrators, allowing them to efficiently manage the entire licensing `lifecycle` from a single interface. For instance, AppsCode's administrator creates a contract for KubeDB, and associates the contract to the target customer. Then from the customer panel, the customer can add a cluster to it, generates a customized installer for the `license-proxyserver`, deploys it to the cluster, and then monitors usage—all within the Billing Console. This integrated workflow eliminates the need for disparate tools or manual processes, saving time and reducing errors.
