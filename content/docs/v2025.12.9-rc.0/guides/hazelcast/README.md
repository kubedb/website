---
title: Hazelcast
menu:
  docs_v2025.12.9-rc.0:
    identifier: hz-readme-hazelcast
    name: Hazelcast
    parent: hz-guides
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
url: /docs/v2025.12.9-rc.0/guides/hazelcast/
aliases:
- /docs/v2025.12.9-rc.0/guides/hazelcast/README/
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

### Overview

Hazelcast is an open-source, Java-based, information retrieval library with support for limited relational, graph, statistical, data analysis or storage related use cases. Hazelcast is designed to drive powerful document retrieval or analytical applications involving unstructured data, semi-structured data or a mix of unstructured and structured data. Hazelcast is highly reliable, scalable and fault tolerant, providing distributed indexing, replication and load-balanced querying, automated failover and recovery, centralized configuration and more. Hazelcast powers the search and navigation features of many of the world's largest internet sites.

## Supported Hazelcast Features
| Features                                           | Availability |
|----------------------------------------------------|:------------:|
| Clustering                                         |   &#10003;   |
| Customized Docker Image                            |   &#10003;   |
| Authentication & Autorization                      |   &#10003;   | 
| Reconfigurable Health Checker                      |   &#10003;   |
| Custom Configuration                               |   &#10003;   | 
| Grafana Dashboards                                 |   &#10003;   | 
| Externally manageable Auth Secret                  |   &#10003;   |
| Persistent Volume                                  |   &#10003;   |
| Monitoring with Prometheus & Grafana               |   &#10003;   |
| Builtin Prometheus Discovery                       |   &#10003;   | 
| Alert Dashboard                                    |   &#10003;   |
| Using Prometheus operator                          |   &#10003;   |
| Automated Version Update                           |   &#10003;   |
| Automatic Vertical Scaling                         |   &#10003;   |
| Automated Horizontal Scaling                       |   &#10003;   |
| Automated Volume Expansion                         |   &#10003;   |
| Autoscaling (vertically, volume)                   |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( Cert Manager )  |   &#10003;   |
## Life Cycle of a Hazelcast Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.12.9-rc.0/guides/hazelcast/quickstart/overview/images/Lifecycle-of-a-hazelcast-instance.png">
</p>

## User Guide

- [Quickstart Hazelcast](/docs/v2025.12.9-rc.0/guides/hazelcast/quickstart/overview/) with KubeDB Operator.
- Detail Concept of [Hazelcast Object](/docs/v2025.12.9-rc.0/guides/hazelcast/concepts/hazelcast).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.12.9-rc.0/CONTRIBUTING).