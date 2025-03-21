---
title: Elasticsearch
menu:
  docs_v2021.01.02-rc.0:
    identifier: es-readme-elasticsearch
    name: Elasticsearch
    parent: es-elasticsearch-guides
    weight: 10
menu_name: docs_v2021.01.02-rc.0
section_menu_id: guides
url: /docs/v2021.01.02-rc.0/guides/elasticsearch/
aliases:
- /docs/v2021.01.02-rc.0/guides/elasticsearch/README/
info:
  autoscaler: v0.1.0-rc.0
  cli: v0.16.0-rc.0
  community: v0.16.0-rc.0
  enterprise: v0.3.0-rc.0
  installer: v0.16.0-rc.0
  version: v2021.01.02-rc.0
---

> New to KubeDB? Please start [here](/docs/v2021.01.02-rc.0/README).

## Supported Elasticsearch Features

| Features                                                                              | Availability |
| ------------------------------------------------------------------------------------- | :----------: |
| Clustering                                                                            |   &#10003;   |
| Authentication (using [Search Guard](https://github.com/floragunncom/search-guard))   |   &#10003;   |
| Authorization (using [Search Guard](https://github.com/floragunncom/search-guard))    |   &#10003;   |
| TLS certificates (using [Search Guard](https://github.com/floragunncom/search-guard)) |   &#10003;   |
| Persistent Volume                                                                     |   &#10003;   |
| Instant Backup                                                                        |   &#10003;   |
| Scheduled Backup                                                                      |   &#10003;   |
| Initialization from Script                                                            |   &#10007;   |
| Initialization from Snapshot                                                          |   &#10003;   |
| Builtin Prometheus Discovery                                                          |   &#10003;   |
| Using Prometheus operator                                                             |   &#10003;   |
| Custom Configuration                                                                  |   &#10003;   |
| Using Custom Docker Image                                                             |   &#10003;   |

## Life Cycle of an Elasticsearch Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2021.01.02-rc.0/images/elasticsearch/lifecycle.png">
</p>

## User Guide

- [Quickstart Elasticsearch](/docs/v2021.01.02-rc.0/guides/elasticsearch/quickstart/quickstart) with KubeDB Operator.
- [Backup & Restore Elasticsearch](/docs/v2021.01.02-rc.0/guides/elasticsearch/backup/stash) database using Stash.
- [Elasticsearch Topology](/docs/v2021.01.02-rc.0/guides/elasticsearch/clustering/topology) supported by KubeDB
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2021.01.02-rc.0/guides/elasticsearch/monitoring/using-builtin-prometheus).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2021.01.02-rc.0/guides/elasticsearch/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2021.01.02-rc.0/guides/elasticsearch/private-registry/using-private-registry) to deploy Elasticsearch with KubeDB.
- Use [kubedb cli](/docs/v2021.01.02-rc.0/guides/elasticsearch/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Elasticsearch object](/docs/v2021.01.02-rc.0/guides/elasticsearch/concepts/elasticsearch).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.01.02-rc.0/CONTRIBUTING).
