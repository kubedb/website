---
title: FerretDB Horizontal Scaling Overview
menu:
  docs_v2025.2.6-rc.0:
    identifier: fr-horizontal-scaling-overview
    name: Overview
    parent: fr-horizontal-scaling
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

# FerretDB Horizontal Scaling

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `FerretDB` replicas of PetSet.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [FerretDB](/docs/v2025.2.6-rc.0/guides/ferretdb/concepts/ferretdb)
    - [FerretDBOpsRequest](/docs/v2025.2.6-rc.0/guides/ferretdb/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator scales up or down `FerretDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of FerretDB" src="/docs/v2025.2.6-rc.0/images/ferretdb/fr-horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of FerretDB</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `FerretDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `FerretDB` CR.

3. When the operator finds a `FerretDB` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `PetSet` of the `FerretDB` database the user creates a `FerretDBOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `FerretDBOpsRequest` CR.

6. When it finds a `FerretDBOpsRequest` CR, it pauses the `FerretDB` object which is referred from the `FerretDBOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `FerretDB` object during the horizontal scaling process.

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `FerretDBOpsRequest` CR.

8. After the successfully scaling the replicas of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `FerretDB` object to reflect the updated state.

9. After the successful scaling of the `FerretDB` replicas, the `KubeDB` Ops-manager operator resumes the `FerretDB` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on horizontal scaling of FerretDB using `FerretDBOpsRequest` CRD.