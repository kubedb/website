---
title: MySQL
menu:
  docs_v2020.10.24-beta.0:
    identifier: my-readme-mysql
    name: MySQL
    parent: my-mysql-guides
    weight: 10
menu_name: docs_v2020.10.24-beta.0
section_menu_id: guides
url: /docs/v2020.10.24-beta.0/guides/mysql/
aliases:
- /docs/v2020.10.24-beta.0/guides/mysql/README/
info:
  cli: v0.14.0-beta.4
  community: v0.14.0-beta.4
  enterprise: v0.1.0-beta.4
  installer: v0.14.0-beta.4
  version: v2020.10.24-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.24-beta.0/README).

## Supported MySQL Features

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
| Using Prometheus operator                        |   &#10003;   |

## Life Cycle of a MySQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2020.10.24-beta.0/images/mysql/mysql-lifecycle.png" >
</p>

## Supported MySQL Versions

| KubeDB Version | MySQL:8.0 | MySQL:5.7 |
| :------------: | :-------: | :-------: |
| 0.1.0 - 0.7.0  | &#10007;  | &#10007;  |
|     0.8.0      | &#10003;  | &#10003;  |
|     0.9.0      | &#10003;  | &#10003;  |
|     0.10.0     | &#10003;  | &#10003;  |
|     0.11.0     | &#10003;  | &#10003;  |
|     0.12.0     | &#10003;  | &#10003;  |
|  v0.13.0-rc.0  | &#10003;  | &#10003;  |

## Supported MySQLVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|  NAME  | VERSION | KubeDB: 0.9.0 | KubeDB: 0.10.0 | KubeDB: 0.11.0 | KubeDB: 0.12.0 | KubeDB: v0.13.0-rc.0 |
| :----: | :-----: | :-----------: | :------------: | :------------: | :------------: | :------------------: |
|   5    |    5    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|  5.7   |   5.7   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|   8    |    8    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|  8.0   |   8.0   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|  5-v1  |    5    |   &#10003;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
| 5.7-v1 |   5.7   |   &#10003;    |    &#10003;    |    &#10007;    |    &#10003;    |       &#10003;       |
| 5.7-v2 | 5.7.25  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
| 5.7.25 | 5.7.25  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
|  8-v1  |    8    |   &#10003;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
| 8.0-v1 |  8.0.3  |   &#10003;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
| 8.0-v2 | 8.0.14  |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
| 8.0.3  |  8.0.3  |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |
| 8.0.14 | 8.0.14  |   &#10007;    |    &#10003;    |    &#10003;    |    &#10003;    |       &#10003;       |

## External tools dependency

|                                      Tool                                      | Version |
| :----------------------------------------------------------------------------: | :-----: |
| [peer-finder](https://github.com/kubernetes/contrib/tree/master/peer-finder)   | latest  |
|                 [osm](https://github.com/appscode/osm)                         |  0.9.1  |

## User Guide

- [Quickstart MySQL](/docs/v2020.10.24-beta.0/guides/mysql/quickstart/quickstart) with KubeDB Operator.
- [Backup & Restore](/docs/v2020.10.24-beta.0/guides/mysql/backup/stash) MySQL databases using Stash.
- Initialize [MySQL with Script](/docs/v2020.10.24-beta.0/guides/mysql/initialization/using-script).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2020.10.24-beta.0/guides/mysql/monitoring/using-prometheus-operator).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.10.24-beta.0/guides/mysql/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2020.10.24-beta.0/guides/mysql/private-registry/using-private-registry) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2020.10.24-beta.0/guides/mysql/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2020.10.24-beta.0/guides/mysql/concepts/mysql).
- Detail concepts of [MySQLVersion object](/docs/v2020.10.24-beta.0/guides/mysql/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.10.24-beta.0/CONTRIBUTING).
