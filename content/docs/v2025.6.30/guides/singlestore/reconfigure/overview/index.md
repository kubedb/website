---
title: Reconfiguring SingleStore
menu:
  docs_v2025.6.30:
    identifier: guides-sdb-reconfigure-overview
    name: Overview
    parent: guides-sdb-reconfigure
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

### Reconfiguring SingleStore

This guide will give an overview on how KubeDB Ops Manager reconfigures `SingleStore`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [SingleStore](/docs/v2025.6.30/guides/singlestore/concepts/)
  - [SingleStoreOpsRequest](/docs/v2025.6.30/guides/singlestore/concepts/opsrequest)

## How Reconfiguring SingleStore Process Works

The following diagram shows how KubeDB Ops Manager reconfigures `SingleStore` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of SingleStore" src="/docs/v2025.6.30/guides/singlestore/reconfigure/overview/images/sdb-reconfigure.svg">
<figcaption align="center">Fig: Reconfiguring process of SingleStore</figcaption>
</figure>

The Reconfiguring SingleStore process consists of the following steps:

1. At first, a user creates a `SingleStore` Custom Resource (CR).

2. `KubeDB` Provisioner operator watches the `SingleStore` CR.

3. When the operator finds a `SingleStore` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the `SingleStore` standalone or cluster the user creates a `SingleStoreOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `SingleStoreOpsRequest` CR.

6. When it finds a `SingleStoreOpsRequest` CR, it halts the `SingleStore` object which is referred from the `SingleStoreOpsRequest`. So, the `KubeDB` provisioner operator doesn't perform any operations on the `SingleStore` object during the reconfiguring process.  
   
7. Then the `KubeDB` Ops-manager operator will replace the existing configuration with the new configuration provided or merge the new configuration with the existing configuration according to the `SingleStoreOpsRequest` CR.

8. Then the `KubeDB` Ops-manager operator will restart the related PetSet Pods so that they restart with the new configuration defined in the `SingleStoreOpsRequest` CR.

9. After the successful reconfiguring of the `SingleStore`, the `KubeDB` Ops-manager operator resumes the `SingleStore` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring SingleStore database components using `SingleStoreOpsRequest` CRD.