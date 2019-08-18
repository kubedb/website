---
title: Postgres
menu:
  docs_0.8.0-beta.2:
    identifier: pg-readme-postgres
    name: Postgres
    parent: pg-postgres-guides
    weight: 10
menu_name: docs_0.8.0-beta.2
section_menu_id: guides
url: /docs/0.8.0-beta.2/guides/postgres/
aliases:
- /docs/0.8.0-beta.2/guides/postgres/README/
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.2/concepts/README).

## Supported PostgreSQL Features

|Features                                                | Availability |
|------------------------------------------------------- |:------------:|
|Clustering                                              | &#10003;     |
|Warm Standby                                            | &#10003;     |
|Hot Standby                                             | &#10003;     |
|Synchronous Replication                                 | &#10007;     |
|Streaming Replication                                   | &#10003;     |
|Continuous Archiving using `wal-g`                      | &#10003;     |
|Initialization from WAL archive                         | &#10003;     |
|Persistent Volume                                       | &#10003;     |
|Instant Backup                                          | &#10003;     |
|Scheduled Backup                                        | &#10003;     |
|Initialization from Snapshot                            | &#10003;     |
|Initialization using Script                             | &#10003;     |
|Builtin Prometheus Discovery                            | &#10003;     |
|Using CoreOS Prometheus Operator                        | &#10003;     |

<br/>

## Life Cycle of a PostgreSQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.8.0-beta.2/images/postgres/lifecycle.png" width="581" height="362">
</p>

<br/>

## Supported PostgreSQL Versions

| KubeDB Version | Postgres:9.5 | Postgres:9.6 | Postgres:10.2 |
|----------------|:------------:|:------------:|:-------------:|
| 0.1.0 - 0.7.0  | &#10003;     | &#10007;     | &#10007;      |
| 0.8.0-beta.2   | &#10007;     | &#10003;     | &#10003;      |

<br/>

## External tools dependency

|Tool                                      |Version  |
|------------------------------------------|:-------:|
|[wal-g](https://github.com/wal-g/wal-g)   | v0.1.7  |
|[osm](https://github.com/appscode/osm)    | 0.6.2   |

## User Guide

- [Quickstart PostgreSQL](/docs/0.8.0-beta.2/guides/postgres/quickstart/quickstart) with KubeDB Operator.
- Take [Instant Snapshot](/docs/0.8.0-beta.2/guides/postgres/snapshot/instant_backup) of PostgreSQL database using KubeDB.
- [Schedule backup](/docs/0.8.0-beta.2/guides/postgres/snapshot/scheduled_backup) of PostgreSQL database using KubeDB.
- Initialize [PostgreSQL with Script](/docs/0.8.0-beta.2/guides/postgres/initialization/script_source).
- Initialize [PostgreSQL with KubeDB Snapshot](/docs/0.8.0-beta.2/guides/postgres/initialization/snapshot_source).
- [PostgreSQL Clustering](/docs/0.8.0-beta.2/guides/postgres/clustering/ha_cluster) supported by KubeDB Postgres.
- [Streaming Replication](/docs/0.8.0-beta.2/guides/postgres/clustering/streaming_replication) for PostgreSQL clustering.
- [Continuous Archiving](/docs/0.8.0-beta.2/guides/postgres/snapshot/continuous_archiving) of Write-Ahead Log by `wal-g`.
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/0.8.0-beta.2/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` CoreOS Prometheus Operator](/docs/0.8.0-beta.2/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Use [private Docker registry](/docs/0.8.0-beta.2/guides/postgres/private-registry/using-private-registry) to deploy PostgreSQL with KubeDB.
- Detail concepts of [Postgres object](/docs/0.8.0-beta.2/concepts/databases/postgres).
- Detail concepts of [Snapshot object](/docs/0.8.0-beta.2/concepts/snapshot).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.2/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.2/CONTRIBUTING).

