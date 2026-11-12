---
title: Neo4j Horizontal Scaling
menu:
  docs_v2026.6.19:
    identifier: neo4j-horizontal-scaling-overview
    name: Overview
    parent: neo4j-horizontal-scaling
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

# Neo4j Horizontal Scaling Overview

This page explains how KubeDB Ops-manager performs horizontal scaling for Neo4j using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).

## How Horizontal Scaling Works

The following diagram shows how KubeDB Ops-manager performs horizontal scaling for a `Neo4j` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of Neo4j" src="/docs/v2026.6.19/images/neo4j/HorizontalScalling.png">
  <figcaption align="center">Fig: Horizontal scaling process of Neo4j</figcaption>
</figure>

The horizontal scaling process consists of the following steps:

For a `Neo4jOpsRequest` with `spec.type: HorizontalScaling`, KubeDB Ops-manager:

1. Validates the requested server count in `spec.horizontalScaling.server`.
2. Pauses conflicting reconciliations for safe scale execution.
3. Updates the target Neo4j server replica count.
4. Applies reallocation policy from `spec.horizontalScaling.reallocate`.
5. Waits for members and database hosting to reach a healthy state.
6. Marks the operation `Successful` and resumes normal reconciliation.

Use Cypher views to verify topology and allocation after scaling:

- `SHOW DATABASE <name>` for allocation status.
- `SHOW SERVERS` for hosting distribution.

## Next Step

Follow the detailed guide: [Scale Neo4j Horizontally](/docs/v2026.6.19/guides/neo4j/scaling/horizontal-scaling/scale-horizontally/).
