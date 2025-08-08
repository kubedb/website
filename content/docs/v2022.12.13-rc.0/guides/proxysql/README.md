---
title: ProxySQL
menu:
  docs_v2022.12.13-rc.0:
    identifier: guides-proxysql-readme
    name: ProxySQL
    parent: guides
    weight: 10
menu_name: docs_v2022.12.13-rc.0
section_menu_id: guides
url: /docs/v2022.12.13-rc.0/guides/proxysql/
aliases:
- /docs/v2022.12.13-rc.0/guides/proxysql/README/
info:
  autoscaler: v0.15.0-rc.0
  cli: v0.30.0-rc.0
  dashboard: v0.6.0-rc.0
  installer: v2022.12.13-rc.0
  ops-manager: v0.17.0-rc.0
  provisioner: v0.30.0-rc.0
  schema-manager: v0.6.0-rc.0
  ui-server: v0.6.0-rc.0
  version: v2022.12.13-rc.0
  webhook-server: v0.6.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2022.12.13-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.12.13-rc.0/setup/install/enterprise) to try this feature." >}}

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

- [Overview of KubeDB ProxySQL CRD](/docs/v2022.12.13-rc.0/guides/proxysql/concepts/proxysql/) 
- [Configure KubeDB ProxySQL for MySQL Group Replication](/docs/v2022.12.13-rc.0/guides/proxysql/quickstart/mysqlgrp/)
- [Deploy ProxySQL cluster with KubeDB](/docs/v2022.12.13-rc.0/guides/proxysql/clustering/proxysql-cluster/) 
- [Initialize KubeDB ProxySQL with declarative configuration](/docs/v2022.12.13-rc.0/guides/proxysql/concepts/declarative-configuration/) 
- [Reconfigure KubeDB ProxySQL with ops-request](/docs/v2022.12.13-rc.0/guides/proxysql/concepts/opsrequest/)
- [Deploy TLS/SSL secured KubeDB ProxySQL](/docs/v2022.12.13-rc.0/guides/proxysql/tls/configure/)
- [Reconfigure TLS/SSL for KubeDB ProxySQL](/docs/v2022.12.13-rc.0/guides/proxysql/reconfigure-tls/cluster/)
- [Detail concepts of ProxySQLVersion CRD](/docs/v2022.12.13-rc.0/guides/proxysql/concepts/proxysql-version/)
- [Upgrade KubeDB ProxySQL version with ops-request](/docs/v2022.12.13-rc.0/guides/proxysql/upgrading/cluster/)
- [Scale horizontally and vertically KubeDB ProxySQL with ops-request](/docs/v2022.12.13-rc.0/guides/proxysql/scaling/horizontal-scaling/cluster/)
- [Learn auto-scaling for KubeDB ProxySQL](/docs/v2022.12.13-rc.0/guides/proxysql/autoscaler/compute/cluster/)
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.12.13-rc.0/CONTRIBUTING).
