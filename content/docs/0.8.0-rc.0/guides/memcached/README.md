---
title: Memcached
menu:
  docs_0.8.0-rc.0:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_0.8.0-rc.0
section_menu_id: guides
url: /docs/0.8.0-rc.0/guides/memcached/
aliases:
- /docs/0.8.0-rc.0/guides/memcached/README/
info:
  version: 0.8.0-rc.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-rc.0/concepts/README).

## Supported Memcached Features

|Features                                 | Availability |
|-----------------------------------------|:------------:|
|Clustering                               | &#10007;     |
|Persistent Volume                        | &#10007;     |
|Instant Backup                           | &#10007;     |
|Scheduled Backup                         | &#10007;     |
|Initialize using Snapshot                | &#10007;     |
|Initialize using Script                  | &#10007;     |
|Builtin Prometheus Discovery             | &#10003;     |
|Using CoreOS Prometheus Operator         | &#10003;     |

<br/>

## Life Cycle of a Memcached Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.8.0-rc.0/images/memcached/memcached-lifecycle.png" width="550" height="640">
</p>

<br/>

## Supported Memcached Versions

| KubeDB Version | Memcached:1.5.4 |
|:--------------:|:---------------:|
| 0.1.0 - 0.7.0  | &#10007;        |
| 0.8.0-beta.2   | &#10003;        |
| 0.8.0-rc.0   | &#10003;        |

<br/>

## User Guide

- [Quickstart Memcached](/docs/0.8.0-rc.0/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.8.0-rc.0/guides/memcached/monitoring/using-coreos-prometheus-operator).
- Monitor your Memcached database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.8.0-rc.0/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.8.0-rc.0/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/0.8.0-rc.0/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/0.8.0-rc.0/concepts/databases/memcached).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-rc.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-rc.0/CONTRIBUTING).
