---
title: Solr
menu:
  docs_v2024.7.11-rc.1:
    identifier: sl-readme-solr
    name: Solr
    parent: sl-solr-guides
    weight: 10
menu_name: docs_v2024.7.11-rc.1
section_menu_id: guides
url: /docs/v2024.7.11-rc.1/guides/solr/
aliases:
- /docs/v2024.7.11-rc.1/guides/solr/README/
info:
  autoscaler: v0.32.0-rc.1
  cli: v0.47.0-rc.1
  dashboard: v0.23.0-rc.1
  installer: v2024.7.11-rc.1
  ops-manager: v0.34.0-rc.1
  provisioner: v0.47.0-rc.1
  schema-manager: v0.23.0-rc.1
  ui-server: v0.23.0-rc.1
  version: v2024.7.11-rc.1
  webhook-server: v0.23.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2024.7.11-rc.1/README).

### Overview

Solr is an open-source, Java-based, information retrieval library with support for limited relational, graph, statistical, data analysis or storage related use cases. Solr is designed to drive powerful document retrieval or analytical applications involving unstructured data, semi-structured data or a mix of unstructured and structured data. Solr is highly reliable, scalable and fault tolerant, providing distributed indexing, replication and load-balanced querying, automated failover and recovery, centralized configuration and more. Solr powers the search and navigation features of many of the world's largest internet sites.

## Supported Solr Features
| Features                             | Availability |
|--------------------------------------|:------------:|
| Clustering                           |   &#10003;   |
| Customized Docker Image              |   &#10003;   |
| Authentication & Autorization        |   &#10003;   | 
| Reconfigurable Health Checker        |   &#10003;   |
| Custom Configuration                 |   &#10003;   | 
| Grafana Dashboards                   |   &#10003;   | 
| Externally manageable Auth Secret    |   &#10003;   |
| Persistent Volume                    |   &#10003;   |
| Monitoring with Prometheus & Grafana |   &#10003;   |
| Builtin Prometheus Discovery         |   &#10003;   | 
| Alert Dashboard                      |   &#10003;   |
| Using Prometheus operator            |   &#10003;   |
| Dashboard ( Solr UI )                |   &#10003;   |

## Life Cycle of a Solr Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2024.7.11-rc.1/guides/solr/quickstart/overview/images/Lifecycle-of-a-solr-instance.png">
</p>

## User Guide

- [Quickstart Solr](/docs/v2024.7.11-rc.1/guides/solr/quickstart/overview/) with KubeDB Operator.
- Detail Concept of [Solr Object](/docs/v2024.7.11-rc.1/guides/solr/concepts/solr).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.7.11-rc.1/CONTRIBUTING).