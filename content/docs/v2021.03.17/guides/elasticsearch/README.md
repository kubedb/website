---
title: Elasticsearch
menu:
  docs_v2021.03.17:
    identifier: es-readme-elasticsearch
    name: Elasticsearch
    parent: es-elasticsearch-guides
    weight: 10
menu_name: docs_v2021.03.17
section_menu_id: guides
url: /docs/v2021.03.17/guides/elasticsearch/
aliases:
- /docs/v2021.03.17/guides/elasticsearch/README/
info:
  autoscaler: v0.2.1
  cli: v0.17.1
  community: v0.17.1
  enterprise: v0.4.1
  installer: v0.17.1
  version: v2021.03.17
---

> New to KubeDB? Please start [here](/docs/v2021.03.17/README).

## Elasticsearch Features

| Features                                                                                                          | Community     | Enterprise    |
| -------------------------------------------------------------------------------------                             | :----------:  | :----------:  |
| Combined Cluster (n nodes with master,data,ingest: ture; n >= 1 )                                                 |   &#10003;    |   &#10003;    |
| Topology Cluster (n master, m data, x ingest nodes; n,m,x >= 1 )                                                  |   &#10003;    |   &#10003;    |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) )                                |   &#10007;    |   &#10003;    |
| Automated Version Upgrade                                                                                         |   &#10007;    |   &#10003;    |
| Automatic Vertical Scaling                                                                                        |   &#10007;    |   &#10003;    |
| Automated Horizontal Scaling                                                                                      |   &#10007;    |   &#10003;    |
| Automated Volume Expansion                                                                                        |   &#10007;    |   &#10003;    |
| Backup/Recovery: Instant, Scheduled ( [Stash](https://stash.run/) )                                               |   &#10003;    |   &#10003;    |
| Initialization from Snapshot ( [Stash](https://stash.run/) )                                                      |   &#10003;    |   &#10003;    |
| Authentication ( [X-Pack](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/setup-xpack.html) / [OpenDistro](https://opendistro.github.io/for-elasticsearch-docs/) / [Search Guard](https://docs.search-guard.com/latest/) )                                  |   &#10003;    |   &#10003;    |
| Authorization ( [X-Pack](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/setup-xpack.html) / [OpenDistro](https://opendistro.github.io/for-elasticsearch-docs/) / [Search Guard](https://docs.search-guard.com/latest/) )                                   |   &#10003;    |   &#10003;    |
| Persistent Volume                                                                                                 |   &#10003;    |   &#10003;    |
| Exports Prometheus Matrices                                                                                       |   &#10003;    |   &#10003;    |
| Custom Configuration                                                                                              |   &#10003;    |   &#10003;    |
| Using Custom Docker Image                                                                                         |   &#10003;    |   &#10003;    |
| Initialization From Script                                                                                        |   &#10007;    |   &#10007;    |

## Available Elasticsearch Version

|   Version   |   X-Pack      | OpenDistro  |   SearchGuard |
| :---------: |  :--------:   | :--------:  | :--------:    |
|   7.10.x    |   &#10007;    |   &#10003;  |   &#10007;    |
|   7.9.x     |   &#10003;    |   &#10003;  |   &#10003;    |
|   7.8.x     |   &#10003;    |   &#10003;  |   &#10003;    |
|   7.7.x     |   &#10003;    |   &#10003;  |   &#10007;    |
|   7.6.x     |   &#10003;    |   &#10003;  |   &#10007;    |
|   7.5.x     |   &#10003;    |   &#10007;  |   &#10003;    |
|   7.4.x     |   &#10003;    |   &#10003;  |   &#10007;    |
|   7.3.x     |   &#10003;    |   &#10003;  |   &#10003;    |
|   7.2.x     |   &#10003;    |   &#10003;  |   &#10007;    |
|   7.1.x     |   &#10003;    |   &#10003;  |   &#10003;    |
|   7.0.x     |   &#10003;    |   &#10003;  |   &#10003;    |
|   6.8.x     |   &#10003;    |   &#10007;  |   &#10003;    |

> The listed ElasticsearchVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [ElasticsearchVersion](/docs/v2021.03.17/guides/elasticsearch/concepts/catalog/) object with your custom Elasticsearch image.

## User Guide

- [Quickstart Elasticsearch](/docs/v2021.03.17/guides/elasticsearch/quickstart/overview/) with KubeDB Operator.
- [Elasticsearch Clustering](/docs/v2021.03.17/guides/elasticsearch/clustering/combined-cluster/) supported by KubeDB
- [Backup & Restore Elasticsearch](/docs/v2021.03.17/guides/elasticsearch/backup/overview/) database using Stash.
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2021.03.17/guides/elasticsearch/monitoring/using-builtin-prometheus).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2021.03.17/guides/elasticsearch/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2021.03.17/guides/elasticsearch/private-registry/using-private-registry) to deploy Elasticsearch with KubeDB.
- Use [kubedb cli](/docs/v2021.03.17/guides/elasticsearch/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Elasticsearch object](/docs/v2021.03.17/guides/elasticsearch/concepts/elasticsearch/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.03.17/CONTRIBUTING).
