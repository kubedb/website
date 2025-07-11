---
title: Reconfiguring PgBouncer
menu:
  docs_v2025.5.30:
    identifier: pb-reconfigure-overview
    name: Overview
    parent: pb-reconfigure
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

# Reconfiguring PgBouncer

This guide will give an overview on how KubeDB Ops-manager operator reconfigures `PgBouncer`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PgBouncer](/docs/v2025.5.30/guides/pgbouncer/concepts/pgbouncer)
  - [PgBouncerOpsRequest](/docs/v2025.5.30/guides/pgbouncer/concepts/opsrequest)

## How Reconfiguring PgBouncer Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures `PgBouncer`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of PgBouncer" src="/docs/v2025.5.30/images/day-2-operation/pgbouncer/reconfiguring.png">
<figcaption align="center">Fig: Reconfiguring process of PgBouncer</figcaption>
</figure>

The Reconfiguring PgBouncer process consists of the following steps:

1. At first, a user creates a `PgBouncer` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `PgBouncer` CR.

3. When the operator finds a `PgBouncer` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure of the `PgBouncer`, the user creates a `PgBouncerOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `PgBouncerOpsRequest` CR.

6. When it finds a `PgBouncerOpsRequest` CR, it pauses the `PgBouncer` object which is referred from the `PgBouncerOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `PgBouncer` object during the reconfiguring process.  

7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `PgBouncerOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will perform reload operation in each Pod so that the desired configuration will replace the old configuration.

9. After the successful reconfiguring of the `PgBouncer`, the `KubeDB` Ops-manager operator resumes the `PgBouncer` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on reconfiguring PgBouncer database components using `PgBouncerOpsRequest` CRD.