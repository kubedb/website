---
title: Updating MariaDB Overview
menu:
  docs_v2025.4.30:
    identifier: guides-mariadb-updating-overview
    name: Overview
    parent: guides-mariadb-updating
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# updating MariaDB version Overview

This guide will give you an overview on how KubeDB Ops Manager update the version of `MariaDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2025.4.30/guides/mariadb/concepts/mariadb)
  - [MariaDBOpsRequest](/docs/v2025.4.30/guides/mariadb/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops Manager used to update the version of `MariaDB`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of MariaDB" src="/docs/v2025.4.30/guides/mariadb/update-version/overview/images/mdops-update.jpeg">
<figcaption align="center">Fig: updating Process of MariaDB</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `MariaDB` database the user creates a `MariaDBOpsRequest` CR with the desired version.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it halts the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the updating process.  

7. By looking at the target version from `MariaDBOpsRequest` CR, `KubeDB` Enterprise operator updates the images of all the `PetSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Enterprise operator updates the image of the `MariaDB` object to reflect the updated state of the database.

9. After successfully updating of `MariaDB` object, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a MariaDB database using update operation.