---
title: PerconaXtraDB
menu:
  docs_v2020.07.10-beta.0:
    identifier: readme-percona-xtradb
    name: PerconaXtraDB
    parent: px-percona-xtradb-guides
    weight: 40
menu_name: docs_v2020.07.10-beta.0
section_menu_id: guides
url: /docs/v2020.07.10-beta.0/guides/percona-xtradb/
aliases:
- /docs/v2020.07.10-beta.0/guides/percona-xtradb/README/
info:
  version: v2020.07.10-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.07.10-beta.0/concepts/README).

## Supported PerconaXtraDB Features

|                        Features                         | Availability |
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
| Using CoreOS Prometheus Operator                        |   &#10003;   |

## Life Cycle of a PerconaXtraDB Object

<p align="center">
  <img alt="lifecycle" src="/docs/v2020.07.10-beta.0/images/percona-xtradb/Lifecycle_of_a_PerconaXtraDB.svg" >
</p>

## Supported PerconaXtraDB Versions

| KubeDB Version | PerconaXtraDB:5.7 | PerconaXtraDB:5.7-cluster |
| :------------: | :---------------: | :-----------------------: |
|  v0.13.0-rc.1  |      &#10003;     |         &#10003;          |

## Supported PerconaXtraDBVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|    NAME     | VERSION | KubeDB: v0.13.0-rc.0 | KubeDB: v0.13.0-rc.1 |
| :---------: | :-----: | :------------------: | :------------------: |
|     5.7     |   5.7   |       &#10007;       |       &#10003;       |
| 5.7-cluster |   5.7   |       &#10007;       |       &#10003;       |

## External tools dependency

|                                      Tool                                      | Version |
| :----------------------------------------------------------------------------: | :-----: |
| [peer-finder](https://github.com/kubernetes/contrib/tree/master/peer-finder)   | latest  |

## User Guide

- [Overview](/docs/v2020.07.10-beta.0/guides/percona-xtradb/overview/overview) of PerconaXtraDB.
- [Quickstart PerconaXtraDB](/docs/v2020.07.10-beta.0/guides/percona-xtradb/quickstart/quickstart) with KubeDB Operator.
- How to run [PerconaXtraDB Cluster](/docs/v2020.07.10-beta.0/guides/percona-xtradb/clustering/percona-xtradb-cluster).
- Monitor your PerconaXtraDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v2020.07.10-beta.0/guides/percona-xtradb/monitoring/using-coreos-prometheus-operator).
- Monitor your PerconaXtraDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.07.10-beta.0/guides/percona-xtradb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2020.07.10-beta.0/guides/percona-xtradb/private-registry/using-private-registry) to deploy PerconaXtraDB with KubeDB.
- Use Stash to [Backup PerconaXtraDB](/docs/v2020.07.10-beta.0/guides/percona-xtradb/snapshot/stash).
- How to use [custom configuration](/docs/v2020.07.10-beta.0/guides/percona-xtradb/configuration/using-custom-config).
- Detail concepts of [PerconaXtraDB object](/docs/v2020.07.10-beta.0/concepts/databases/percona-xtradb).
- Detail concepts of [PerconaXtraDBVersion object](/docs/v2020.07.10-beta.0/concepts/catalog/percona-xtradb).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.07.10-beta.0/CONTRIBUTING).
