---
title: Memcached
menu:
  docs_v2024.3.9-rc.0:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2024.3.9-rc.0
section_menu_id: guides
url: /docs/v2024.3.9-rc.0/guides/memcached/
aliases:
- /docs/v2024.3.9-rc.0/guides/memcached/README/
info:
  autoscaler: v0.28.0-rc.0
  cli: v0.43.0-rc.0
  dashboard: v0.19.0-rc.0
  installer: v2024.3.9-rc.0
  ops-manager: v0.30.0-rc.0
  provisioner: v0.43.0-rc.0
  schema-manager: v0.19.0-rc.0
  ui-server: v0.19.0-rc.0
  version: v2024.3.9-rc.0
  webhook-server: v0.19.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2024.3.9-rc.0/README).

## Supported Memcached Features

| Features                     | Availability |
| ---------------------------- | :----------: |
| Clustering                   |   &#10007;   |
| Persistent Volume            |   &#10007;   |
| Instant Backup               |   &#10007;   |
| Scheduled Backup             |   &#10007;   |
| Initialize using Snapshot    |   &#10007;   |
| Initialize using Script      |   &#10007;   |
| Custom Configuration         |   &#10003;   |
| Using Custom docker image    |   &#10003;   |
| Builtin Prometheus Discovery |   &#10003;   |
| Using Prometheus operator    |   &#10003;   |

## Life Cycle of a Memcached Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2024.3.9-rc.0/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2024.3.9-rc.0/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2024.3.9-rc.0/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2024.3.9-rc.0/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2024.3.9-rc.0/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2024.3.9-rc.0/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2024.3.9-rc.0/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.3.9-rc.0/CONTRIBUTING).
