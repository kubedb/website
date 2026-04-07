---
title: Memcached
menu:
  docs_v2021.12.21:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2021.12.21
section_menu_id: guides
url: /docs/v2021.12.21/guides/memcached/
aliases:
- /docs/v2021.12.21/guides/memcached/README/
info:
  autoscaler: v0.9.2
  cli: v0.24.0
  community: v0.24.2
  enterprise: v0.11.2
  installer: v2021.12.21
  version: v2021.12.21
---

> New to KubeDB? Please start [here](/docs/v2021.12.21/README).

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
  <img alt="lifecycle"  src="/docs/v2021.12.21/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2021.12.21/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.12.21/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.12.21/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.12.21/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2021.12.21/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2021.12.21/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.12.21/CONTRIBUTING).
