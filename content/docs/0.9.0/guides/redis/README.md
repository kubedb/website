---
title: Redis
menu:
  docs_0.9.0:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_0.9.0
section_menu_id: guides
url: /docs/0.9.0/guides/redis/
aliases:
- /docs/0.9.0/guides/redis/README/
---

> New to KubeDB? Please start [here](/docs/0.9.0/concepts/README).

## Supported Redis Features

|             Features             | Availability |
| -------------------------------- | :----------: |
| Clustering                       |   &#10007;   |
| Instant Backup                   |   &#10007;   |
| Scheduled Backup                 |   &#10007;   |
| Persistent Volume                |   &#10003;   |
| Initialize using Snapshot        |   &#10007;   |
| Initialize using Script          |   &#10007;   |
| Custom Configuration             |   &#10003;   |
| Using Custom docker image        |   &#10003;   |
| Builtin Prometheus Discovery     |   &#10003;   |
| Using CoreOS Prometheus Operator |   &#10003;   |

<br/>

## Life Cycle of a Redis Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.9.0/images/redis/redis-lifecycle.png">
</p>

<br/>

## Supported Redis Versions

| KubeDB Version | Redis:4.0.6 |
|:--------------:|:-----------:|
| 0.1.0 - 0.7.0  | &#10007;    |
| 0.8.0          | &#10003;    |
| 0.9.0     | &#10003;    |

## Supported RedisVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

| NAME     | VERSION | KubeDB: 0.9.0 |
|----------|---------|--------------------|
| 4        | 4       | &#10007;           |
| 4-v1     | 4       | &#10003;           |
| 4.0      | 4.0     | &#10007;           |
| 4.0-v1   | 4.0     | &#10003;           |
| 4.0.6    | 4.0.6   | &#10007;           |
| 4.0.6-v1 | 4.0.6   | &#10003;           |

## User Guide

- [Quickstart Redis](/docs/0.9.0/guides/redis/quickstart/quickstart) with KubeDB Operator.
- Monitor your Redis database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.9.0/guides/redis/monitoring/using-coreos-prometheus-operator).
- Monitor your Redis database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.9.0/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.9.0/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/0.9.0/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/0.9.0/concepts/databases/redis).
- Detail concepts of [RedisVersion object](/docs/0.9.0/concepts/catalog/redis).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0/CONTRIBUTING).
