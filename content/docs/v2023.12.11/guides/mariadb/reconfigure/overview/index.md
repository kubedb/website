---
title: Reconfiguring MariaDB
menu:
  docs_v2023.12.11:
    identifier: guides-mariadb-reconfigure-overview
    name: Overview
    parent: guides-mariadb-reconfigure
    weight: 10
menu_name: docs_v2023.12.11
section_menu_id: guides
info:
  autoscaler: v0.23.0
  cli: v0.38.0
  dashboard: v0.14.0
  installer: v2023.12.11
  ops-manager: v0.25.0
  provisioner: v0.38.0
  schema-manager: v0.14.0
  ui-server: v0.14.0
  version: v2023.12.11
  webhook-server: v0.14.0
---

> New to KubeDB? Please start [here](/docs/v2023.12.11/README).

# Reconfiguring MariaDB

This guide will give an overview on how KubeDB Ops Manger reconfigures `MariaDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2023.12.11/guides/mariadb/concepts/mariadb)
  - [MariaDBOpsRequest](/docs/v2023.12.11/guides/mariadb/concepts/opsrequest)

## How Reconfiguring MariaDB Process Works

The following diagram shows how KubeDB Ops Manager reconfigures `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of MariaDB" src="/docs/v2023.12.11/guides/mariadb/reconfigure/overview/images/reconfigure.jpeg">
<figcaption align="center">Fig: Reconfiguring process of MariaDB</figcaption>
</figure>

The Reconfiguring MariaDB process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `MariaDB` standalone or cluster the user creates a `MariaDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it halts the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the reconfiguring process.  

7. Then the `KubeDB` Enterprise operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `MariaDBOpsRequest` CR.

8. Then the `KubeDB` Enterprise operator will restart the related StatefulSet Pods so that they restart with the new configuration defined in the `MariaDBOpsRequest` CR.

9. After the successful reconfiguring of the `MariaDB`, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring MariaDB database components using `MariaDBOpsRequest` CRD.