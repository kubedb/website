---
title: Updating Neo4j Version
menu:
  docs_v2026.7.10:
    identifier: neo4j-update-version-overview
    name: Overview
    parent: neo4j-update-version
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# Neo4j Update Version Overview

This page explains how KubeDB Ops-manager upgrades Neo4j using `Neo4jOpsRequest`.

## Before You Begin

- You should be familiar with [Neo4j](/docs/v2026.7.10/guides/neo4j/concepts/neo4j).
- You should be familiar with [Neo4jOpsRequest](/docs/v2026.7.10/guides/neo4j/concepts/opsrequest).

## How Update Version Works

The following diagram shows how KubeDB Ops-manager updates the version of a `Neo4j` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Update version process of Neo4j" src="/docs/v2026.7.10/images/neo4j/UpdateVersion.png">
  <figcaption align="center">Fig: Update version process of Neo4j</figcaption>
</figure>

The update version process consists of the following steps:

For a `Neo4jOpsRequest` with `spec.type: UpdateVersion`, KubeDB Ops-manager:

1. Validates target version from `spec.updateVersion.targetVersion`.
2. Pauses conflicting reconciliations for safe upgrade.
3. Updates Neo4j image/version references.
4. Performs controlled rolling update of Neo4j members.
5. Waits for all pods and cluster status to become healthy.
6. Marks the request `Successful` and resumes reconciliation.

## Next Step

Follow the detailed guide: [Upgrade Neo4j Version](/docs/v2026.7.10/guides/neo4j/update-version/versionupgrading/).
