---
title: Redis
menu:
  docs_v2021.01.15:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2021.01.15
section_menu_id: guides
url: /docs/v2021.01.15/guides/redis/
aliases:
- /docs/v2021.01.15/guides/redis/README/
info:
  autoscaler: v0.1.1
  cli: v0.16.1
  community: v0.16.1
  enterprise: v0.3.1
  installer: v0.16.1
  version: v2021.01.15
---

> New to KubeDB? Please start [here](/docs/v2021.01.15/README).

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
  <img alt="lifecycle"  src="/docs/v2021.01.15/images/redis/redis-lifecycle.svg">
</p>

## User Guide

- [Quickstart Redis](/docs/v2021.01.15/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2021.01.15/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.01.15/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.01.15/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.01.15/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2021.01.15/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2021.01.15/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2021.01.15/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.01.15/CONTRIBUTING).
