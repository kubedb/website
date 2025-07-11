---
title: Updating MySQL Overview
menu:
  docs_v2025.5.30:
    identifier: guides-mysql-updating-overview
    name: Overview
    parent: guides-mysql-updating
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# updating MySQL version Overview

This guide will give you an overview of how `KubeDB` Ops Manager updates the version of `MySQL` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2025.5.30/guides/mysql/concepts/database/)
  - [MySQLOpsRequest](/docs/v2025.5.30/guides/mysql/concepts/opsrequest/)

## How update Process Works

The following diagram shows how `KubeDB` Ops Manager used to update the version of `MySQL`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2025.5.30/guides/mysql/update-version/overview/images/my-updating.png">
<figcaption align="center">Fig: updating Process of MySQL</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `MySQL` cr.

2. `KubeDB` community operator watches for the `MySQL` cr.

3. When it finds one, it creates a `PetSet` and related necessary stuff like secret, service, etc.

4. Then, in order to update the version of the `MySQL` database the user creates a `MySQLOpsRequest` cr with the desired version.

5. `KubeDB` Ops Manager watches for `MySQLOpsRequest`.

6. When it finds one, it halts the `MySQL` object so that the `KubeDB` community operator doesn't perform any operation on the `MySQL` during the updating process.

7. By looking at the target version from `MySQLOpsRequest` cr, `KubeDB` Ops Manager takes one of the following steps:
    - either update the images of the `PetSet` for updating between patch/minor versions.
    - or creates a new `PetSet` using targeted image for updating between major versions.

8. After successful upgradation of the `PetSet` and its `Pod` images, the `KubeDB` Ops Manager updates the image of the `MySQL` object to reflect the updated cluster state.

9. After successful upgradation of `MySQL` object, the `KubeDB` Ops Manager resumes the `MySQL` object so that the `KubeDB` community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a MySQL database using update operation.