---
title: Postgres
menu:
  docs_v2020.10.26-beta.0:
    identifier: pg-readme-postgres
    name: Postgres
    parent: pg-postgres-guides
    weight: 10
menu_name: docs_v2020.10.26-beta.0
section_menu_id: guides
url: /docs/v2020.10.26-beta.0/guides/postgres/
aliases:
- /docs/v2020.10.26-beta.0/guides/postgres/README/
info:
  cli: v0.14.0-beta.5
  community: v0.14.0-beta.5
  enterprise: v0.1.0-beta.5
  installer: v0.14.0-beta.5
  version: v2020.10.26-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.26-beta.0/README).

## Supported PostgreSQL Features

| Features                           | Availability |
| ---------------------------------- | :----------: |
| Clustering                         |   &#10003;   |
| Warm Standby                       |   &#10003;   |
| Hot Standby                        |   &#10003;   |
| Synchronous Replication            |   &#10007;   |
| Streaming Replication              |   &#10003;   |
| Automatic Failover                 |   &#10003;   |
| Continuous Archiving using `wal-g` |   &#10003;   |
| Initialization from WAL archive    |   &#10003;   |
| Persistent Volume                  |   &#10003;   |
| Instant Backup                     |   &#10003;   |
| Scheduled Backup                   |   &#10003;   |
| Initialization from Snapshot       |   &#10003;   |
| Initialization using Script        |   &#10003;   |
| Builtin Prometheus Discovery       |   &#10003;   |
| Using Prometheus operator          |   &#10003;   |
| Custom Configuration               |   &#10003;   |
| Using Custom docker image          |   &#10003;   |

## Life Cycle of a PostgreSQL Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2020.10.26-beta.0/images/postgres/lifecycle.png">
</p>

## User Guide

- [Quickstart PostgreSQL](/docs/v2020.10.26-beta.0/guides/postgres/quickstart/quickstart) with KubeDB Operator.
- How to [Backup & Restore](/docs/v2020.10.26-beta.0/guides/postgres/backup/stash) PostgreSQL database using Stash.
- Initialize [PostgreSQL with Script](/docs/v2020.10.26-beta.0/guides/postgres/initialization/script_source).
- [PostgreSQL Clustering](/docs/v2020.10.26-beta.0/guides/postgres/clustering/ha_cluster) supported by KubeDB Postgres.
- [Streaming Replication](/docs/v2020.10.26-beta.0/guides/postgres/clustering/streaming_replication) for PostgreSQL clustering.
- [Continuous Archiving](/docs/v2020.10.26-beta.0/guides/postgres/backup/wal/continuous_archiving) of Write-Ahead Log by `wal-g`.
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2020.10.26-beta.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2020.10.26-beta.0/guides/postgres/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2020.10.26-beta.0/guides/postgres/private-registry/using-private-registry) to deploy PostgreSQL with KubeDB.
- Detail concepts of [Postgres object](/docs/v2020.10.26-beta.0/guides/postgres/concepts/postgres).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.10.26-beta.0/CONTRIBUTING).
