---
title: MariaDB Vertical Scaling Overview
menu:
  docs_v2026.7.10:
    identifier: guides-mariadb-scaling-vertical-overview
    name: Overview
    parent: guides-mariadb-scaling-vertical
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# MariaDB Vertical Scaling

This guide will give an overview on how KubeDB Ops Manager vertically scales up `MariaDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2026.7.10/guides/mariadb/concepts/mariadb/)
  - [MariaDBOpsRequest](/docs/v2026.7.10/guides/mariadb/concepts/opsrequest/)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `MariaDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of MariaDB" src="/docs/v2026.7.10/guides/mariadb/scaling/vertical-scaling/overview/images/vertical-scaling.jpg">
<figcaption align="center">Fig: Vertical scaling process of MariaDB</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `MariaDB` CR.

3. When the operator finds a `MariaDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `MariaDB` database the user creates a `MariaDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it halts the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the vertical scaling process.  

7. Then the `KubeDB` Enterprise operator will update resources of the PetSet Pods to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Enterprise operator updates the `MariaDB` object to reflect the updated state.

9. After the successful update  of the `MariaDB` resources, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator resumes its usual operations.

## Vertical Scaling Modes

KubeDB actuates vertical scaling in one of two modes, selected through the `spec.verticalScaling.mode`
field of the `MariaDBOpsRequest`:

- **`Restart`** (default): The operator patches the `PetSet` with the new resources and restarts the
  Pods (one at a time, honoring the database's failover rules) so they come back with the updated CPU
  and Memory. This works on every Kubernetes cluster.
- **`InPlace`**: The operator resizes the running containers in place using the Kubernetes
  [in-place Pod resize](https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/)
  (`pods/resize` subresource) — no Pod restart, so scaling happens without downtime or failover. If a
  Node cannot accommodate the new resources (the resize is reported `Infeasible`), the operator
  automatically falls back to the `Restart` behavior for that Pod. For a **distributed** `MariaDB`
  deployment, in-place resize is not possible, so `InPlace` automatically degrades to `Restart`.

If `spec.verticalScaling.mode` is omitted, it defaults to `Restart`.

> **Note:** `InPlace` mode relies on the Kubernetes `InPlacePodVerticalScaling` feature gate, which is
> enabled by default from Kubernetes v1.33. On older clusters, or when the feature gate is disabled,
> use `Restart` mode.

In the next docs, we are going to show a step by step guide on updating resources of MariaDB database using `MariaDBOpsRequest` CRD.