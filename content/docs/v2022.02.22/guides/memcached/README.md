---
title: Memcached
menu:
  docs_v2022.02.22:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2022.02.22
section_menu_id: guides
url: /docs/v2022.02.22/guides/memcached/
aliases:
- /docs/v2022.02.22/guides/memcached/README/
info:
  autoscaler: v0.10.0
  cli: v0.25.0
  community: v0.25.0
  dashboard: v0.1.0
  enterprise: v0.12.0
  installer: v2022.02.22
  schema-manager: v0.1.0
  ui-server: v0.1.0
  version: v2022.02.22
  webhook-server: v0.1.0
---

> New to KubeDB? Please start [here](/docs/v2022.02.22/README).

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
  <img alt="lifecycle"  src="/docs/v2022.02.22/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2022.02.22/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2022.02.22/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2022.02.22/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2022.02.22/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2022.02.22/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2022.02.22/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.02.22/CONTRIBUTING).
