---
title: Redis
menu:
  docs_v2025.3.20-rc.1:
    identifier: rd-readme-redis
    name: Redis
    parent: rd-redis-guides
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
url: /docs/v2025.3.20-rc.1/guides/redis/
aliases:
- /docs/v2025.3.20-rc.1/guides/redis/README/
info:
  autoscaler: v0.37.0-rc.1
  cli: v0.53.0-rc.1
  dashboard: v0.29.0-rc.1
  installer: v2025.3.20-rc.1
  ops-manager: v0.39.0-rc.1
  provisioner: v0.53.0-rc.1
  schema-manager: v0.29.0-rc.1
  ui-server: v0.29.0-rc.1
  version: v2025.3.20-rc.1
  webhook-server: v0.29.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.3.20-rc.1/README).

## Supported Redis Features
| Features                                                          | Availability |
|-------------------------------------------------------------------|:------------:|
| Clustering (Sharding, Replication)                                |   &#10003;   |
| Redis in Sentinel Mode (Use separate Sentinel Cluster for Redis)  |   &#10003;   |
| Standalone Mode                                                   |   &#10003;   |
| Custom Configuration                                              |   &#10003;   |
| Using Custom Docker Image                                         |   &#10003;   |
| Initialization From Script (shell or lua script)                  |   &#10003;   |
| Initializing from Snapshot ([KubeStash](https://kubestash.com/))  |   &#10003;   |
| Authentication & Authorization                                    |   &#10003;   |
| Externally manageable Authentication Secret                       |   &#10003;   |
| Persistent Volume                                                 |   &#10003;   |
| Reconfigurable Health Checker                                     |   &#10003;   |
| Backup (Instant, Scheduled)                                       |   &#10003;   |
| Builtin Prometheus Discovery                                      |   &#10003;   |
| Using Prometheus Operator                                         |   &#10003;   |
| Automated Version Update                                          |   &#10003;   |
| Automatic Vertical Scaling, Volume Expansion                      |   &#10003;   |
| Automated Horizontal Scaling                                      |   &#10003;   |
| Automated db-configure Reconfiguration                            |   &#10003;   |
| TLS configuration ([Cert Manager](https://cert-manager.io/docs/)) |   &#10003;   |
| Reconfiguration of TLS: Add, Remove, Update, Rotate               |   &#10003;   |
| Autoscaling Compute and Storage Resources (vertically)            |   &#10003;   |
| Grafana Dashboards                                                |   &#10003;   |



## Life Cycle of a Redis Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.3.20-rc.1/images/redis/redis-lifecycle.png">
</p>

## User Guide

- [Quickstart Redis](/docs/v2025.3.20-rc.1/guides/redis/quickstart/quickstart) with KubeDB Operator.
- [Deploy Redis Cluster](/docs/v2025.3.20-rc.1/guides/redis/clustering/redis-cluster) using KubeDB.
- Monitor your Redis server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.3.20-rc.1/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.3.20-rc.1/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.3.20-rc.1/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Use [kubedb cli](/docs/v2025.3.20-rc.1/guides/redis/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Redis object](/docs/v2025.3.20-rc.1/guides/redis/concepts/redis).
- Detail concepts of [RedisVersion object](/docs/v2025.3.20-rc.1/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.3.20-rc.1/CONTRIBUTING).
