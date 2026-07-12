---
title: Weaviate
menu:
  docs_v2026.7.10:
    identifier: weaviate-readme
    name: Weaviate
    parent: weaviate-guides
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
url: /docs/v2026.7.10/guides/weaviate/
aliases:
- /docs/v2026.7.10/guides/weaviate/README/
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

Weaviate is an open-source, AI-native vector database that stores both objects and their vector embeddings, enabling fast semantic search, hybrid search, and retrieval-augmented generation (RAG) at scale. KubeDB supports provisioning and management of Weaviate clusters directly inside Kubernetes, bringing production-grade vector search infrastructure to your cluster with minimal operational overhead. Deploy Weaviate with multiple replicas to achieve horizontal scalability, replication, and high availability for large embedding workloads. KubeDB automates cluster lifecycle management tasks such as deployment, scaling, custom configuration, TLS, authentication rotation, volume expansion, storage migration, and autoscaling, simplifying operations for machine learning and semantic search applications. With seamless Kubernetes integration, users can efficiently run and manage resilient Weaviate deployments for modern AI and retrieval-augmented generation (RAG) workloads.

## Supported Weaviate Features

| Features                        | Availability |
|---------------------------------|:------------:|
| Clustered (Multi-node) provisioning |   &#10003;   |
| Custom Configuration            |   &#10003;   |
| TLS                             |   &#10003;   |
| Authentication (API key)        |   &#10003;   |
| Reconfigure                     |   &#10003;   |
| Reconfigure TLS                 |   &#10003;   |
| Rotate Authentication           |   &#10003;   |
| Restart                         |   &#10003;   |
| Vertical Scaling                |   &#10003;   |
| Horizontal Scaling              |   &#10003;   |
| Volume Expansion                |   &#10003;   |
| Storage Migration               |   &#10003;   |
| Compute Autoscaler              |   &#10003;   |
| Storage Autoscaler              |   &#10003;   |

## Supported Weaviate Versions

KubeDB supports the following Weaviate versions.
- `1.33.1`

> The listed versions are the ones shipped with the `WeaviateVersion` catalog in your KubeDB installation. Run `kubectl get weaviateversions` to see the versions available in your cluster.

## User Guide

- [Quickstart Weaviate](/docs/v2026.7.10/guides/weaviate/quickstart/quickstart) with KubeDB operator.
- Use [custom configuration](/docs/v2026.7.10/guides/weaviate/configuration/using-config-file) for Weaviate.
- Secure your cluster with [TLS](/docs/v2026.7.10/guides/weaviate/tls/overview).
- Run day-2 operations with [Ops Requests](/docs/v2026.7.10/guides/weaviate/restart/restart) and [Autoscaler](/docs/v2026.7.10/guides/weaviate/autoscaler/compute/compute-autoscale).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.7.10/CONTRIBUTING).
