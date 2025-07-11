---
title: Update Version Overview
menu:
  docs_v2025.5.30:
    identifier: sl-update-version-overview
    name: Overview
    parent: sl-update-version
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

# Solr Update Version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `Solr`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.5.30/guides/solr/concepts/solr)
    - [SolrOpsRequest](/docs/v2025.5.30/guides/solr/concepts/solropsrequests)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `Solr`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="updating Process of Solr" src="/docs/v2025.5.30/images/day-2-operation/solr/update-version.svg">
<figcaption align="center">Fig: updating Process of Solr</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Solr` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Solr` CR.

3. When the operator finds a `Solr` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the version of the `Solr` database the user creates a `SolrOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `SolrOpsRequest` CR.

6. When it finds a `SolrOpsRequest` CR, it halts the `Solr` object which is referred from the `SolrOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Solr` object during the updating process.

7. By looking at the target version from `SolrOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `Solr` object to reflect the updated state of the database.

9. After successfully updating of `Solr` object, the `KubeDB` Ops-manager operator resumes the `Solr` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step by step guide on updating of a Solr database using updateVersion operation.