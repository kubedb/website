---
title: Elasticsearch
menu:
  docs_0.10.0:
    identifier: es-readme-elasticsearch
    name: Elasticsearch
    parent: es-elasticsearch-guides
    weight: 10
menu_name: docs_0.10.0
section_menu_id: guides
url: /docs/0.10.0/guides/elasticsearch/
aliases:
- /docs/0.10.0/guides/elasticsearch/README/
info:
  version: 0.10.0
---

> New to KubeDB? Please start [here](/docs/0.10.0/concepts/README).

## Supported Elasticsearch Features

|                                       Features                                        | Availability |
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
| Using CoreOS Prometheus Operator                                                      |   &#10003;   |
| Custom Configuration                                                                  |   &#10003;   |
| Using Custom Docker Image                                                             |   &#10003;   |

<br/>

## Life Cycle of an Elasticsearch Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.10.0/images/elasticsearch/lifecycle.png">
</p>

<br/>

## Supported Elasticsearch Version

| KubeDB Version | Elasticsearch:2.3 | Elasticsearch:5.6 | Elasticsearch:6.2 | Elasticsearch:6.3 | Elasticsearch:6.4 |
| :------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| 0.1.0 - 0.7.0  |     &#10003;      |     &#10007;      |     &#10007;      |     &#10007;      |     &#10007;      |
|     0.8.0      |     &#10007;      |     &#10003;      |     &#10003;      |     &#10007;      |     &#10007;      |
|     0.9.0      |     &#10007;      |     &#10003;      |     &#10003;      |     &#10003;      |     &#10003;      |
|     0.10.0     |     &#10007;      |     &#10003;      |     &#10003;      |     &#10003;      |     &#10003;      |

## Supported ElasticsearchVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|   NAME   | VERSION | KubeDB: 0.9.0 | KubeDB: 0.10.0 |
| :------: | :-----: | :-----------: | :------------: |
|   5.6    |   5.6   |   &#10007;    |    &#10007;    |
|  5.6-v1  |   5.6   |   &#10003;    |    &#10003;    |
|  5.6.4   |  5.6.4  |   &#10007;    |    &#10007;    |
| 5.6.4-v1 |  5.6.4  |   &#10003;    |    &#10003;    |
|   6.2    |   6.2   |   &#10007;    |    &#10007;    |
|  6.2-v1  |   6.2   |   &#10003;    |    &#10003;    |
|  6.2.4   |  6.2.4  |   &#10007;    |    &#10007;    |
| 6.2.4-v1 |  6.2.4  |   &#10003;    |    &#10003;    |
|   6.3    |   6.3   |   &#10007;    |    &#10007;    |
|  6.3-v1  |   6.3   |   &#10003;    |    &#10003;    |
|  6.3.0   |  6.3.0  |   &#10007;    |    &#10007;    |
| 6.3.0-v1 |  6.3.0  |   &#10003;    |    &#10003;    |
|   6.4    |   6.4   |   &#10003;    |    &#10003;    |
|  6.4.0   |  6.4.0  |   &#10003;    |    &#10003;    |

## External tools dependency

|                               Tool                               |           Version           |
| :--------------------------------------------------------------: | :-------------------------: |
|   [Search Guard](https://github.com/floragunncom/search-guard)   | `5.6.4-18` and `6.2.4-22.1` |
| [Elasticdump](https://github.com/taskrabbit/elasticsearch-dump/) |    `3.3.1` and `3.3.14`     |
|              [osm](https://github.com/appscode/osm)              |           `0.9.1`           |
|              [yq](https://github.com/mikefarah/yq)               |           `2.1.1`           |

<br/>

## User Guide

- [Quickstart Elasticsearch](/docs/0.10.0/guides/elasticsearch/quickstart/quickstart) with KubeDB Operator.
- [Take instant backup](/docs/0.10.0/guides/elasticsearch/snapshot/instant_backup) of Elasticsearch database using KubeDB.
- [Schedule backup](/docs/0.10.0/guides/elasticsearch/snapshot/scheduled_backup)  of Elasticsearch database.
- Initialize [Elasticsearch with Snapshot](/docs/0.10.0/guides/elasticsearch/initialization/snapshot_source).
- [Elasticsearch Topology](/docs/0.10.0/guides/elasticsearch/clustering/topology) supported by KubeDB
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/0.10.0/guides/elasticsearch/monitoring/using-builtin-prometheus).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` CoreOS Prometheus Operator](/docs/0.10.0/guides/elasticsearch/monitoring/using-coreos-prometheus-operator).
- Use [private Docker registry](/docs/0.10.0/guides/elasticsearch/private-registry/using-private-registry) to deploy Elasticsearch with KubeDB.
- Use [kubedb cli](/docs/0.10.0/guides/elasticsearch/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Elasticsearch object](/docs/0.10.0/concepts/databases/elasticsearch).
- Detail concepts of [Snapshot object](/docs/0.10.0/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.10.0/CONTRIBUTING).

