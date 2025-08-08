---
title: Memcached
menu:
  docs_v2021.03.17:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2021.03.17
section_menu_id: guides
url: /docs/v2021.03.17/guides/memcached/
aliases:
- /docs/v2021.03.17/guides/memcached/README/
info:
  autoscaler: v0.2.1
  cli: v0.17.1
  community: v0.17.1
  enterprise: v0.4.1
  installer: v0.17.1
  version: v2021.03.17
---

> New to KubeDB? Please start [here](/docs/v2021.03.17/README).

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
  <img alt="lifecycle"  src="/docs/v2021.03.17/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2021.03.17/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.03.17/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.03.17/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.03.17/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2021.03.17/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2021.03.17/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.03.17/CONTRIBUTING).
