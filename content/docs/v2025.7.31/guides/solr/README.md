---
title: Solr
menu:
  docs_v2025.7.31:
    identifier: sl-readme-solr
    name: Solr
    parent: sl-solr-guides
    weight: 10
menu_name: docs_v2025.7.31
section_menu_id: guides
url: /docs/v2025.7.31/guides/solr/
aliases:
- /docs/v2025.7.31/guides/solr/README/
info:
  autoscaler: v0.42.0
  cli: v0.57.0
  dashboard: v0.33.0
  installer: v2025.7.31
  ops-manager: v0.44.0
  provisioner: v0.57.0
  schema-manager: v0.33.0
  ui-server: v0.33.0
  version: v2025.7.31
  webhook-server: v0.33.0
---

> New to KubeDB? Please start [here](/docs/v2025.7.31/README).

### Overview

Solr is an open-source, Java-based, information retrieval library with support for limited relational, graph, statistical, data analysis or storage related use cases. Solr is designed to drive powerful document retrieval or analytical applications involving unstructured data, semi-structured data or a mix of unstructured and structured data. Solr is highly reliable, scalable and fault tolerant, providing distributed indexing, replication and load-balanced querying, automated failover and recovery, centralized configuration and more. Solr powers the search and navigation features of many of the world's largest internet sites.

## Supported Solr Features
| Features                                                                           | Availability |
|------------------------------------------------------------------------------------|:------------:|
| Clustering                                                                         |   &#10003;   |
| Customized Docker Image                                                            |   &#10003;   |
| Authentication & Autorization                                                      |   &#10003;   | 
| Reconfigurable Health Checker                                                      |   &#10003;   |
| Custom Configuration                                                               |   &#10003;   | 
| Grafana Dashboards                                                                 |   &#10003;   | 
| Externally manageable Auth Secret                                                  |   &#10003;   |
| Persistent Volume                                                                  |   &#10003;   |
| Monitoring with Prometheus & Grafana                                               |   &#10003;   |
| Builtin Prometheus Discovery                                                       |   &#10003;   | 
| Alert Dashboard                                                                    |   &#10003;   |
| Using Prometheus operator                                                          |   &#10003;   |
| Dashboard ( Solr UI )                                                              |   &#10003;   |
| Automated Version Update                                                           |   &#10003;   |
| Automatic Vertical Scaling                                                         |   &#10003;   |
| Automated Horizontal Scaling                                                       |   &#10003;   |
| Automated db-configure Reconfiguration                                             |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) |   &#10003;   |
| Automated Reprovision                                                              |   &#10003;   |
| Automated Volume Expansion                                                         |   &#10003;   |
| Autoscaling (vertically)                                                           |   &#10003;   |

## Life Cycle of a Solr Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.7.31/guides/solr/quickstart/overview/images/Lifecycle-of-a-solr-instance.png">
</p>

## User Guide

- [Quickstart Solr](/docs/v2025.7.31/guides/solr/quickstart/overview/) with KubeDB Operator.
- Detail Concept of [Solr Object](/docs/v2025.7.31/guides/solr/concepts/solr).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.7.31/CONTRIBUTING).