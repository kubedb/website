---
title: PgBouncer
menu:
  docs_v2024.6.4:
    identifier: pb-readme-pgbouncer
    name: PgBouncer
    parent: pb-pgbouncer-guides
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
url: /docs/v2024.6.4/guides/pgbouncer/
aliases:
- /docs/v2024.6.4/guides/pgbouncer/README/
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Overview

[PgBouncer](https://pgbouncer.github.io/) is an open-source, lightweight, single-binary connection-pooling middleware for PostgreSQL. PgBouncer maintains a pool of connections for each locally stored user-database pair. It is typically configured to hand out one of these connections to a new incoming client connection, and return it back in to the pool when the client disconnects. PgBouncer can manage only one PostgreSQL database on possibly different servers and serve clients over TCP and Unix domain sockets. For a more hands-on experience, see this brief [tutorial on how to create a PgBouncer](https://pgdash.io/blog/pgbouncer-connection-pool.html) for PostgreSQL database.

KubeDB operator now comes bundled with PgBouncer crd to handle connection pooling. With connection pooling, clients connect to a proxy server which maintains a pool of direct connections to other real PostgreSQL servers. PgBouncer crd can handle multiple local or remote Postgres database connections across multiple users using PgBouncer's connection pooling mechanism.

## PgBouncer Features

| Features                           | Availability |
|------------------------------------|:------------:|
| Clustering                         |   &#10003;   |
| Multiple PgBouncer Versions        |   &#10003;   |
| Customizable Pooling Configuration |   &#10003;   |
| Custom docker images               |   &#10003;   |
| Builtin Prometheus Discovery       |   &#10003;   |
| Using Prometheus operator          |   &#10003;   |

## User Guide

- [Quickstart PgBouncer](/docs/v2024.6.4/guides/pgbouncer/quickstart/quickstart) with KubeDB Operator.
- Monitor your PgBouncer with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2024.6.4/guides/pgbouncer/monitoring/using-builtin-prometheus).
- Monitor your PgBouncer with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2024.6.4/guides/pgbouncer/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2024.6.4/guides/pgbouncer/private-registry/using-private-registry) to deploy PgBouncer with KubeDB.
- Detail concepts of [PgBouncer object](/docs/v2024.6.4/guides/pgbouncer/concepts/pgbouncer).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.6.4/CONTRIBUTING).
