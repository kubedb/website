---
title: Pgpool Vertical Scaling Overview
menu:
  docs_v2025.12.9-rc.0:
    identifier: pp-vertical-scaling-overview
    name: Overview
    parent: pp-vertical-scaling
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

# Pgpool Vertical Scaling

This guide will give an overview on how KubeDB Ops-manager operator updates the resources(for example CPU and Memory etc.) of the `Pgpool`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Pgpool](/docs/v2025.12.9-rc.0/guides/pgpool/concepts/pgpool)
  - [PgpoolOpsRequest](/docs/v2025.12.9-rc.0/guides/pgpool/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator updates the resources of the `Pgpool`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Pgpool" src="/docs/v2025.12.9-rc.0/images/day-2-operation/pgpool/pp-vertical-scaling.png">
<figcaption align="center">Fig: Vertical scaling process of Pgpool</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `Pgpool` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Pgpool` CR.

3. When the operator finds a `Pgpool` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `Pgpool`, the user creates a `PgpoolOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `PgpoolOpsRequest` CR.

6. When it finds a `PgpoolOpsRequest` CR, it pauses the `Pgpool` object which is referred from the `PgpoolOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Pgpool` object during the vertical scaling process.  

7. Then the `KubeDB` Ops-manager operator will update resources of the PetSet to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Ops-manager operator updates the `Pgpool` object to reflect the updated state.

9. After the successful update  of the `Pgpool` resources, the `KubeDB` Ops-manager operator resumes the `Pgpool` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on updating resources of Pgpool `PgpoolOpsRequest` CRD.