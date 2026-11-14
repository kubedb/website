---
title: Rotating Neo4j Credentials
menu:
  docs_v2026.11.15:
    identifier: neo4j-rotate-auth-overview
    name: Overview
    parent: neo4j-rotate-auth
    weight: 10
menu_name: docs_v2026.11.15
section_menu_id: guides
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

# Rotate Auth for Neo4j Overview

This page explains how KubeDB Ops-manager rotates Neo4j credentials using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.11.15/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.11.15/guides/neo4j/concepts/opsrequest).

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

Follow the detailed guide: [Rotate Auth for Neo4j](/docs/v2026.11.15/guides/neo4j/rotate-auth/rotateauth).
