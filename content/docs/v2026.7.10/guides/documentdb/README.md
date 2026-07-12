---
title: DocumentDB
menu:
  docs_v2026.7.10:
    identifier: dc-documentdb-guides-readme
    name: DocumentDB
    parent: dc-documentdb-guides
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
url: /docs/v2026.7.10/guides/documentdb/
aliases:
- /docs/v2026.7.10/guides/documentdb/README/
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

# Overview

DocumentDB is a document database that speaks the MongoDB wire protocol on top of a PostgreSQL engine (via FerretDB), giving you MongoDB-compatible APIs backed by the reliability and tooling of PostgreSQL. KubeDB lets you provision and operate DocumentDB clusters on Kubernetes, handling day-2 operations such as scaling, reconfiguration, failover, and storage management through declarative `DocumentDBOpsRequest` objects.

## Supported DocumentDB Features

| Features                                                      | Availability |
|---------------------------------------------------------------|:------------:|
| Clustering (High Availability)                                |   &#10003;   |
| Custom Configuration (`user.conf`)                            |   &#10003;   |
| Externally manageable Auth Secret (Rotate Auth)               |   &#10003;   |
| Persistent volume                                             |   &#10003;   |
| Automated Vertical & Horizontal Scaling                       |   &#10003;   |
| Automated Volume Expansion                                    |   &#10003;   |
| Storage Migration (StorageClass to StorageClass)              |   &#10003;   |
| Autoscaling ( Compute resources & Storage )                   |   &#10003;   |
| Automated Failover & Disaster Recovery                        |   &#10003;   |
| Automated Restart                                             |   &#10003;   |
| Reconfigurable runtime configuration                          |   &#10003;   |

## Supported DocumentDB Versions

KubeDB supports the following DocumentDB Versions.
- `15.12-documentdb`
- `16.8-documentdb`
- `17.4-documentdb`

## User Guide

- [Custom Configuration](/docs/v2026.7.10/guides/documentdb/configuration/using-config-file) using a config file.
- [Reconfigure](/docs/v2026.7.10/guides/documentdb/reconfigure/reconfigure) a running DocumentDB database.
- [Failover & Disaster Recovery](/docs/v2026.7.10/guides/documentdb/failure-and-disaster-recovery/failover) of a DocumentDB cluster.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.7.10/CONTRIBUTING).
