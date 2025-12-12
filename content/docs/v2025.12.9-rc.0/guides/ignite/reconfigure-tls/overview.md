---
title: Reconfiguring TLS of Ignite
menu:
  docs_v2025.12.9-rc.0:
    identifier: ig-reconfigure-tls-overview
    name: Overview
    parent: ig-reconfigure-tls
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

# Reconfiguring TLS of Ignite Database

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `Ignite` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Ignite](/docs/v2025.12.9-rc.0/guides/ignite/concepts/ignite)
  - [IgniteOpsRequest](/docs/v2025.12.9-rc.0/guides/ignite/concepts/opsrequest)

## How Reconfiguring Ignite TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Ignite` database. Open the image in a new tab to see the enlarged version.

The Reconfiguring Ignite TLS process consists of the following steps:

1. At first, a user creates a `Ignite` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Ignite` CRO.

3. When the operator finds a `Ignite` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Ignite` database the user creates a `IgniteOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `IgniteOpsRequest` CR.

6. When it finds a `IgniteOpsRequest` CR, it pauses the `Ignite` object which is referred from the `IgniteOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Ignite` object during the reconfiguring TLS process.  

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `IgniteOpsRequest` CR.

9. After the successful reconfiguring of the `Ignite` TLS, the `KubeDB` Ops-manager operator resumes the `Ignite` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a Ignite database using `IgniteOpsRequest` CRD.