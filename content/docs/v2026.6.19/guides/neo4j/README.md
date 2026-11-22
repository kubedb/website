---
title: Neo4j
menu:
  docs_v2026.6.19:
    identifier: neo4j-readme
    name: Neo4j
    parent: neo4j-guides
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
url: /docs/v2026.6.19/guides/neo4j/
aliases:
- /docs/v2026.6.19/guides/neo4j/README/
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

# Overview

KubeDB supports graph database deployment with Neo4j using the `Neo4j` CRD.

## Supported Neo4j Features

| Features                         | Availability |
|----------------------------------|:------------:|
| Standalone provisioning          |   &#10003;   |
| Cluster provisioning             |   &#10003;   |
| Monitoring                       |   &#10003;   |
| TLS                              |   &#10003;   |
| Ops Requests                     |   &#10003;   |

## Supported Ops Requests

- Reconfigure
- HorizontalScaling
- VerticalScaling
- VolumeExpansion
- StorageMigration
- UpdateVersion
- ReconfigureTLS
- RotateAuth
- Restart

## Example Neo4j Manifest

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Neo4j
metadata:
  name: neo4j-test
  namespace: demo
spec:
  replicas: 3
  deletionPolicy: WipeOut
  version: "2025.12.1"
  storage:
    storageClassName: local-path
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 2Gi
```

## User Guide

### Getting Started

- [Quickstart Neo4j](/docs/v2026.6.19/guides/neo4j/quickstart/quickstart) — deploy your first Neo4j cluster with KubeDB.
- [Cluster Architecture Overview](/docs/v2026.6.19/guides/neo4j/clustering/architecture-overview) — understand cluster topology, Raft consensus, and fault tolerance.
- [RBAC Permissions](/docs/v2026.6.19/guides/neo4j/quickstart/rbac) — RBAC resources KubeDB creates for Neo4j pods.

### Concepts

- [Neo4j CRD](/docs/v2026.6.19/guides/neo4j/concepts/neo4j) — full reference for all `Neo4j` spec fields.
- [Neo4jVersion CRD](/docs/v2026.6.19/guides/neo4j/concepts/catalog) — image and version catalog.
- [Neo4jOpsRequest CRD](/docs/v2026.6.19/guides/neo4j/concepts/opsrequest) — day-2 operations reference with sample manifests.
- [AppBinding CRD](/docs/v2026.6.19/guides/neo4j/concepts/appbinding) — how KubeDB exposes connection details for backup tools.

### Configuration & Infrastructure

- [Custom Configuration](/docs/v2026.6.19/guides/neo4j/configuration/using-config-file) — pass Neo4j settings via a Kubernetes Secret.
- [Private Registry](/docs/v2026.6.19/guides/neo4j/private-registry/using-private-registry) — pull Neo4j images from a private Docker registry.
- [Custom RBAC](/docs/v2026.6.19/guides/neo4j/custom-rbac/using-custom-rbac) — provide your own ServiceAccount and Role instead of the auto-generated ones.

### Monitoring

- [Monitoring Overview](/docs/v2026.6.19/guides/neo4j/monitoring/overview) — how KubeDB exposes Neo4j metrics.
- [Builtin Prometheus](/docs/v2026.6.19/guides/neo4j/monitoring/using-builtin-prometheus) — scrape metrics without the Prometheus Operator.
- [Prometheus Operator](/docs/v2026.6.19/guides/neo4j/monitoring/using-prometheus-operator) — use a `ServiceMonitor` with the Prometheus Operator.

### Day-2 Operations

- [TLS — How It Works](/docs/v2026.6.19/guides/neo4j/tls/overview/) — how KubeDB provisions TLS certificates via cert-manager.
- [Configure TLS](/docs/v2026.6.19/guides/neo4j/tls/configure/) — enable TLS on a new or existing cluster.
- [Reconfigure — How It Works](/docs/v2026.6.19/guides/neo4j/reconfigure/overview) — how KubeDB applies config changes internally.
- [Reconfigure](/docs/v2026.6.19/guides/neo4j/reconfigure/reconfigure) — change Neo4j settings at runtime.
- [Reconfigure TLS — How It Works](/docs/v2026.6.19/guides/neo4j/reconfigure-tls/overview) — how KubeDB rotates or removes TLS.
- [Reconfigure TLS](/docs/v2026.6.19/guides/neo4j/reconfigure-tls/reconfigure-tls) — add, rotate, change issuer, or remove TLS.
- [Restart](/docs/v2026.6.19/guides/neo4j/restart/restart) — rolling restart of all Neo4j pods.
- [Rotate Auth — How It Works](/docs/v2026.6.19/guides/neo4j/rotate-auth/overview) — how KubeDB rotates credentials.
- [Rotate Auth](/docs/v2026.6.19/guides/neo4j/rotate-auth/rotateauth) — rotate Neo4j passwords with or without a user-provided Secret.
- [Update Version — How It Works](/docs/v2026.6.19/guides/neo4j/update-version/overview) — how KubeDB performs rolling version upgrades.
- [Update Version](/docs/v2026.6.19/guides/neo4j/update-version/versionupgrading/) — upgrade to a newer Neo4j release.
- [Horizontal Scaling — How It Works](/docs/v2026.6.19/guides/neo4j/scaling/horizontal-scaling/overview) — how KubeDB adds or removes cluster members.
- [Horizontal Scaling](/docs/v2026.6.19/guides/neo4j/scaling/horizontal-scaling/scale-horizontally/) — add or remove Neo4j server pods.
- [Vertical Scaling — How It Works](/docs/v2026.6.19/guides/neo4j/scaling/vertical-scaling/overview) — how KubeDB adjusts pod resources.
- [Vertical Scaling](/docs/v2026.6.19/guides/neo4j/scaling/vertical-scaling/scale-vertically/) — resize CPU and memory for Neo4j pods.
- [Volume Expansion — How It Works](/docs/v2026.6.19/guides/neo4j/volume-expansion/overview) — how KubeDB expands PVCs.
- [Volume Expansion](/docs/v2026.6.19/guides/neo4j/volume-expansion/volume-expansion) — increase persistent storage size online or offline.
- [StorageClass Migration](/docs/v2026.6.19/guides/neo4j/migration/storageMigration) — migrate Neo4j data to a different StorageClass.