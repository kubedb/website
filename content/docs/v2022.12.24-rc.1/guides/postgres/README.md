---
title: Postgres
menu:
  docs_v2022.12.24-rc.1:
    identifier: pg-readme-postgres
    name: Postgres
    parent: pg-postgres-guides
    weight: 10
menu_name: docs_v2022.12.24-rc.1
section_menu_id: guides
url: /docs/v2022.12.24-rc.1/guides/postgres/
aliases:
- /docs/v2022.12.24-rc.1/guides/postgres/README/
info:
  autoscaler: v0.15.0-rc.1
  cli: v0.30.0-rc.1
  dashboard: v0.6.0-rc.1
  installer: v2022.12.24-rc.1
  ops-manager: v0.17.0-rc.1
  provisioner: v0.30.0-rc.1
  schema-manager: v0.6.0-rc.1
  ui-server: v0.6.0-rc.1
  version: v2022.12.24-rc.1
  webhook-server: v0.6.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2022.12.24-rc.1/README).

## Supported PostgreSQL Features

| Features                           | Availability |
| ---------------------------------- |:------------:|
| Clustering                         |   &#10003;   |
| Warm Standby                       |   &#10003;   |
| Hot Standby                        |   &#10003;   |
| Synchronous Replication            |   &#10003;   |
| Streaming Replication              |   &#10003;   |
| Automatic Failover                 |   &#10003;   |
| Continuous Archiving using `wal-g` |   &#10007;   |
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
  <img alt="lifecycle"  src="/docs/v2022.12.24-rc.1/images/postgres/lifecycle.png">
</p>

## User Guide

- [Quickstart PostgreSQL](/docs/v2022.12.24-rc.1/guides/postgres/quickstart/quickstart) with KubeDB Operator.
- How to [Backup & Restore](/docs/v2022.12.24-rc.1/guides/postgres/backup/overview/) PostgreSQL database using Stash.
- Initialize [PostgreSQL with Script](/docs/v2022.12.24-rc.1/guides/postgres/initialization/script_source).
- [PostgreSQL Clustering](/docs/v2022.12.24-rc.1/guides/postgres/clustering/ha_cluster) supported by KubeDB Postgres.
- [Streaming Replication](/docs/v2022.12.24-rc.1/guides/postgres/clustering/streaming_replication) for PostgreSQL clustering.
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2022.12.24-rc.1/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2022.12.24-rc.1/guides/postgres/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2022.12.24-rc.1/guides/postgres/private-registry/using-private-registry) to deploy PostgreSQL with KubeDB.
- Detail concepts of [Postgres object](/docs/v2022.12.24-rc.1/guides/postgres/concepts/postgres).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.12.24-rc.1/CONTRIBUTING).
