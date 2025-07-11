---
title: PgBouncer Vertical Scaling Overview
menu:
  docs_v2025.5.30:
    identifier: pb-vertical-scaling-overview
    name: Overview
    parent: pb-vertical-scaling
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# PgBouncer Vertical Scaling

This guide will give an overview on how KubeDB Ops-manager operator updates the resources(for example CPU and Memory etc.) of the `PgBouncer`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PgBouncer](/docs/v2025.5.30/guides/pgbouncer/concepts/pgbouncer)
  - [PgBouncerOpsRequest](/docs/v2025.5.30/guides/pgbouncer/concepts/opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator updates the resources of the `PgBouncer`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of PgBouncer" src="/docs/v2025.5.30/images/day-2-operation/pgbouncer/vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of PgBouncer</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `PgBouncer` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `PgBouncer` CR.

3. When the operator finds a `PgBouncer` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `PgBouncer`, the user creates a `PgBouncerOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `PgBouncerOpsRequest` CR.

6. When it finds a `PgBouncerOpsRequest` CR, it pauses the `PgBouncer` object which is referred from the `PgBouncerOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `PgBouncer` object during the vertical scaling process.  

7. Then the `KubeDB` Ops-manager operator will update resources of the PetSet to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Ops-manager operator updates the `PgBouncer` object to reflect the updated state.

9. After the successful update  of the `PgBouncer` resources, the `KubeDB` Ops-manager operator resumes the `PgBouncer` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on updating resources of PgBouncer `PgBouncerOpsRequest` CRD.