---
title: Redis
menu:
  docs_v2020.10.24-beta.0:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2020.10.24-beta.0
section_menu_id: guides
url: /docs/v2020.10.24-beta.0/guides/redis/
aliases:
- /docs/v2020.10.24-beta.0/guides/redis/README/
info:
  cli: v0.14.0-beta.4
  community: v0.14.0-beta.4
  enterprise: v0.1.0-beta.4
  installer: v0.14.0-beta.4
  version: v2020.10.24-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.24-beta.0/README).

## Supported Redis Features

| Features                         | Availability |
| -------------------------------- | :----------: |
| Clustering                       |   &#10003;   |
| Instant Backup                   |   &#10007;   |
| Scheduled Backup                 |   &#10007;   |
| Persistent Volume                |   &#10003;   |
| Initialize using Snapshot        |   &#10007;   |
| Initialize using Script          |   &#10007;   |
| Custom Configuration             |   &#10003;   |
| Using Custom docker image        |   &#10003;   |
| Builtin Prometheus Discovery     |   &#10003;   |
| Using Prometheus operator |   &#10003;   |

## Life Cycle of a Redis Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2020.10.24-beta.0/images/redis/redis-lifecycle.svg">
</p>

## Supported Redis Versions

| KubeDB Version | Redis:4.0.6 | Redis:5.0.3 |
| :------------: | :---------: | :---------: |
| 0.1.0 - 0.7.0  |  &#10007;   |  &#10007;   |
|     0.8.0      |  &#10003;   |  &#10007;   |
|     0.9.0      |  &#10003;   |  &#10007;   |
|     0.10.0     |  &#10003;   |  &#10003;   |
|     0.11.0     |  &#10003;   |  &#10003;   |
|     0.12.0     |  &#10003;   |  &#10003;   |
|  v0.13.0-rc.0  |  &#10003;   |  &#10003;   |

## Supported RedisVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|   NAME   | VERSION  | KubeDB: 0.9.0 | KubeDB: 0.10.0 | KubeDB: 0.11.0 | KubeDB: 0.12.0 | KubeDB: v0.13.0-rc.0 |
| :------: | :------: | :-----------: | :------------: | :------------: | :------------: | :------------------: |
|    4     |    4     |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|   4-v1   |    4     |   &#10003;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|   4.0    |   4.0    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|  4.0-v1  |   4.0    |   &#10003;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
|  4.0-v2  |   4.0    |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
|  4.0.6   |  4.0.6   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
| 4.0.6-v1 |  4.0.6   |   &#10003;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
| 4.0.6-v2 |  4.0.6   |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
|  4.0.11  |  4.0.11  |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
|   5.0    |   5.0    |   &#10003;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
|  5.0-v1  |  5.0-v1  |   &#10007;    |    &#10007;    |    &#10003;    |    &#10003;    |       &#10003;       |
|  5.0.3   |  5.0.3   |   &#10003;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
| 5.0.3-v1 | 5.0.3-v1 |   &#10007;    |    &#10007;    |    &#10003;    |    &#10003;    |       &#10003;       |

## User Guide

- [Quickstart Redis](/docs/v2020.10.24-beta.0/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2020.10.24-beta.0/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2020.10.24-beta.0/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.10.24-beta.0/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2020.10.24-beta.0/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2020.10.24-beta.0/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2020.10.24-beta.0/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2020.10.24-beta.0/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.10.24-beta.0/CONTRIBUTING).
