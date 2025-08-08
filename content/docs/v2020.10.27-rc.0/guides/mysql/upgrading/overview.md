---
title: Upgrading MySQL Overview
menu:
  docs_v2020.10.27-rc.0:
    identifier: my-upgrading-overview
    name: Overview
    parent: my-upgrading-mysql
    weight: 10
menu_name: docs_v2020.10.27-rc.0
section_menu_id: guides
info:
  cli: v0.14.0-beta.6
  community: v0.14.0-beta.6
  enterprise: v0.1.0-beta.6
  installer: v0.14.0-beta.6
  version: v2020.10.27-rc.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.27-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2020.10.27-rc.0/setup/install/enterprise) to try this feature." >}}

# Upgrading MySQL version Overview

This guide will give you an overview of how KubeDB enterprise operator upgrades the version of `MySQL` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2020.10.27-rc.0/guides/mysql/concepts/mysql)
  - [MySQLOpsRequest](/docs/v2020.10.27-rc.0/guides/mysql/concepts/opsrequest)

## How Upgrade Process Works

The following diagram shows how KubeDB enterprise operator used to upgrade the version of `MySQL`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Stash Backup Flow" src="/docs/v2020.10.27-rc.0/images/day-2-operation/mysql/my-upgrading.png">
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