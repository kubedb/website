---
title: Elasticsearch
menu:
  docs_v2022.12.28:
    identifier: es-readme-elasticsearch
    name: Elasticsearch
    parent: es-elasticsearch-guides
    weight: 10
menu_name: docs_v2022.12.28
section_menu_id: guides
url: /docs/v2022.12.28/guides/elasticsearch/
aliases:
- /docs/v2022.12.28/guides/elasticsearch/README/
info:
  autoscaler: v0.15.0
  cli: v0.30.0
  dashboard: v0.6.0
  installer: v2022.12.28
  ops-manager: v0.17.0
  provisioner: v0.30.0
  schema-manager: v0.6.0
  ui-server: v0.6.0
  version: v2022.12.28
  webhook-server: v0.6.0
---

> New to KubeDB? Please start [here](/docs/v2022.12.28/README).

## Elasticsearch Features

| Features                                                                                                                                                                                                                                                                        | Community     | Enterprise    |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| :----------:  | :----------:  |
| Combined Cluster (n nodes with master,data,ingest: ture; n >= 1 )                                                                                                                                                                                                               |   &#10003;    |   &#10003;    |
| Topology Cluster (n master, m data, x ingest nodes; n,m,x >= 1 )                                                                                                                                                                                                                |   &#10003;    |   &#10003;    |
| Hot-Warm-Cold Topology Cluster (a hot, b warm, c cold nodes; a,b,c >= 1 )                                                                                                                                                                                                       |   &#10003;    |   &#10003;    |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) )                                                                                                                                                                                              |   &#10007;    |   &#10003;    |
| Automated Version Upgrade                                                                                                                                                                                                                                                       |   &#10007;    |   &#10003;    |
| Automatic Vertical Scaling                                                                                                                                                                                                                                                      |   &#10007;    |   &#10003;    |
| Automated Horizontal Scaling                                                                                                                                                                                                                                                    |   &#10007;    |   &#10003;    |
| Automated Volume Expansion                                                                                                                                                                                                                                                      |   &#10007;    |   &#10003;    |
| Backup/Recovery: Instant, Scheduled ( [Stash](https://stash.run/) )                                                                                                                                                                                                             |   &#10003;    |   &#10003;    |
| Dashboard ( Kibana , Opensearch-Dashboards )                                                                                                                                                                                                                                    |   &#10003;    |   &#10003;    |
| Grafana Dashboards                                                                                                                                                                                                                                                              |    &#10007;    |   &#10003;    |
| Initialization from Snapshot ( [Stash](https://stash.run/) )                                                                                                                                                                                                                    |   &#10003;    |   &#10003;    |
| Authentication ( [OpensSearch](https://opensearch.org/) / [X-Pack](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/setup-xpack.html) / [OpenDistro](https://opendistro.github.io/for-elasticsearch-docs/) / [Search Guard](https://docs.search-guard.com/latest/) ) |   &#10003;    |   &#10003;    |
| Authorization ( [OpensSearch](https://opensearch.org/) / [X-Pack](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/setup-xpack.html) / [OpenDistro](https://opendistro.github.io/for-elasticsearch-docs/) / [Search Guard](https://docs.search-guard.com/latest/) )                                          |   &#10003;    |   &#10003;    |
| Persistent Volume                                                                                                                                                                                                                                                               |   &#10003;    |   &#10003;    |
| Exports Prometheus Matrices                                                                                                                                                                                                                                                     |   &#10003;    |   &#10003;    |
| Custom Configuration                                                                                                                                                                                                                                                            |   &#10003;    |   &#10003;    |
| Using Custom Docker Image                                                                                                                                                                                                                                                       |   &#10003;    |   &#10003;    |
| Initialization From Script                                                                                                                                                                                                                                                      |   &#10007;    |   &#10007;    |

## Available Elasticsearch Versions


<table>
<tr><th>X-Pack</th><th>OpenSearch</th></tr>
<tr>
<td>

| Version | ElasticSearch | Dashboard(Kibana) |
|:-------:|:-------------:|:-----------------:|
|  8.2.x  |   &#10003;    |     &#10003;      |
| 7.17.x  |   &#10003;    |     &#10003;      |
| 7.16.x  |   &#10003;    |     &#10003;      |
| 7.14.x  |   &#10003;    |     &#10003;      |
| 7.13.x  |   &#10003;    |     &#10003;      |
| 7.12.x  |   &#10003;    |     &#10003;      |
|  7.9.x  |   &#10003;    |     &#10003;      |
|  7.8.x  |   &#10003;    |     &#10007;      |
|  7.7.x  |   &#10003;    |     &#10007;      |
|  7.6.x  |   &#10003;    |     &#10007;      |
|  7.5.x  |   &#10003;    |     &#10007;      |
|  7.4.x  |   &#10003;    |     &#10007;      |
|  7.3.x  |   &#10003;    |     &#10007;      |
|  7.2.x  |   &#10003;    |     &#10007;      |
|  7.1.x  |   &#10003;    |     &#10007;      |
|  7.0.x  |   &#10003;    |     &#10007;      |
|  6.8.x  |   &#10003;    |     &#10003;      |
</td>
<td style="vertical-align:top">

| Version | OpenSearch | Dashboard<br/>(OpenSearch-Dashboards) |
|:-------:|:----------:|:-------------------------------------:|
|  1.3.x  |  &#10003;  |               &#10003;                |
|  1.2.x  |  &#10003;  |               &#10003;                |
|  1.1.x  |  &#10003;  |               &#10003;                |
</td>
</tr>
<tr><th>OpenDistro</th><th>SearchGuard</th></tr>
<tr>
<td>

| Version | ElasticSearch | Dashboard(Kibana) |
|:-------:|:-------------:|:-----------------:|
| 7.10.x  |   &#10003;    |     &#10007;      |
|  7.9.x  |   &#10003;    |     &#10007;      |
|  7.8.x  |   &#10003;    |     &#10007;      |
|  7.7.x  |   &#10003;    |     &#10007;      |
|  7.6.x  |   &#10003;    |     &#10007;      |
|  7.4.x  |   &#10003;    |     &#10007;      |
|  7.3.x  |   &#10003;    |     &#10007;      |
|  7.2.x  |   &#10003;    |     &#10007;      |
|  7.1.x  |   &#10003;    |     &#10007;      |
|  7.0.x  |   &#10003;    |     &#10007;      |
</td>
<td style="vertical-align:top">

|  Version   | ElasticSearch | Dashboard(Kibana) |
|:----------:|:-------------:|:-----------------:|
|   7.14.x   |   &#10003;    |     &#10007;      |
|   7.10.x   |   &#10003;    |     &#10007;      |
|   7.9.x    |   &#10003;    |     &#10007;      |
|   7.8.x    |   &#10003;    |     &#10007;      |
|   7.5.x    |   &#10003;    |     &#10007;      |
|   7.3.x    |   &#10003;    |     &#10007;      |
|   7.1.x    |   &#10003;    |     &#10007;      |
|   7.0.x    |   &#10003;    |     &#10007;      |
|   6.8.x    |   &#10003;    |     &#10007;      |
</td>

</tr>

</table>



> The listed ElasticsearchVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [ElasticsearchVersion](/docs/v2022.12.28/guides/elasticsearch/concepts/catalog/) object with your custom Elasticsearch image.

## User Guide

- [Quickstart Elasticsearch](/docs/v2022.12.28/guides/elasticsearch/quickstart/overview/) with KubeDB Operator.
- [Elasticsearch Clustering](/docs/v2022.12.28/guides/elasticsearch/clustering/combined-cluster/) supported by KubeDB
- [Backup & Restore Elasticsearch](/docs/v2022.12.28/guides/elasticsearch/backup/overview/) database using Stash.
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2022.12.28/guides/elasticsearch/monitoring/using-builtin-prometheus).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2022.12.28/guides/elasticsearch/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2022.12.28/guides/elasticsearch/private-registry/using-private-registry) to deploy Elasticsearch with KubeDB.
- Use [kubedb cli](/docs/v2022.12.28/guides/elasticsearch/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Elasticsearch object](/docs/v2022.12.28/guides/elasticsearch/concepts/elasticsearch/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.12.28/CONTRIBUTING).
