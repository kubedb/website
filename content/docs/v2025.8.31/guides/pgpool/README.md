---
title: Pgpool
menu:
  docs_v2025.8.31:
    identifier: pp-readme-pgpool
    name: Pgpool
    parent: pp-pgpool-guides
    weight: 10
menu_name: docs_v2025.8.31
section_menu_id: guides
url: /docs/v2025.8.31/guides/pgpool/
aliases:
- /docs/v2025.8.31/guides/pgpool/README/
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

# Overview

[Pgpool](https://pgpool.net/) is a versatile proxy solution positioned between PostgreSQL servers and database clients. It offers essential functionalities such as Connection Pooling, Load Balancing, In-Memory Query Cache and many more. Pgpool enhances the performance, scalability, and reliability of PostgreSQL database systems.

KubeDB operator now comes bundled with Pgpool crd to manage all the essential features of Pgpool. 

## Supported Pgpool Features

| Features                                                    | Availability |
|-------------------------------------------------------------|:------------:|
| Multiple Pgpool Versions                                    |   &#10003;   |
| Custom Configuration                                        |   &#10003;   |
| Externally manageable Auth Secret                           |   &#10003;   |
| Reconfigurable Health Checker                               |   &#10003;   |
| Integrate with externally managed PostgreSQL                |   &#10003;   |
| Sync Postgres Users to Pgpool                               |   &#10003;   |
| Custom docker images                                        |   &#10003;   |
| TLS: Add ( [Cert Manager]((https://cert-manager.io/docs/))) |   &#10003;   |
| Monitoring with Prometheus & Grafana                        |   &#10003;   |
| Builtin Prometheus Discovery                                |   &#10003;   |
| Using Prometheus operator                                   |   &#10003;   |
| Alert Dashboard                                             |   &#10003;   |
| Grafana Dashboard                                           |   &#10003;   |

## Supported Pgpool Versions

KubeDB supports the following Pgpool versions:
- `4.4.5`
- `4.4.8`
- `4.5.0`
- `4.5.3`

> The listed PgpoolVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [PgpoolVersion](/docs/v2025.8.31/guides/pgpool/concepts/catalog) object with your custom pgpool image.

## Lifecycle of Pgpool Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.8.31/images/pgpool/quickstart/lifecycle.png">
</p>

## User Guide

- [Quickstart Pgpool](/docs/v2025.8.31/guides/pgpool/quickstart/quickstart) with KubeDB Operator.
- Detail concepts of [Pgpool object](/docs/v2025.8.31/guides/pgpool/concepts/pgpool).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.8.31/CONTRIBUTING).
