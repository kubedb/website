---
title: Rotate Authentication Overview
menu:
  docs_v2025.10.17:
    identifier: pp-rotate-auth-overview
    name: Overview
    parent: pp-rotate-auth
    weight: 5
menu_name: docs_v2025.10.17
section_menu_id: guides
info:
  autoscaler: v0.44.0
  cli: v0.59.0
  dashboard: v0.35.0
  installer: v2025.10.17
  ops-manager: v0.46.0
  provisioner: v0.59.0
  schema-manager: v0.35.0
  ui-server: v0.35.0
  version: v2025.10.17
  webhook-server: v0.35.0
---

> New to KubeDB? Please start [here](/docs/v2025.10.17/README).

# Rotate Authentication of Pgpool

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Pgpool](/docs/v2025.10.17/guides/pgpool/concepts/pgpool)
    - [PgpoolOpsRequest](/docs/v2025.10.17/guides/pgpool/concepts/opsrequest)

## How Rotate Pgpool Authentication Configuration Process Works

[//]: # (The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `Pgpool`. Open the image in a new tab to see the enlarged version.)

[//]: # ()
[//]: # (<figure align="center">)

[//]: # (  <img alt="Rotate Authentication process of Pgpool" src="/docs/v2025.10.17/images/day-2-operation/Pgpool/kf-rotate-auth.svg">)

[//]: # (<figcaption align="center">Fig: Rotate Auth process of Pgpool</figcaption>)

[//]: # (</figure>)

The authentication rotation process for Pgpool using KubeDB involves the following steps:

1. A user first creates a `Pgpool` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `Pgpool` CROs.

3. When the operator detects a `Pgpool` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `PgpoolOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `PgpoolOpsRequest` CRs.

6. Upon detecting a `PgpoolOpsRequest`, the operator pauses the referenced `Pgpool` object, ensuring that the Provisioner
   operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `PgpoolOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `Pgpool` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `Pgpool` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating Pgpool authentication using the `PgpoolOpsRequest` CRD.
