---
title: MariaDB Horizontal Scaling Overview
menu:
  docs_v2023.02.28:
    identifier: guides-mariadb-scaling-horizontal-overview
    name: Overview
    parent: guides-mariadb-scaling-horizontal
    weight: 10
menu_name: docs_v2023.02.28
section_menu_id: guides
info:
  autoscaler: v0.17.0
  cli: v0.32.0
  dashboard: v0.8.0
  installer: v2023.02.28
  ops-manager: v0.19.0
  provisioner: v0.32.0
  schema-manager: v0.8.0
  ui-server: v0.8.0
  version: v2023.02.28
  webhook-server: v0.8.0
---

> New to KubeDB? Please start [here](/docs/v2023.02.28/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2023.02.28/setup/install/enterprise) to try this feature." >}}

# MariaDB Horizontal Scaling

This guide will give an overview on how KubeDB Enterprise operator scales up or down `MariaDB Cluster`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2023.02.28/guides/mariadb/concepts/mariadb/)
  - [MariaDBOpsRequest](/docs/v2023.02.28/guides/mariadb/concepts/opsrequest/)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Enterprise operator scales up or down `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of MariaDB" src="/docs/v2023.02.28/guides/mariadb/scaling/horizontal-scaling/overview/images/horizontal-scaling.jpg">
<figcaption align="center">Fig: Horizontal scaling process of MariaDB</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `MariaDB` database the user creates a `MariaDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it pauses the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the horizontal scaling process.  

7. Then the `KubeDB` Enterprise operator will scale the related StatefulSet Pods to reach the expected number of replicas defined in the `MariaDBOpsRequest` CR.

8. After the successfully scaling the replicas of the StatefulSet Pods, the `KubeDB` Enterprise operator updates the number of replicas in the `MariaDB` object to reflect the updated state.

9. After the successful scaling of the `MariaDB` replicas, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of MariaDB database using `MariaDBOpsRequest` CRD.