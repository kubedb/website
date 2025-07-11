---
title: Solr Storage Autoscaling Overview
menu:
  docs_v2025.6.30:
    identifier: sl-storage-autoscaling-overview
    name: Overview
    parent: sl-storage-autoscaling-solr
    weight: 5
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

# Solr Storage SolrAutoscaler

This guide will give an overview on how KubeDB Autoscaler operator autoscales the Solr storage using `Solrautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.6.30/guides/solr/concepts/solr)
    - [SolrAutoscaler](/docs/v2025.6.30/guides/solr/concepts/autoscaler)
    - [SolrOpsRequest](/docs/v2025.6.30/guides/solr/concepts/solropsrequests)

## How Storage Autoscaling Works

The Auto Scaling process consists of the following steps:

<p align="center">
  <img alt="Compute Autoscaling Flow"  src="/docs/v2025.6.30/images/day-2-operation/solr/storage-autoscaling.svg">
</p>

1. At first, a user creates a `Solr` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Solr` CR.

3. When the operator finds a `Solr` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

- Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration.

4. Then, in order to set up storage autoscaling of the various components of the `Solr` database the user creates a `SolrAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `SolrAutoscaler` CRO.

6. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
- If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `SolrOpsRequest` to expand the storage of the database.

7. `KubeDB` Ops-manager operator watches the `SolrOpsRequest` CRO.

8. Then the `KubeDB` Ops-manager operator will expand the storage of the database component as specified on the `SolrOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of various Solr database components using `SolrAutoscaler` CRD.
