---
title: Memcached
menu:
  docs_v2023.08.18:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2023.08.18
section_menu_id: guides
url: /docs/v2023.08.18/guides/memcached/
aliases:
- /docs/v2023.08.18/guides/memcached/README/
info:
  autoscaler: v0.20.0
  cli: v0.35.0
  dashboard: v0.11.0
  installer: v2023.08.18
  ops-manager: v0.22.0
  provisioner: v0.35.0
  schema-manager: v0.11.0
  ui-server: v0.11.0
  version: v2023.08.18
  webhook-server: v0.11.0
---

> New to KubeDB? Please start [here](/docs/v2023.08.18/README).

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
  <img alt="lifecycle"  src="/docs/v2023.08.18/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2023.08.18/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2023.08.18/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2023.08.18/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2023.08.18/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2023.08.18/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2023.08.18/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2023.08.18/CONTRIBUTING).
