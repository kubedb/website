---
title: FerretDB
menu:
  docs_v2025.5.30:
    identifier: mg-readme-ferretdb
    name: FerretDB
    parent: fr-ferretdb-guides
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
url: /docs/v2025.5.30/guides/ferretdb/
aliases:
- /docs/v2025.5.30/guides/ferretdb/README/
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# Overview

FerretDB is an open-source proxy that translates MongoDB wire protocol queries to SQL, with PostgreSQL or SQLite as the database engine. FerretDB was founded to become the true open-source alternative to MongoDB. It uses the same commands, drivers, and tools as MongoDB.

## Supported FerretDB Features

| Features                              | Availability |
|---------------------------------------|:------------:|
| Internally  manageable Backend Engine |   &#10003;   |
| Externally manageable Backend Engine  |   &#10003;   |
| Authentication & Authorization        |   &#10003;   |
| TLS Support                           |   &#10003;   |
| Replication Support                   |   &#10003;   |
| Monitoring using Prometheus           |   &#10003;   |
| Builtin Prometheus Discovery          |   &#10003;   |
| Using Prometheus operator             |   &#10003;   |
| Reconfigurable Health Checker         |   &#10003;   |
| Persistent volume                     |   &#10003;   |

## Supported FerretDB Versions

KubeDB supports the following FerretDB Versions.
- `1.18.0`
- `1.23.0`
- `1.24.0`
- `2.0.0`

## Life Cycle of a FerretDB Object

<!---
ref : https://app.diagrams.net/
--->

<p text-align="center">
    <img alt="lifecycle"  src="/docs/v2025.5.30/images/ferretdb/quick-start.png" >
</p>

## User Guide

- [Quickstart FerretDB](/docs/v2025.5.30/guides/ferretdb/quickstart/quickstart) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.5.30/CONTRIBUTING).