---
title: Milvus
menu:
  docs_v2026.7.10:
    identifier: milvus-guides-readme
    name: Milvus
    parent: milvus-guides
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
url: /docs/v2026.7.10/guides/milvus/
aliases:
- /docs/v2026.7.10/guides/milvus/README/
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

Milvus is an open-source vector database built to power embedding similarity search and AI applications. It stores, indexes, and queries billions of high-dimensional vectors, making it a core building block for retrieval-augmented generation, recommendation, and semantic search workloads. KubeDB can provision Milvus in both **standalone** and **distributed** topologies, using object storage for segments/logs and etcd for metadata.

## Supported Milvus Features

| Features                                                      | Availability |
|---------------------------------------------------------------|:------------:|
| Standalone & Distributed topologies                           |   &#10003;   |
| External object storage support                               |   &#10003;   |
| KubeDB-managed or externally managed etcd metadata storage    |   &#10003;   |
| Custom Configuration                                          |   &#10003;   |
| Monitoring using Prometheus and Grafana                       |   &#10003;   |
| Authentication & Authorization (TLS)                          |   &#10003;   |
| Externally manageable Auth Secret (Rotate Auth)               |   &#10003;   |
| Persistent volume                                             |   &#10003;   |
| Automated Vertical & Horizontal Scaling                       |   &#10003;   |
| Automated Volume Expansion                                    |   &#10003;   |
| Storage Migration (StorageClass to StorageClass)              |   &#10003;   |
| Autoscaling ( Compute resources & Storage )                   |   &#10003;   |
| Reconfigurable TLS Certificates (Add, Remove, Rotate, Update) |   &#10003;   |
| Automated Version Update                                      |   &#10003;   |
| Automated Restart                                             |   &#10003;   |

## Supported Milvus Versions

KubeDB supports the following Milvus Versions.
- `2.6.7`
- `2.6.9`
- `2.6.11`

## User Guide

- [Prepare Dependencies](/docs/v2026.7.10/guides/milvus/quickstart/prerequisites) before running any Milvus example.
- [Standalone Quickstart](/docs/v2026.7.10/guides/milvus/quickstart/standalone) with KubeDB Operator.
- [Distributed Quickstart](/docs/v2026.7.10/guides/milvus/quickstart/distributed) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.7.10/CONTRIBUTING).
