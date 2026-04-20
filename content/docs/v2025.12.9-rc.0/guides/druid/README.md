---
title: Druid
menu:
  docs_v2025.12.9-rc.0:
    identifier: guides-druid-readme
    name: Druid
    parent: guides-druid
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
url: /docs/v2025.12.9-rc.0/guides/druid/
aliases:
- /docs/v2025.12.9-rc.0/guides/druid/README/
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

## Overview

Apache Druid is a real-time analytics database designed for fast slice-and-dice analytics ("OLAP" queries) on large data sets. Druid is most often used as a database for powering use cases where real-time ingest, fast query performance, and high uptime are important. As such, Druid is commonly used for powering GUIs of analytical applications, or as a backend for highly-concurrent APIs that need fast aggregations. Druid works best with event-oriented data.

## Supported Druid Features


| Features                                                                           | Availability |
|------------------------------------------------------------------------------------|:-----:|
| Clustering                                                                         |   &#10003; |
| Druid Dependency Management (MySQL, PostgreSQL and ZooKeeper)                      |   &#10003; |
| Authentication & Authorization                                                     |   &#10003; |
| Custom Configuration                                                               |   &#10003; |
| Backup/Recovery: Instant, Scheduled ( [KubeStash](https://kubestash.com/))         |   &#10003; |
| Monitoring with Prometheus & Grafana                                               |   &#10003; |
| Builtin Prometheus Discovery                                                       |   &#10003; |
| Using Prometheus operator                                                          |   &#10003; |
| Externally manageable Auth Secret                                                  |   &#10003; |
| Reconfigurable Health Checker                                                      |   &#10003; |
| Persistent volume                                                                  |   &#10003; | 
| Dashboard ( Druid Web Console )                                                    |   &#10003; |
| Automated Version Update                                                           |  &#10003;  |
| Automatic Vertical Scaling                                                         |  &#10003;  |
| Automated Horizontal Scaling                                                       |  &#10003;  |
| Automated db-configure Reconfiguration                                             |  &#10003;  |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) |  &#10003;  |
| Automated Reprovision                                                              |  &#10003;  |
| Automated Volume Expansion                                                         |  &#10003;  |
| Autoscaling (vertically)                                                           |  &#10003;  |

## Supported Druid Versions

KubeDB supports The following Druid versions.
- `28.0.1`
- `30.0.1`

> The listed DruidVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [DruidVersion](/docs/v2025.12.9-rc.0/guides/druid/concepts/druidversion) object with your custom Druid image.

## Lifecycle of Druid Object

<!---
ref : https://cacoo.com/diagrams/bbB63L6KRIbPLl95/9A5B0
--->

<p align="center">
<img alt="lifecycle"  src="/docs/v2025.12.9-rc.0/images/druid/Druid-CRD-Lifecycle.png">
</p>

## User Guide 
- [Quickstart Druid](/docs/v2025.12.9-rc.0/guides/druid/quickstart/guide/) with KubeDB Operator.
- [Druid Clustering](/docs/v2025.12.9-rc.0/guides/druid/clustering/overview/) with KubeDB Operator.
- [Backup & Restore](/docs/v2025.12.9-rc.0/guides/druid/backup/overview/) Druid databases using KubeStash.
- Start [Druid with Custom Config](/docs/v2025.12.9-rc.0/guides/druid/configuration/_index).
- Monitor your Druid database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.12.9-rc.0/guides/druid/monitoring/using-prometheus-operator).
- Monitor your Druid database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.12.9-rc.0/guides/druid/monitoring/using-builtin-prometheus).
- Detail concepts of [Druid object](/docs/v2025.12.9-rc.0/guides/druid/concepts/druid).
- Detail concepts of [DruidVersion object](/docs/v2025.12.9-rc.0/guides/druid/concepts/druidversion).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.12.9-rc.0/CONTRIBUTING).