---
title: ClickHouse
menu:
  docs_v2026.8.26-rc.2:
    identifier: guides-clickhouse-readme
    name: ClickHouse
    parent: ch-clickhouse-guides
    weight: 10
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
url: /docs/v2026.8.26-rc.2/guides/clickhouse/
aliases:
- /docs/v2026.8.26-rc.2/guides/clickhouse/README/
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

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

## Supported ClickHouse Versions

KubeDB supports the following ClickHouse Versions.
- `24.4.1`
- `25.7.1`
- `25.12.3`
- `26.2.6`

## Life Cycle of a ClickHouse Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2026.8.26-rc.2/images/clickhouse/clickhouse-lifecycle.png" >
</p>

## User Guide

- [Quickstart ClickHouse](/docs/v2026.8.26-rc.2/guides/clickhouse/quickstart/guide/quickstart) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.8.26-rc.2/CONTRIBUTING).
