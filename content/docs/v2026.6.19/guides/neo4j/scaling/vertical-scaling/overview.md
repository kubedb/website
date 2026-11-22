---
title: Neo4j Vertical Scaling Overview
menu:
  docs_v2026.6.19:
    identifier: neo4j-vertical-scaling-overview
    name: Overview
    parent: neo4j-vertical-scaling
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

# Neo4j Vertical Scaling Overview

This page explains how KubeDB Ops-manager updates Neo4j pod resources using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).

## How Vertical Scaling Works

The following diagram shows how KubeDB Ops-manager performs vertical scaling for a `Neo4j` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Neo4j" src="/docs/v2026.6.19/images/neo4j/VerticalScaling.png">
  <figcaption align="center">Fig: Vertical scaling process of Neo4j</figcaption>
</figure>

The vertical scaling process consists of the following steps:

For a `Neo4jOpsRequest` with `spec.type: VerticalScaling`, KubeDB Ops-manager:

1. Validates CPU/memory values from `spec.verticalScaling.server.resources`.
2. Pauses conflicting reconciliations.
3. Applies updated requests/limits to Neo4j server pods.
4. Performs controlled restarts where necessary.
5. Waits for pods to become healthy with new resources.
6. Marks the request `Successful` after reconciliation.

## Next Step

Follow the detailed guide: [Scale Neo4j Vertically](/docs/v2026.6.19/guides/neo4j/scaling/vertical-scaling/scale-vertically/).
