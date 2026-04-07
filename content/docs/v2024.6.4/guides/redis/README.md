---
title: Redis
menu:
  docs_v2024.6.4:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
url: /docs/v2024.6.4/guides/redis/
aliases:
- /docs/v2024.6.4/guides/redis/README/
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

## Supported Redis Features
| Features                                                                           | Community | Enterprise |
|------------------------------------------------------------------------------------|:---------:|:----------:|
| Clustering                                                                         | &#10003;  |  &#10003;  |
| Sentinel                                                                           | &#10003;  |  &#10003;  |
| Standalone                                                                         | &#10003;  |  &#10003;  |
| Authentication & Autorization                                                      | &#10003;  |  &#10003;  |
| Persistent Volume                                                                  | &#10003;  |  &#10003;  |
| Initializing from Snapshot ( [Stash](https://stash.run/) )                         | &#10003;  |  &#10003;  |
| Instant Backup (Sentinel and Standalone Mode)                                      | &#10003;  |  &#10003;  |
| Scheduled Backup (Sentinel and Standalone Mode)                                    | &#10003;  |  &#10003;  |
| Builtin Prometheus Discovery                                                       | &#10003;  |  &#10003;  |
| Using Prometheus operator                                                          | &#10003;  |  &#10003;  |
| Automated Version Update                                                           | &#10007;  |  &#10003;  |
| Automatic Vertical Scaling                                                         | &#10007;  |  &#10003;  |
| Automated Horizontal Scaling                                                       | &#10007;  |  &#10003;  |
| Automated db-configure Reconfiguration                                             | &#10007;  |  &#10003;  |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) | &#10007;  |  &#10003;  |
| Automated Volume Expansion                                                         | &#10007;  |  &#10003;  |
| Autoscaling (vertically)                                                           | &#10007;  |  &#10003;  |


## Life Cycle of a Redis Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2024.6.4/images/redis/redis-lifecycle.png">
</p>

## User Guide

- [Quickstart Redis](/docs/v2024.6.4/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2024.6.4/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2024.6.4/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2024.6.4/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2024.6.4/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2024.6.4/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2024.6.4/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2024.6.4/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.6.4/CONTRIBUTING).
