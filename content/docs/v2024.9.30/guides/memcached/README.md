---
title: Memcached
menu:
  docs_v2024.9.30:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2024.9.30
section_menu_id: guides
url: /docs/v2024.9.30/guides/memcached/
aliases:
- /docs/v2024.9.30/guides/memcached/README/
info:
  autoscaler: v0.33.0
  cli: v0.48.0
  dashboard: v0.24.0
  installer: v2024.9.30
  ops-manager: v0.35.0
  provisioner: v0.48.0
  schema-manager: v0.24.0
  ui-server: v0.24.0
  version: v2024.9.30
  webhook-server: v0.24.0
---

> New to KubeDB? Please start [here](/docs/v2024.9.30/README).

## Supported Memcached Features

| Features                               | Availability |
| ------------------------------------   | :----------: |
| Clustering                             |   &#10007;   |
| Persistent Volume                      |   &#10007;   |
| Instant Backup                         |   &#10007;   |
| Scheduled Backup                       |   &#10007;   |
| Initialize using Snapshot              |   &#10007;   |
| Initialize using Script                |   &#10007;   |
| Multiple Memcached Versions         |   &#10003;   |
| Custom Configuration                   |   &#10003;   |
| Externally manageable Auth Secret	     |   &#10007;   |
| Reconfigurable Health Checker		     |   &#10003;   |
| Using Custom docker image              |   &#10003;   |
| Builtin Prometheus Discovery           |   &#10003;   |
| Using Prometheus operator              |   &#10003;   |
| Automated Version Update               |   &#10003;   |
| Automated Vertical Scaling             |   &#10003;   |
| Automated Horizontal Scaling           |   &#10003;   |
| Automated db-configure Reconfiguration |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( Cert Manager )	|&#10007;|
| Automated Volume Expansion	           |   &#10007;   |
| Autoscaling (Vertically)               |   &#10003;   |
| Grafana Dashboard               |   &#10003;   |
| Alert Dashboard	               |   &#10007;   |



## Life Cycle of a Memcached Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2024.9.30/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2024.9.30/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2024.9.30/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2024.9.30/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2024.9.30/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2024.9.30/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2024.9.30/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.9.30/CONTRIBUTING).
