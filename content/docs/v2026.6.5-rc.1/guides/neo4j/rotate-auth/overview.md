---
title: Rotating Neo4j Credentials
menu:
  docs_v2026.6.5-rc.1:
    identifier: neo4j-rotate-auth-overview
    name: Overview
    parent: neo4j-rotate-auth
    weight: 10
menu_name: docs_v2026.6.5-rc.1
section_menu_id: guides
info:
  autoscaler: v0.50.0-rc.1
  cli: v0.65.0-rc.1
  dashboard: v0.41.0-rc.1
  installer: v2026.6.5-rc.1
  ops-manager: v0.52.0-rc.1
  product: kubedb
  provisioner: v0.65.0-rc.1
  schema-manager: v0.41.0-rc.1
  ui-server: v0.41.0-rc.1
  version: v2026.6.5-rc.1
  webhook-server: v0.41.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2026.6.5-rc.1/README).

# Rotate Auth for Neo4j Overview

This page explains how KubeDB Ops-manager rotates Neo4j credentials using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.5-rc.1/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.5-rc.1/guides/neo4j/concepts/opsrequest).

## How RotateAuth Works

For a `Neo4jOpsRequest` with `spec.type: RotateAuth`, KubeDB Ops-manager:

1. Validates rotate-auth request and target database.
2. Uses one of the supported credential sources:
   - operator-managed generated secret,
   - user-provided secret from `spec.authentication.secretRef`.
3. Rotates credentials in Neo4j and updates auth secret state.
4. Ensures database authentication remains healthy.
5. Marks the request `Successful` when rotation completes.


## Next Step

Follow the detailed guide: [Rotate Auth for Neo4j](/docs/v2026.6.5-rc.1/guides/neo4j/rotate-auth/rotateauth).
