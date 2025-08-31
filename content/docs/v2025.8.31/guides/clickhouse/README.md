---
title: ClickHouse
menu:
  docs_v2025.8.31:
    identifier: guides-clickhouse-readme
    name: ClickHouse
    parent: guides-clickhouse
    weight: 10
menu_name: docs_v2025.8.31
section_menu_id: guides
url: /docs/v2025.8.31/guides/clickhouse/
aliases:
- /docs/v2025.8.31/guides/clickhouse/README/
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

## Supported MySQL Features

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

## Supported ClickHouse Versions

KubeDB supports the following ClickHouse Versions.
- `24.4.1`
- `25.7.1`

## Life Cycle of a ClickHouse Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.8.31/images/clickhouse/clickhouse-lifecycle.png" >
</p>

## User Guide

- [Quickstart ClickHouse](/docs/v2025.8.31/guides/clickhouse/quickstart/) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.8.31/CONTRIBUTING).
