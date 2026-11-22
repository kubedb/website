---
title: Reconfiguring Neo4j
menu:
  docs_v2026.6.19:
    identifier: neo4j-reconfigure-overview
    name: Overview
    parent: neo4j-reconfigure
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

# Reconfiguring Neo4j

This guide gives an overview of how KubeDB Ops-manager reconfigures `Neo4j` database components.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).

## How Reconfiguring Neo4j Process Works

The following diagram shows how KubeDB Ops-manager reconfigures `Neo4j` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring process of Neo4j" src="/docs/v2026.6.19/images/neo4j/Reconfigure.png">
  <figcaption align="center">Fig: Reconfiguring process of Neo4j</figcaption>
</figure>

The reconfigure process consists of the following steps:

For a `Neo4jOpsRequest` with `spec.type: Reconfigure`, KubeDB Ops-manager:

1. Validates configuration inputs from `spec.configuration`.
2. Resolves custom config secret and inline `applyConfig` values.
3. Pauses conflicting reconciliations.
4. Merges or replaces Neo4j config based on request fields.
5. Restarts relevant pods to apply new configuration.
6. Verifies pod/database health and marks the request `Successful`.

## Next Step

Follow the detailed guide: [Reconfigure Neo4j Cluster](/docs/v2026.6.19/guides/neo4j/reconfigure/reconfigure).
