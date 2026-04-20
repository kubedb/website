---
title: Solr Horizontal Scaling Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: sl-scaling-horizontal-overview
    name: Overview
    parent: sl-scaling-horizontal
    weight: 30
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Solr Horizontal Scaling

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `Solr` cluster replicas of various component such as Combined, Broker, Controller.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.12.31-rc.1/guides/solr/concepts/solr)
    - [SolrOpsRequest](/docs/v2025.12.31-rc.1/guides/solr/concepts/solropsrequests)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator scales up or down `Solr` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of Solr" src="/docs/v2025.12.31-rc.1/images/day-2-operation/solr/horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of Solr</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `Solr` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Solr` CR.

3. When the operator finds a `Solr` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the various components of the `Solr` cluster, the user creates a `SolrOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `SolrOpsRequest` CR.

6. When it finds a `SolrOpsRequest` CR, it halts the `Solr` object which is referred from the `SolrOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Solr` object during the horizontal scaling process.

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `SolrOpsRequest` CR.

8. After the successfully scaling the replicas of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `Solr` object to reflect the updated state.

9. After the successful scaling of the `Solr` replicas, the `KubeDB` Ops-manager operator resumes the `Solr` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of Solr cluster using `SolrOpsRequest` CRD.