---
title: Qdrant
menu:
  docs_v2026.6.19:
    identifier: qdrant-readme
    name: Qdrant
    parent: qdrant-guides
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
url: /docs/v2026.6.19/guides/qdrant/
aliases:
- /docs/v2026.6.19/guides/qdrant/README/
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

Qdrant is a high-performance open-source vector database designed for similarity search and AI-powered applications. KubeDB supports provisioning and management of Qdrant clusters directly inside Kubernetes, enabling scalable and production-ready vector search infrastructure with minimal operational overhead. Deploy Qdrant in distributed mode to achieve horizontal scalability, replication, and high availability for large-scale embedding workloads. KubeDB automates cluster lifecycle management tasks such as deployment, scaling, monitoring, backups, and version upgrades, simplifying operations for machine learning and semantic search applications. With seamless Kubernetes integration, users can efficiently run and manage resilient Qdrant deployments for modern AI and retrieval-augmented generation (RAG) workloads.

## Supported Qdrant Features

| Features                 | Availability |
|--------------------------|:------------:|
| Standalone provisioning  |   &#10003;   |
| Distributed provisioning |   &#10003;   |
| TLS                      |   &#10003;   |
| Logical Backup           |   &#10003;   |
| Volume Snapshot          |   &#10003;   |
| Monitoring               |   &#10003;   |
| Ops Requests             |   &#10003;   |
| Autoscaler               |   &#10003;   |

## Supported Microsoft SQL Server Versions

KubeDB supports the following Microsoft SQL Server Version.
- `1.15.4`
- `1.16.2`
- `1.17.0`

## Life Cycle of a Qdrant Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2026.6.19/guides/qdrant/images/qdrant-lifecycle.png" style="padding: 20px;" >
</p>


## User Guide

- [Quickstart Qdrant](/docs/v2026.6.19/guides/qdrant/quickstart/quickstart) with KubeDB operator.
- Deploy [Distributed Qdrant](/docs/v2026.6.19/guides/qdrant/distributed-deployment/overview) cluster.
- Detail concepts of [Qdrant Object](/docs/v2026.6.19/guides/qdrant/concepts/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.6.19/CONTRIBUTING).
