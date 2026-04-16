---
title: Memcached
menu:
  docs_v2025.12.31-rc.1:
    identifier: mc-readme-memcached
    name: Memcached
    parent: mc-memcached-guides
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
url: /docs/v2025.12.31-rc.1/guides/memcached/
aliases:
- /docs/v2025.12.31-rc.1/guides/memcached/README/
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

## Overview
`Memcached` is an in-memory key-value store that allows for high-performance, low-latency data caching. It is often used to speed up dynamic web applications by offloading frequent, computationally expensive database queries and storing data that needs to be retrieved fast. Memcached is frequently used in contexts where the rapid retrieval of tiny data items, such as session data, query results, and user profiles, is critical for increasing application performance. It is especially well-suited for use cases requiring scalability, distributed caching, and high throughput, making it a popular choice for powering online and mobile apps, particularly in high-concurrency environments. Memcached is a simple, extremely efficient caching layer that minimizes stress on backend systems and improves performance for applications that require real-time data.

## Supported Memcached Features

| Features                                              | Availability |
| ----------------------------------------------------- | :----------: |
| Custom Configuration                                  |   &#10003;   |
| Externally manageable Auth Secret	                    |   &#10003;   |
| Reconfigurable Health Checker		                      |   &#10003;   |
| Using Custom docker image                             |   &#10003;   |
| Builtin Prometheus Discovery                          |   &#10003;   |
| Operator Managed Prometheus Discovery                 |   &#10003;   |
| Automated Version Update                              |   &#10003;   |
| Automated Vertical Scaling                            |   &#10003;   |
| Automated Horizontal Scaling                          |   &#10003;   |
| Automated db-configure Reconfiguration                |   &#10003;   |
| Authentication & Authorization                        |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( Cert Manager )	    |   &#10003;   |
| Autoscaling (Vertically)                              |   &#10003;   |
| Multiple Memcached Versions                           |   &#10003;   |
| Monitoring using Prometheus and Grafana               |   &#10003;   |
| Monitoring Grafana Dashboard                          |   &#10003;   |
| Alert Grafana Dashboard	                              |   &#10003;   |

## Life Cycle of a Memcached Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.12.31-rc.1/images/memcached/memcached-lifecycle.png">
</p>

## User Guide

- [Quickstart Memcached](/docs/v2025.12.31-rc.1/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.12.31-rc.1/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.12.31-rc.1/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.12.31-rc.1/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2025.12.31-rc.1/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2025.12.31-rc.1/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.12.31-rc.1/CONTRIBUTING).
