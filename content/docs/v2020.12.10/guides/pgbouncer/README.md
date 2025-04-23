---
title: PgBouncer
menu:
  docs_v2020.12.10:
    identifier: pb-readme-pgbouncer
    name: PgBouncer
    parent: pb-pgbouncer-guides
    weight: 10
menu_name: docs_v2020.12.10
section_menu_id: guides
url: /docs/v2020.12.10/guides/pgbouncer/
aliases:
- /docs/v2020.12.10/guides/pgbouncer/README/
info:
  cli: v0.15.2
  community: v0.15.2
  enterprise: v0.2.2
  installer: v0.15.2
  version: v2020.12.10
---

> New to KubeDB? Please start [here](/docs/v2020.12.10/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2020.12.10/setup/install/enterprise) to try this feature." >}}

# Overview

[PgBouncer](https://pgbouncer.github.io/) is an open-source, lightweight, single-binary connection-pooling middleware for PostgreSQL. PgBouncer maintains a pool of connections for each locally stored user-database pair. It is typically configured to hand out one of these connections to a new incoming client connection, and return it back in to the pool when the client disconnects. PgBouncer can manage one or more PostgreSQL databases on possibly different servers and serve clients over TCP and Unix domain sockets. For a more hands-on experience, see this brief [tutorial on how to create a PgBouncer](https://pgdash.io/blog/pgbouncer-connection-pool.html) for PostgreSQL database.

KubeDB operator now comes bundled with PgBouncer crd to handle connection pooling. With connection pooling, clients connect to a proxy server which maintains a pool of direct connections to other real PostgreSQL servers. PgBouncer crd can handle multiple local or remote Postgres database connections across multiple users using PgBouncer's connection pooling mechanism.

## PgBouncer Features

| Features                           | Availability |
| ---------------------------------- | :----------: |
| Multiple PgBouncer Versions        |   &#10003;   |
| Customizable Pooling Configuration |   &#10003;   |
| Custom docker images               |   &#10003;   |
| Builtin Prometheus Discovery       |   &#10003;   |
| Using Prometheus operator          |   &#10003;   |

## User Guide

- [Quickstart PgBouncer](/docs/v2020.12.10/guides/pgbouncer/quickstart/quickstart) with KubeDB Operator.
- Monitor your PgBouncer with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/v2020.12.10/guides/pgbouncer/monitoring/using-builtin-prometheus).
- Monitor your PgBouncer with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2020.12.10/guides/pgbouncer/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2020.12.10/guides/pgbouncer/private-registry/using-private-registry) to deploy PgBouncer with KubeDB.
- Detail concepts of [PgBouncer object](/docs/v2020.12.10/guides/pgbouncer/concepts/pgbouncer).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.12.10/CONTRIBUTING).
