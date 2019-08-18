---
title: Memcached
menu:
  docs_0.9.0:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_0.9.0
section_menu_id: guides
url: /docs/0.9.0/guides/memcached/
aliases:
- /docs/0.9.0/guides/memcached/README/
---

> New to KubeDB? Please start [here](/docs/0.9.0/concepts/README).

## Supported Memcached Features

|             Features             | Availability |
| -------------------------------- | :----------: |
| Clustering                       |   &#10007;   |
| Persistent Volume                |   &#10007;   |
| Instant Backup                   |   &#10007;   |
| Scheduled Backup                 |   &#10007;   |
| Initialize using Snapshot        |   &#10007;   |
| Initialize using Script          |   &#10007;   |
| Custom Configuration             |   &#10003;   |
| Using Custom docker image        |   &#10003;   |
| Builtin Prometheus Discovery     |   &#10003;   |
| Using CoreOS Prometheus Operator |   &#10003;   |

<br/>

## Life Cycle of a Memcached Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.9.0/images/memcached/memcached-lifecycle.png">
</p>

<br/>

## Supported Memcached Versions

| KubeDB Version | Memcached:1.5.4 |
|:--------------:|:---------------:|
| 0.1.0 - 0.7.0  | &#10007;        |
| 0.8.0          | &#10003;        |
| 0.9.0     | &#10003;        |

## Supported MemcachedVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

| NAME     | VERSION | KubeDB: 0.9.0 |
|----------|---------|--------------------|
| 1.5      | 1.5     | &#10007;           |
| 1.5-v1   | 1.5     | &#10003;           |
| 1.5.4    | 1.5.4   | &#10007;           |
| 1.5.4-v1 | 1.5.4   | &#10003;           |

## User Guide

- [Quickstart Memcached](/docs/0.9.0/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.9.0/guides/memcached/monitoring/using-coreos-prometheus-operator).
- Monitor your Memcached database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.9.0/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.9.0/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/0.9.0/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/0.9.0/concepts/databases/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0/CONTRIBUTING).
