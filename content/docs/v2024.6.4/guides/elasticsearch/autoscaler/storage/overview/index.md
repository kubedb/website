---
title: Elasticsearch Storage Autoscaling Overview
menu:
  docs_v2024.6.4:
    identifier: es-storage-auto-scaling-overview
    name: Overview
    parent: es-storage-auto-scaling
    weight: 5
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Elasticsearch Storange Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the Elasticsearch storage using `elasticsearchautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Elasticsearch](/docs/v2024.6.4/guides/elasticsearch/concepts/elasticsearch/)
  - [ElasticsearchAutoscaler](/docs/v2024.6.4/guides/elasticsearch/concepts/autoscaler/)
  - [ElasticsearchOpsRequest](/docs/v2024.6.4/guides/elasticsearch/concepts/elasticsearch-ops-request/)

## How Storage Autoscaling Works

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Elasticsearch` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Elasticsearch` CR.

3. When the operator finds a `Elasticsearch` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

- Each StatefulSet creates a Persistent Volume according to the Volume Claim Template provided in the statefulset configuration.

4. Then, in order to set up storage autoscaling of the various components of the `Elasticsearch` database the user creates a `ElasticsearchAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `ElasticsearchAutoscaler` CRO.

6. `KubeDB` Autoscaler operator continuously watches persistent volumes of the databases to check if it exceeds the specified usage threshold.
- If the usage exceeds the specified usage threshold, then `KubeDB` Autoscaler operator creates a `ElasticsearchOpsRequest` to expand the storage of the database.

7. `KubeDB` Ops-manager operator watches the `ElasticsearchOpsRequest` CRO.

8. Then the `KubeDB` Ops-manager operator will expand the storage of the database component as specified on the `ElasticsearchOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling storage of various Elasticsearch database components using `ElasticsearchAutoscaler` CRD.
