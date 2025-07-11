---
title: SingleStore
menu:
  docs_v2025.4.30:
    identifier: guides-singlestore-readme
    name: SingleStore
    parent: guides-singlestore
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
url: /docs/v2025.4.30/guides/singlestore/
aliases:
- /docs/v2025.4.30/guides/singlestore/README/
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Overview 

SingleStore, a distributed SQL database for real-time analytics, transactional workloads, and operational applications. With its in-memory processing and scalable architecture, SingleStore enables organizations to achieve high-performance and low-latency data processing across diverse data sets, making it ideal for modern data-intensive applications and analytical workflows. 

## Supported SingleStore Features

| Features                                                                   | Availability |
|----------------------------------------------------------------------------|:------------:|
| Clustering                                                                 |   &#10003;   |
| Authentication & Authorization                                             |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh)                    |   &#10003;   |
| Backup/Recovery: Instant, Scheduled ( [KubeStash](https://kubestash.com/)) |   &#10003;   |
| Custom Configuration                                                       |   &#10003;   |
| Initializing from Snapshot ( [KubeStash](https://kubestash.com/))          |   &#10003;   |
| TLS: Add ( [Cert Manager]((https://cert-manager.io/docs/)))                |   &#10003;   |
| Monitoring with Prometheus & Grafana                                       |   &#10003;   |
| Builtin Prometheus Discovery                                               |   &#10003;   |
| Using Prometheus operator                                                  |   &#10003;   |
| Externally manageable Auth Secret                                          |   &#10003;   |
| Reconfigurable Health Checker                                              |   &#10003;   |
| Persistent volume                                                          |   &#10003;   | 
| SingleStore Studio (UI)                                                    |   &#10003;   |


## Supported SingleStore Versions

KubeDB supports the following SingleSore Versions.
- `8.1.32`
- `8.5.30`
- `8.7.10`
- `8.7.21`
- `8.9.3`

## Life Cycle of a SingleStore Object

<!---
ref : https://cacoo.com/diagrams/4PxSEzhFdNJRIbIb/0281B
--->

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.4.30/guides/singlestore/images/singlestore-lifecycle.png" >
</p>

## User Guide

- [Quickstart SingleStore](/docs/v2025.4.30/guides/singlestore/quickstart/quickstart) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.4.30/CONTRIBUTING).