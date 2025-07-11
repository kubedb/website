---
title: Updating FerretDB Overview
menu:
  docs_v2025.5.30:
    identifier: fr-updating-overview
    name: Overview
    parent: fr-updating
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

# updating FerretDB version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `FerretDB`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [FerretDB](/docs/v2025.5.30/guides/ferretdb/concepts/ferretdb)
    - [FerretDBOpsRequest](/docs/v2025.5.30/guides/ferretdb/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `FerretDB`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of FerretDB" src="/docs/v2025.5.30/images/ferretdb/fr-update.svg">
<figcaption align="center">Fig: updating Process of FerretDB</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `FerretDB` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `FerretDB` CR.

3. When the operator finds a `FerretDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `FerretDB` the user creates a `FerretDBOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `FerretDBOpsRequest` CR.

6. When it finds a `FerretDBOpsRequest` CR, it halts the `FerretDB` object which is referred from the `FerretDBOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `FerretDB` object during the updating process.

7. By looking at the target version from `FerretDBOpsRequest` CR, `KubeDB` Ops-manager operator updates the image of the `PetSet`.

8. After successfully updating the `PetSet` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `FerretDB` object to reflect the updated state of the database.

9. After successfully updating of `FerretDB` object, the `KubeDB` Ops-manager operator resumes the `FerretDB` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a FerretDB using updateVersion operation.