---
title: Elasticsearch Volume Expansion Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: es-volume-expansion-overview
    name: Overview
    parent: es-voulume-expansion-elasticsearch
    weight: 10
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

# Elasticsearch Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of various component of `Elasticsearch` like:(Combined and Topology).

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
- [Elasticsearch](/docs/v2025.12.31-rc.1/guides/elasticsearch/concepts/elasticsearch/)
- [ElasticsearchOpsRequest](/docs/v2025.12.31-rc.1/guides/elasticsearch/concepts/elasticsearch-ops-request/)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `Elasticsearch` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
      <img alt="Volume Expansion process of Elasticsearch" src="/docs/v2025.12.31-rc.1/images/elasticsearch/es-volume-expansion.png">
    <figcaption align="center">Fig: Volume Expansion process of Elasticsearch</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `Elasticsearch` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Elasticsearch` CR.

3. When the operator finds a `Elasticsearch` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (ie. Combined, Controller) of the `Elasticsearch`, the user creates a `ElasticsearchOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `ElasticsearchOpsRequest` CR.

7. When it finds a `ElasticsearchOpsRequest` CR, it halts the `Elasticsearch` object which is referred from the `ElasticsearchOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Elasticsearch` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `ElasticsearchOpsRequest` CR.

9. After the successful Volume Expansion of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the new volume size in the `Elasticsearch` object to reflect the updated state.

10. After the successful Volume Expansion of the `Elasticsearch` components, the `KubeDB` Ops-manager operator resumes the `Elasticsearch` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various Elasticsearch database components using `ElasticsearchOpsRequest` CRD.
