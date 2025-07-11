---
title: Reconfiguring PerconaXtraDB
menu:
  docs_v2025.6.30:
    identifier: guides-perconaxtradb-reconfigure-overview
    name: Overview
    parent: guides-perconaxtradb-reconfigure
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Reconfiguring PerconaXtraDB

This guide will give an overview on how KubeDB Ops Manager reconfigures `PerconaXtraDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [PerconaXtraDB](/docs/v2025.6.30/guides/percona-xtradb/concepts/perconaxtradb)
  - [PerconaXtraDBOpsRequest](/docs/v2025.6.30/guides/percona-xtradb/concepts/opsrequest)

## How Reconfiguring PerconaXtraDB Process Works

The following diagram shows how KubeDB Ops Manager reconfigures `PerconaXtraDB` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of PerconaXtraDB" src="/docs/v2025.6.30/guides/percona-xtradb/reconfigure/overview/images/reconfigure.jpeg">
<figcaption align="center">Fig: Reconfiguring process of PerconaXtraDB</figcaption>
</figure>

The Reconfiguring PerconaXtraDB process consists of the following steps:

1. At first, a user creates a `PerconaXtraDB` Custom Resource (CR).

2. `KubeDB` Community operator watches the `PerconaXtraDB` CR.

3. When the operator finds a `PerconaXtraDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `PerconaXtraDB` standalone or cluster the user creates a `PerconaXtraDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `PerconaXtraDBOpsRequest` CR.

6. When it finds a `PerconaXtraDBOpsRequest` CR, it halts the `PerconaXtraDB` object which is referred from the `PerconaXtraDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `PerconaXtraDB` object during the reconfiguring process.  

7. Then the `KubeDB` Enterprise operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `PerconaXtraDBOpsRequest` CR.

8. Then the `KubeDB` Enterprise operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `PerconaXtraDBOpsRequest` CR.

9. After the successful reconfiguring of the `PerconaXtraDB`, the `KubeDB` Enterprise operator resumes the `PerconaXtraDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring PerconaXtraDB database components using `PerconaXtraDBOpsRequest` CRD.