---
title: MariaDB Storage Autoscaling Overview
menu:
  docs_v2025.2.6-rc.0:
    identifier: mguides-mariadb-autoscaling-storage-overview
    name: Overview
    parent: guides-mariadb-autoscaling-storage
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

# MariaDB Vertical Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage using `mariadbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2025.2.6-rc.0/guides/mariadb/concepts/mariadb)
  - [MariaDBAutoscaler](/docs/v2025.2.6-rc.0/guides/mariadb/concepts/autoscaler)
  - [MariaDBOpsRequest](/docs/v2025.2.6-rc.0/guides/mariadb/concepts/opsrequest)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Autoscaling process of MariaDB" src="/docs/v2025.2.6-rc.0/guides/mariadb/autoscaler/storage/overview/images/mdas-storage.jpeg">
<figcaption align="center">Fig: Storage Autoscaling process of MariaDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Enterprise operator.

5. Then, in order to set up storage autoscaling of the `MariaDB` database the user creates a `MariaDBAutoscaler` CRO with desired configuration.

6. `KubeDB` Autoscaler operator watches the `MariaDBAutoscaler` CRO.

7. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.

8. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `MariaDBOpsRequest` to expand the storage of the database.
9. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CRO.
10. Then the `KubeDB` Enterprise operator will expand the storage of the database component as specified on the `MariaDBOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling storage of various MariaDB database components using `MariaDBAutoscaler` CRD.
