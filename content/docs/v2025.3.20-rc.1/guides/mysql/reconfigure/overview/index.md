---
title: Reconfiguring MySQL
menu:
  docs_v2025.3.20-rc.1:
    identifier: guides-mysql-reconfigure-overview
    name: Overview
    parent: guides-mysql-reconfigure
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
info:
  autoscaler: v0.37.0-rc.1
  cli: v0.53.0-rc.1
  dashboard: v0.29.0-rc.1
  installer: v2025.3.20-rc.1
  ops-manager: v0.39.0-rc.1
  provisioner: v0.53.0-rc.1
  schema-manager: v0.29.0-rc.1
  ui-server: v0.29.0-rc.1
  version: v2025.3.20-rc.1
  webhook-server: v0.29.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.3.20-rc.1/README).

### Reconfiguring MySQL

This guide will give an overview on how KubeDB Ops Manager reconfigures `MySQL`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2025.3.20-rc.1/guides/mysql/concepts/)
  - [MySQLOpsRequest](/docs/v2025.3.20-rc.1/guides/mysql/concepts/opsrequest)

## How Reconfiguring MySQL Process Works

The following diagram shows how KubeDB Ops Manager reconfigures `MySQL` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of MySQL" src="/docs/v2025.3.20-rc.1/guides/mysql/reconfigure/overview/reconfigure.jpg">
<figcaption align="center">Fig: Reconfiguring process of MySQL</figcaption>
</figure>

The Reconfiguring MySQL process consists of the following steps:

1. At first, a user creates a `MySQL` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MySQL` CR.

3. When the operator finds a `MySQL` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `MySQL` standalone or cluster the user creates a `MySQLOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MySQLOpsRequest` CR.

6. When it finds a `MySQLOpsRequest` CR, it halts the `MySQL` object which is referred from the `MySQLOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MySQL` object during the reconfiguring process.  
   
7. Then the `KubeDB` Enterprise operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MySQLOpsRequest` CR.

8. Then the `KubeDB` Enterprise operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `MySQLOpsRequest` CR.

9. After the successful reconfiguring of the `MySQL`, the `KubeDB` Enterprise operator resumes the `MySQL` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring MySQL database components using `MySQLOpsRequest` CRD.