---
title: FerretDB Vertical Scaling Overview
menu:
  docs_v2025.4.30:
    identifier: fr-vertical-scaling-overview
    name: Overview
    parent: fr-vertical-scaling
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# FerretDB Vertical Scaling

This guide will give an overview on how KubeDB Ops-manager operator updates the resources(for example CPU and Memory etc.) of the `FerretDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [FerretDB](/docs/v2025.4.30/guides/ferretdb/concepts/ferretdb)
    - [FerretDBOpsRequest](/docs/v2025.4.30/guides/ferretdb/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator updates the resources of the `FerretDB`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of FerretDB" src="/docs/v2025.4.30/images/ferretdb/fr-vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of FerretDB</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `FerretDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `FerretDB` CR.

3. When the operator finds a `FerretDB` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `FerretDB`, the user creates a `FerretDBOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `FerretDBOpsRequest` CR.

6. When it finds a `FerretDBOpsRequest` CR, it pauses the `FerretDB` object which is referred from the `FerretDBOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `FerretDB` object during the vertical scaling process.

7. Then the `KubeDB` Ops-manager operator will update resources of the PetSet to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Ops-manager operator updates the `FerretDB` object to reflect the updated state.

9. After the successful update  of the `FerretDB` resources, the `KubeDB` Ops-manager operator resumes the `FerretDB` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on updating resources of FerretDB `FerretDBOpsRequest` CRD.