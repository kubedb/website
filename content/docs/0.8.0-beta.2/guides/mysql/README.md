---
title: MySQL
menu:
  docs_0.8.0-beta.2:
    identifier: my-readme-mysql
    name: MySQL
    parent: my-mysql-guides
    weight: 10
menu_name: docs_0.8.0-beta.2
section_menu_id: guides
url: /docs/0.8.0-beta.2/guides/mysql/
aliases:
- /docs/0.8.0-beta.2/guides/mysql/README/
info:
  version: 0.8.0-beta.2
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.2/concepts/README).

## Supported MySQL Features

|Features                                                | Availability |
|--------------------------------------------------------|:------------:|
|Clustering                                              | &#10007;     |
|Persistent Volume                                       | &#10003;     |
|Instant Backup                                          | &#10003;     |
|Scheduled Backup                                        | &#10003;     |
|Initialize using Snapshot                               | &#10003;     |
|Initialize using Script (\*.sql, \*sql.gz and/or \*.sh) | &#10003;     |
|Builtin Prometheus Discovery                            | &#10003;     |
|Using CoreOS Prometheus Operator                        | &#10003;     |

<br/>

## Life Cycle of a MySQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.8.0-beta.2/images/mysql/mysql-lifecycle.png" width="600" height="373">
</p>

<br/>

## Supported MySQL Versions

| KubeDB Version | MySQL:8.0 |
|:--------------:|:---------:|
| 0.1.0 - 0.7.0  | &#10007;  |
| 0.8.0-beta.2   | &#10003;  |

## User Guide

- [Quickstart MySQL](/docs/0.8.0-beta.2/guides/mysql/quickstart/quickstart) with KubeDB Operator.
- [Snapshot and Restore](/docs/0.8.0-beta.2/guides/mysql/snapshot/backup-and-restore) process of MySQL databases using KubeDB.
- Take [Scheduled Snapshot](/docs/0.8.0-beta.2/guides/mysql/snapshot/scheduled-backup) of MySQL databases using KubeDB.
- Initialize [MySQL with Script](/docs/0.8.0-beta.2/guides/mysql/initialization/using-script).
- Initialize [MySQL with Snapshot](/docs/0.8.0-beta.2/guides/mysql/initialization/using-snapshot).
- Monitor your MySQL database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.8.0-beta.2/guides/mysql/monitoring/using-coreos-prometheus-operator).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.8.0-beta.2/guides/mysql/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.8.0-beta.2/guides/mysql/private-registry/using-private-registry) to deploy MySQL with KubeDB.
- Detail concepts of [MySQL object](/docs/0.8.0-beta.2/concepts/databases/mysql).
- Detail concepts of [Snapshot object](/docs/0.8.0-beta.2/concepts/snapshot).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.2/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.2/CONTRIBUTING).
