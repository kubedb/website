---
title: Upgrading MySQL Overview
menu:
  docs_v2021.06.23:
    identifier: guides-mysql-upgrading-overview
    name: Overview
    parent: guides-mysql-upgrading
    weight: 10
menu_name: docs_v2021.06.23
section_menu_id: guides
info:
  autoscaler: v0.4.0
  cli: v0.19.0
  community: v0.19.0
  enterprise: v0.6.0
  installer: v2021.06.23
  version: v2021.06.23
---

> New to KubeDB? Please start [here](/docs/v2021.06.23/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.06.23/setup/install/enterprise) to try this feature." >}}

# Upgrading MySQL version Overview

This guide will give you an overview of how KubeDB enterprise operator upgrades the version of `MySQL` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2021.06.23/guides/mysql/concepts/database/)
  - [MySQLOpsRequest](/docs/v2021.06.23/guides/mysql/concepts/opsrequest/)

## How Upgrade Process Works

The following diagram shows how KubeDB enterprise operator used to upgrade the version of `MySQL`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2021.06.23/guides/mysql/upgrading/overview/images/my-upgrading.png">
<figcaption align="center">Fig: Upgrading Process of MySQL</figcaption>
</figure>

The upgrading process consists of the following steps:

1. At first, a user creates a `MySQL` cr.

2. `KubeDB` community operator watches for the `MySQL` cr.

3. When it finds one, it creates a `StatefulSet` and related necessary stuff like secret, service, etc.

4. Then, in order to upgrade the version of the `MySQL` database the user creates a `MySQLOpsRequest` cr with the desired version.

5. `KubeDB` enterprise operator watches for `MySQLOpsRequest`.

6. When it finds one, it halts the `MySQL` object so that the `KubeDB` community operator doesn't perform any operation on the `MySQL` during the upgrading process.

7. By looking at the target version from `MySQLOpsRequest` cr, `KubeDB` enterprise operator takes one of the following steps:
    - either update the images of the `StatefulSet` for upgrading between patch/minor versions.
    - or creates a new `StatefulSet` using targeted image for upgrading between major versions.

8. After successful upgradation of the `StatefulSet` and its `Pod` images, the `KubeDB` enterprise operator updates the image of the `MySQL` object to reflect the updated cluster state.

9. After successful upgradation of `MySQL` object, the `KubeDB` enterprise operator resumes the `MySQL` object so that the `KubeDB` community operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on upgrading of a MySQL database using upgrade operation.