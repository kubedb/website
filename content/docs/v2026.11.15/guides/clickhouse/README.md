---
title: ClickHouse
menu:
  docs_v2026.11.15:
    identifier: guides-clickhouse-readme
    name: ClickHouse
    parent: ch-clickhouse-guides
    weight: 10
menu_name: docs_v2026.11.15
section_menu_id: guides
url: /docs/v2026.11.15/guides/clickhouse/
aliases:
- /docs/v2026.11.15/guides/clickhouse/README/
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

## Supported ClickHouse Features

| Features                                                      | Availability |
|---------------------------------------------------------------|:------------:|
| ClusterTopology                                               |   &#10003;   |
| Initialize using Script (\*.sql, \*sql.gz and/or \*.sh)       |   &#10003;   |
| Custom Configuration                                          |   &#10003;   |
| Builtin Prometheus Discovery                                  |   &#10003;   |
| Using Prometheus operator                                     |   &#10003;   |
| Authentication & Authorization (TLS)                          |   &#10003;   |
| Externally manageable Auth Secret                             |   &#10003;   |
| Reconfigurable TLS Certificates (Add, Remove, Rotate, Update) |   &#10003;   |
| Instant and Scheduled Backup ([KubeStash](https://kubestash.com/)) |   &#10003;   |

## Supported ClickHouse Versions

KubeDB supports the following ClickHouse Versions.
- `24.4.1`
- `25.7.1`
- `25.12.3`
- `26.2.6`

## Life Cycle of a ClickHouse Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2026.11.15/images/clickhouse/clickhouse-lifecycle.png" >
</p>

## User Guide

- [Quickstart ClickHouse](/docs/v2026.11.15/guides/clickhouse/quickstart/guide/quickstart) with KubeDB Operator.
- How to [Backup & Restore](/docs/v2026.11.15/guides/clickhouse/backup/overview/) ClickHouse using [KubeStash](https://kubestash.com/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.11.15/CONTRIBUTING).
