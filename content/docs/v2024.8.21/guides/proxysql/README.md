---
title: ProxySQL
menu:
  docs_v2024.8.21:
    identifier: guides-proxysql-readme
    name: ProxySQL
    parent: guides-proxysql
    weight: 5
menu_name: docs_v2024.8.21
section_menu_id: guides
url: /docs/v2024.8.21/guides/proxysql/
aliases:
- /docs/v2024.8.21/guides/proxysql/README/
info:
  autoscaler: v0.32.0
  cli: v0.47.0
  dashboard: v0.23.0
  installer: v2024.8.21
  ops-manager: v0.34.0
  provisioner: v0.47.0
  schema-manager: v0.23.0
  ui-server: v0.23.0
  version: v2024.8.21
  webhook-server: v0.23.0
---

> New to KubeDB? Please start [here](/docs/v2024.8.21/README).

## Supported ProxySQL Features

| Features                             | Availability |
| ------------------------------------ | :----------: |
| Load balance MySQL Group Replication |   &#10003;   |
| Load balance PerconaXtraDB Cluster   |   &#10003;   |
| Custom Configuration                 |   &#10003;   |
| Declarative Configuration            |   &#10003;   |
| Version Update                       |   &#10003;   |
| Builtin Prometheus Discovery         |   &#10003;   |
| Using Prometheus operator            |   &#10003;   |
| ProxySQL server cluster              |   &#10003;   |
| ProxySQL server failure recovery     |   &#10003;   |
| TLS secured connection for backend   |   &#10003;   |
| TLS secured connection for frontend  |   &#10003;   |

## User Guide

- [Overview of KubeDB ProxySQL CRD](/docs/v2024.8.21/guides/proxysql/concepts/proxysql/) 
- [Configure KubeDB ProxySQL for MySQL Group Replication](/docs/v2024.8.21/guides/proxysql/quickstart/mysqlgrp/)
- [Deploy ProxySQL cluster with KubeDB](/docs/v2024.8.21/guides/proxysql/clustering/proxysql-cluster/) 
- [Initialize KubeDB ProxySQL with declarative configuration](/docs/v2024.8.21/guides/proxysql/concepts/declarative-configuration/) 
- [Reconfigure KubeDB ProxySQL with ops-request](/docs/v2024.8.21/guides/proxysql/concepts/opsrequest/)
- [Deploy TLS/SSL secured KubeDB ProxySQL](/docs/v2024.8.21/guides/proxysql/tls/configure/)
- [Reconfigure TLS/SSL for KubeDB ProxySQL](/docs/v2024.8.21/guides/proxysql/reconfigure-tls/cluster/)
- [Detail concepts of ProxySQLVersion CRD](/docs/v2024.8.21/guides/proxysql/concepts/proxysql-version/)
- [Update KubeDB ProxySQL version with ops-request](/docs/v2024.8.21/guides/proxysql/update-version/cluster/)
- [Scale horizontally and vertically KubeDB ProxySQL with ops-request](/docs/v2024.8.21/guides/proxysql/scaling/horizontal-scaling/cluster/)
- [Learn auto-scaling for KubeDB ProxySQL](/docs/v2024.8.21/guides/proxysql/autoscaler/compute/cluster/)
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.8.21/CONTRIBUTING).
