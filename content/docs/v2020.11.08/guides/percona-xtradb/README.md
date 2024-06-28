---
title: PerconaXtraDB
menu:
  docs_v2020.11.08:
    identifier: readme-percona-xtradb
    name: PerconaXtraDB
    parent: px-percona-xtradb-guides
    weight: 40
menu_name: docs_v2020.11.08
section_menu_id: guides
url: /docs/v2020.11.08/guides/percona-xtradb/
aliases:
- /docs/v2020.11.08/guides/percona-xtradb/README/
info:
  cli: v0.14.1
  community: v0.14.1
  enterprise: v0.1.1
  installer: v0.14.1
  version: v2020.11.08
---

> New to KubeDB? Please start [here](/docs/v2020.11.08/README).

## Supported PerconaXtraDB Features

| Features                                                | Availability |
| ------------------------------------------------------- | :----------: |
| Clustering                                              |   &#10003;   |
| Persistent Volume                                       |   &#10003;   |
| Instant Backup                                          |   &#10003;   |
| Scheduled Backup                                        |   &#10003;   |
| Initialize using Snapshot                               |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh) |   &#10003;   |
| Custom Configuration                                    |   &#10003;   |
| Using Custom docker image                               |   &#10003;   |
| Builtin Prometheus Discovery                            |   &#10003;   |
| Using Prometheus operator                               |   &#10003;   |

## Life Cycle of a PerconaXtraDB Object

<p align="center">
  <img alt="lifecycle" src="/docs/v2020.11.08/images/percona-xtradb/Lifecycle_of_a_PerconaXtraDB.svg" >
</p>

## User Guide

- [Overview](/docs/v2020.11.08/guides/percona-xtradb/overview/overview) of PerconaXtraDB.
- [Quickstart PerconaXtraDB](/docs/v2020.11.08/guides/percona-xtradb/quickstart/quickstart) with KubeDB Operator.
- How to run [PerconaXtraDB Cluster](/docs/v2020.11.08/guides/percona-xtradb/clustering/percona-xtradb-cluster).
- Monitor your PerconaXtraDB database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2020.11.08/guides/percona-xtradb/monitoring/using-prometheus-operator).
- Monitor your PerconaXtraDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.11.08/guides/percona-xtradb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2020.11.08/guides/percona-xtradb/private-registry/using-private-registry) to deploy PerconaXtraDB with KubeDB.
- Use Stash to [Backup PerconaXtraDB](/docs/v2020.11.08/guides/percona-xtradb/backup/stash).
- How to use [custom configuration](/docs/v2020.11.08/guides/percona-xtradb/configuration/using-config-file).
- Detail concepts of [PerconaXtraDB object](/docs/v2020.11.08/guides/percona-xtradb/concepts/percona-xtradb).
- Detail concepts of [PerconaXtraDBVersion object](/docs/v2020.11.08/guides/percona-xtradb/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.11.08/CONTRIBUTING).
