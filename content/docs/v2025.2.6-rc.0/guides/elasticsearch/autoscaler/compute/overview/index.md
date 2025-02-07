---
title: Elasticsearch Compute Autoscaling Overview
menu:
  docs_v2025.2.6-rc.0:
    identifier: es-auto-scaling-overview
    name: Overview
    parent: es-compute-auto-scaling
    weight: 5
menu_name: docs_v2025.2.6-rc.0
section_menu_id: guides
info:
  autoscaler: v0.37.0-rc.0
  cli: v0.52.0-rc.0
  dashboard: v0.28.0-rc.0
  installer: v2025.2.6-rc.0
  ops-manager: v0.39.0-rc.0
  provisioner: v0.52.0-rc.0
  schema-manager: v0.28.0-rc.0
  ui-server: v0.28.0-rc.0
  version: v2025.2.6-rc.0
  webhook-server: v0.28.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.2.6-rc.0/README).

# Elasticsearch Compute Resource Autoscaling

This guide will give an overview on how the KubeDB Autoscaler operator autoscales the database compute resources i.e. `cpu` and `memory` using `elasticsearchautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Elasticsearch](/docs/v2025.2.6-rc.0/guides/elasticsearch/concepts/elasticsearch/)
  - [ElasticsearchAutoscaler](/docs/v2025.2.6-rc.0/guides/elasticsearch/concepts/autoscaler/)
  - [ElasticsearchOpsRequest](/docs/v2025.2.6-rc.0/guides/elasticsearch/concepts/elasticsearch-ops-request/)

## How Compute Autoscaling Works

The Auto Scaling process consists of the following steps:

1. At first, a user creates a `Elasticsearch` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Elasticsearch` CRO.

3. When the operator finds a `Elasticsearch` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the various components of the `Elasticsearch` database the user creates a `ElasticsearchAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `ElasticsearchAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `ElasticsearchAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `ElasticsearchOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `ElasticsearchOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `ElasticsearchOpsRequest` CRO.

In the next docs, we are going to show a step-by-step guide on Autoscaling of various Elasticsearch database components using `ElasticsearchAutoscaler` CRD.

