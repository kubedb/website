---
title: Distributed MariaDB Storage Autoscaling Overview
menu:
  docs_v2026.6.19:
    identifier: guides-mariadb-distributed-autoscaling-storage-overview
    name: Overview
    parent: guides-mariadb-distributed-autoscaling-storage
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# Distributed MariaDB Storage Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database storage of a **distributed** MariaDB cluster using `mariadbautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2026.6.19/guides/mariadb/concepts/mariadb)
  - [MariaDBAutoscaler](/docs/v2026.6.19/guides/mariadb/concepts/autoscaler)
  - [MariaDBOpsRequest](/docs/v2026.6.19/guides/mariadb/concepts/opsrequest)
  - [Distributed MariaDB Overview](/docs/v2026.6.19/guides/mariadb/distributed/overview)

## How Storage Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Storage Autoscaling process of MariaDB" src="/docs/v2026.6.19/guides/mariadb/autoscaler/storage/overview/images/mdas-storage.jpeg">
<figcaption align="center">Fig: Storage Autoscaling process of MariaDB</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, the user creates a `PlacementPolicy` Custom Resource (CR) with `monitoring.prometheus.url` configured for each spoke cluster. This allows the autoscaler to monitor storage usage across all clusters where MariaDB pods are running.

2. The user creates a `MariaDB` Custom Resource (CR) with `spec.distributed: true` and a reference to the `PlacementPolicy`.

3. `KubeDB` Community operator watches the `MariaDB` CR.

4. When the operator finds a `MariaDB` CR, it creates required number of `PetSets` and distributes them across spoke clusters as defined by the `PlacementPolicy`.

5. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Enterprise operator.

6. Then, in order to set up storage autoscaling of the `MariaDB` database the user creates a `MariaDBAutoscaler` CRO with desired configuration.

7. `KubeDB` Autoscaler operator watches the `MariaDBAutoscaler` CRO.

8. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases across all spoke clusters to check if storage usage exceeds the specified threshold. It queries the Prometheus endpoints configured per cluster in the `PlacementPolicy` to collect storage metrics.

9. If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `MariaDBOpsRequest` to expand the storage of the database.

10. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CRO.

11. Then the `KubeDB` Enterprise operator will expand the storage of the database component as specified on the `MariaDBOpsRequest` CRO.

> **Key Difference from Non-Distributed Autoscaling**: For distributed MariaDB, the `PlacementPolicy` must include a `monitoring.prometheus.url` for each spoke cluster's `distributionRules` entry. The autoscaler uses these Prometheus endpoints to collect storage usage metrics from pods running across multiple Kubernetes clusters.

In the next docs, we are going to show a step by step guide on Autoscaling storage of a Distributed MariaDB database using `MariaDBAutoscaler` CRD.
