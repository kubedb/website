---
title: Expanding Neo4j Storage
menu:
  docs_v2026.6.19:
    identifier: neo4j-volume-expansion-overview
    name: Overview
    parent: neo4j-volume-expansion
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# Neo4j Volume Expansion Overview

This page explains how KubeDB Ops-manager expands Neo4j data volumes using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).
- Your StorageClass must support `allowVolumeExpansion: true`.

## How Volume Expansion Works

The following diagram shows how KubeDB Ops-manager expands volume for a `Neo4j` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume expansion process of Neo4j" src="/docs/v2026.6.19/images/neo4j/VolumeExpanison.png">
  <figcaption align="center">Fig: Volume expansion process of Neo4j</figcaption>
</figure>

The volume expansion process consists of the following steps:

For a `Neo4jOpsRequest` with `spec.type: VolumeExpansion`, KubeDB Ops-manager:

1. Validates requested size from `spec.volumeExpansion.server`.
2. Validates expansion mode from `spec.volumeExpansion.mode`.
3. Pauses conflicting reconciliations.
4. Expands the target PVCs to the requested size.
5. Reconciles Neo4j state based on online/offline mode requirements.
6. Marks request `Successful` after PVC and pod health checks.

## Next Step

Follow the detailed guide: [Expand Neo4j Volume](/docs/v2026.6.19/guides/neo4j/volume-expansion/volume-expansion).
