---
title: Updating SingleStore Overview
menu:
  docs_v2025.2.19:
    identifier: guides-sdb-updating-overview
    name: Overview
    parent: guides-sdb-updating
    weight: 10
menu_name: docs_v2025.2.19
section_menu_id: guides
info:
  autoscaler: v0.37.0
  cli: v0.52.0
  dashboard: v0.28.0
  installer: v2025.2.19
  ops-manager: v0.39.0
  provisioner: v0.52.0
  schema-manager: v0.28.0
  ui-server: v0.28.0
  version: v2025.2.19
  webhook-server: v0.28.0
---

> New to KubeDB? Please start [here](/docs/v2025.2.19/README).

# updating SingleStore version Overview

This guide will give you an overview on how KubeDB Ops Manager update the version of `SingleStore` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [SingleStore](/docs/v2025.2.19/guides/singlestore/concepts/singlestore)
  - [SingleStoreOpsRequest](/docs/v2025.2.19/guides/singlestore/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops Manager used to update the version of `SingleStore`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of SingleStore" src="/docs/v2025.2.19/guides/singlestore/update-version/overview/images/sdb-version-update.svg">
<figcaption align="center">Fig: updating Process of SingleStore</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `SingleStore` Custom Resource (CR).

2. `KubeDB` Provisioner operator watches the `SingleStore` CR.

3. When the operator finds a `SingleStore` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `SingleStore` database the user creates a `SingleStoreOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `SingleStoreOpsRequest` CR.

6. When it finds a `SingleStoreOpsRequest` CR, it halts the `SingleStore` object which is referred from the `SingleStoreOpsRequest`. So, the `KubeDB` Provisioner operator doesn't perform any operations on the `SingleStore` object during the updating process.  

7. By looking at the target version from `SingleStoreOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `SingleStore` object to reflect the updated state of the database.

9. After successfully updating of `SingleStore` object, the `KubeDB` Ops-manager operator resumes the `SingleStore` object so that the `KubeDB` Provisioner operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a SingleStore database using update operation.