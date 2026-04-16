---
title: MariaDB Vertical Scaling Overview
menu:
  docs_v2022.08.04-rc.1:
    identifier: guides-mariadb-scaling-vertical-overview
    name: Overview
    parent: guides-mariadb-scaling-vertical
    weight: 10
menu_name: docs_v2022.08.04-rc.1
section_menu_id: guides
info:
  autoscaler: v0.13.0-rc.1
  cli: v0.28.0-rc.1
  dashboard: v0.4.0-rc.1
  installer: v2022.08.04-rc.1
  ops-manager: v0.15.0-rc.1
  provisioner: v0.28.0-rc.1
  schema-manager: v0.4.0-rc.1
  ui-server: v0.4.0-rc.1
  version: v2022.08.04-rc.1
  webhook-server: v0.4.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2022.08.04-rc.1/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.08.04-rc.1/setup/install/enterprise) to try this feature." >}}

# MariaDB Vertical Scaling

This guide will give an overview on how KubeDB Enterprise operator vertically scales up `MariaDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2022.08.04-rc.1/guides/mariadb/concepts/mariadb/)
  - [MariaDBOpsRequest](/docs/v2022.08.04-rc.1/guides/mariadb/concepts/opsrequest/)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Enterprise operator scales up or down `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of MariaDB" src="/docs/v2022.08.04-rc.1/guides/mariadb/scaling/vertical-scaling/overview/images/vertical-scaling.jpg">
<figcaption align="center">Fig: Vertical scaling process of MariaDB</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `MariaDB` database the user creates a `MariaDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it halts the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the vertical scaling process.  

7. Then the `KubeDB` Enterprise operator will update resources of the StatefulSet Pods to reach desired state.

8. After the successful update of the resources of the StatefulSet's replica, the `KubeDB` Enterprise operator updates the `MariaDB` object to reflect the updated state.

9. After the successful update  of the `MariaDB` resources, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of MariaDB database using `MariaDBOpsRequest` CRD.