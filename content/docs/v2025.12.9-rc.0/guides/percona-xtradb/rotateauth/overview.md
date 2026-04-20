---
title: Rotate Authentication Overview
menu:
  docs_v2025.12.9-rc.0:
    identifier: perconaxtradb-rotate-auth-overview
    name: Overview
    parent: guides-perconaxtradb-rotate-auth
    weight: 5
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

# Rotate Authentication of PerconaXtraDB

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [PerconaXtraDB](/docs/v2025.12.9-rc.0/guides/percona-xtradb/concepts/perconaxtradb/)
    - [PerconaXtraDBOpsRequest](/docs/v2025.12.9-rc.0/guides/percona-xtradb/concepts/opsrequest/)

## How Rotate PerconaXtraDB Authentication Configuration Process Works

[//]: # (The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `PerconaXtraDB`. Open the image in a new tab to see the enlarged version.)

[//]: # ()
[//]: # (<figure align="center">)

[//]: # (  <img alt="Rotate Authentication process of PerconaXtraDB" src="/docs/v2025.12.9-rc.0/images/day-2-operation/PerconaXtraDB/kf-rotate-auth.svg">)

[//]: # (<figcaption align="center">Fig: Rotate Auth process of PerconaXtraDB</figcaption>)

[//]: # (</figure>)

The authentication rotation process for PerconaXtraDB using KubeDB involves the following steps:

1. A user first creates a `PerconaXtraDB` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `PerconaXtraDB` CROs.

3. When the operator detects a `PerconaXtraDB` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `PerconaXtraDBOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `PerconaXtraDBOpsRequest` CRs.

6. Upon detecting a `PerconaXtraDBOpsRequest`, the operator pauses the referenced `PerconaXtraDB` object, ensuring that the Provisioner
   operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `PerconaXtraDBOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `PerconaXtraDB` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `PerconaXtraDB` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating PerconaXtraDB authentication using the `PerconaXtraDBOpsRequest` CRD.
