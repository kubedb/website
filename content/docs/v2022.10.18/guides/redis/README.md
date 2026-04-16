---
title: Redis
menu:
  docs_v2022.10.18:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2022.10.18
section_menu_id: guides
url: /docs/v2022.10.18/guides/redis/
aliases:
- /docs/v2022.10.18/guides/redis/README/
info:
  autoscaler: v0.14.0
  cli: v0.29.0
  dashboard: v0.5.0
  installer: v2022.10.18
  ops-manager: v0.16.0
  provisioner: v0.29.0
  schema-manager: v0.5.0
  ui-server: v0.5.0
  version: v2022.10.18
  webhook-server: v0.5.0
---

> New to KubeDB? Please start [here](/docs/v2022.10.18/README).

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
  <img alt="lifecycle"  src="/docs/v2022.10.18/images/redis/redis-lifecycle.png">
</p>

## User Guide

- [Quickstart Redis](/docs/v2022.10.18/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2022.10.18/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2022.10.18/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2022.10.18/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2022.10.18/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2022.10.18/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2022.10.18/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2022.10.18/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.10.18/CONTRIBUTING).
