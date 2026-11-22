---
title: Reconfiguring Neo4j TLS
menu:
  docs_v2026.6.19:
    identifier: neo4j-reconfigure-tls-overview
    name: Overview
    parent: neo4j-reconfigure-tls
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

# Reconfiguring TLS of Neo4j Database

This guide gives an overview of how KubeDB Ops-manager reconfigures TLS for a `Neo4j` database, including adding TLS, rotating certificates, updating issuer reference, and removing TLS through `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest).

## How Reconfiguring Neo4j TLS Works

The following diagram shows the TLS reconfiguration flow for a `Neo4j` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Neo4j" src="/docs/v2026.6.19/images/neo4j/reconfigureTLS.png">
  <figcaption align="center">Fig: Reconfiguring TLS process of Neo4j</figcaption>
</figure>

The process consists of the following steps:

1. A user creates a `Neo4j` Custom Resource.
2. KubeDB Provisioner reconciles the database and creates required workloads and secrets.
3. To update TLS settings, the user creates a `Neo4jOpsRequest` with `spec.type: ReconfigureTLS`.
4. KubeDB Ops-manager watches the `Neo4jOpsRequest` and validates the `spec.tls` fields.
5. Ops-manager temporarily pauses conflicting reconciliation for the target database.
6. It applies the requested TLS action (add/update via `issuerRef`, rotate via `rotateCertificates`, or disable via `remove`).
7. It rolls/restarts the required pods so updated TLS configuration is picked up.
8. After successful checks, Ops-manager marks the request `Successful` and resumes normal reconciliation.

In the next guide, we show the step-by-step workflow for each TLS reconfiguration operation.

## Next Step

- Follow: [Reconfigure TLS in Neo4j](/docs/v2026.6.19/guides/neo4j/reconfigure-tls/reconfigure-tls).
