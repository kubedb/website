---
title: Redis
menu:
  docs_v2023.01.31:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2023.01.31
section_menu_id: guides
url: /docs/v2023.01.31/guides/redis/
aliases:
- /docs/v2023.01.31/guides/redis/README/
info:
  autoscaler: v0.16.0
  cli: v0.31.0
  dashboard: v0.7.0
  installer: v2023.01.31
  ops-manager: v0.18.0
  provisioner: v0.31.0
  schema-manager: v0.7.0
  ui-server: v0.7.0
  version: v2023.01.31
  webhook-server: v0.7.0
---

> New to KubeDB? Please start [here](/docs/v2023.01.31/README).

## Supported Redis Features

| Features                     | Availability |
| ---------------------------- | :----------: |
| Clustering                   |   &#10003;   |
| Instant Backup               |   &#10007;   |
| Scheduled Backup             |   &#10007;   |
| Persistent Volume            |   &#10003;   |
| Initialize using Snapshot    |   &#10007;   |
| Initialize using Script      |   &#10007;   |
| Custom Configuration         |   &#10003;   |
| Using Custom docker image    |   &#10003;   |
| Builtin Prometheus Discovery |   &#10003;   |
| Using Prometheus operator    |   &#10003;   |

## Life Cycle of a Redis Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2023.01.31/images/redis/redis-lifecycle.png">
</p>

## User Guide

- [Quickstart Redis](/docs/v2023.01.31/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2023.01.31/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2023.01.31/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2023.01.31/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2023.01.31/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2023.01.31/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2023.01.31/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2023.01.31/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2023.01.31/CONTRIBUTING).
