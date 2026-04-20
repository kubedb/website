---
title: Reconfiguring MSSQLServer
menu:
  docs_v2025.2.6-rc.0:
    identifier: ms-reconfigure-overview
    name: Overview
    parent: ms-reconfigure
    weight: 10
menu_name: docs_v2025.2.6-rc.0
section_menu_id: guides
info:
  autoscaler: v0.37.0-rc.0
  cli: v0.52.0-rc.0
  dashboard: v0.28.0-rc.0
  installer: v2025.2.6-rc.0
  ops-manager: v0.39.0-rc.0
  provisioner: v0.52.0-rc.0
  schema-manager: v0.28.0-rc.0
  ui-server: v0.28.0-rc.0
  version: v2025.2.6-rc.0
  webhook-server: v0.28.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.2.6-rc.0/README).

# Reconfiguring SQL Server

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `MSSQLServer` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MSSQLServer](/docs/v2025.2.6-rc.0/guides/mssqlserver/concepts/mssqlserver)
  - [MSSQLServerOpsRequest](/docs/v2025.2.6-rc.0/guides/mssqlserver/concepts/opsrequest)

## How Reconfiguring MSSQLServer Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `MSSQLServer` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of MSSQLServer" src="/docs/v2025.2.6-rc.0/images/day-2-operation/mssqlserver/ms-reconfigure.png">
<figcaption align="center">Fig: Reconfiguring process of MSSQLServer</figcaption>
</figure>

The Reconfiguring MSSQLServer process consists of the following steps:

1. At first, a user creates a `MSSQLServer` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `MSSQLServer` CR.

3. When the operator finds a `MSSQLServer` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `MSSQLServer` database the user creates a `MSSQLServerOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `MSSQLServerOpsRequest` CR.

6. When it finds a `MSSQLServerOpsRequest` CR, it halts the `MSSQLServer` object which is referred from the `MSSQLServerOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `MSSQLServer` object during the reconfiguring process.  

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MSSQLServerOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `MSSQLServerOpsRequest` CR.

9. After the successful reconfiguring of the `MSSQLServer`, the `KubeDB` Ops-manager operator resumes the `MSSQLServer` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on reconfiguring MSSQLServer database using `MSSQLServerOpsRequest` CR.