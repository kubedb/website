---
title: ProxySQL
menu:
  docs_v2022.03.28:
    identifier: prx-readme-proxysql
    name: ProxySQL
    parent: prx-proxysql-guides
    weight: 10
menu_name: docs_v2022.03.28
section_menu_id: guides
url: /docs/v2022.03.28/guides/proxysql/
aliases:
- /docs/v2022.03.28/guides/proxysql/README/
info:
  autoscaler: v0.11.0
  cli: v0.26.0
  community: v0.26.0
  dashboard: v0.2.0
  enterprise: v0.13.0
  installer: v2022.03.28
  schema-manager: v0.2.0
  ui-server: v0.2.0
  version: v2022.03.28
  webhook-server: v0.2.0
---

> New to KubeDB? Please start [here](/docs/v2022.03.28/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.03.28/setup/install/enterprise) to try this feature." >}}

## Supported ProxySQL Features

| Features                             | Availability |
| ------------------------------------ | :----------: |
| Load balance MySQL Group Replication |   &#10003;   |
| Load balance PerconaXtraDB Cluster   |   &#10007;   |
| Custom Configuration                 |   &#10003;   |
| Using Custom docker image            |   &#10003;   |
| Builtin Prometheus Discovery         |   &#10003;   |
| Using Prometheus operator            |   &#10003;   |

## User Guide

- Overview of ProxySQL [here](/docs/v2022.03.28/guides/proxysql/overview/overview).
- Configure ProxySQL for Group Replication [here](/docs/v2022.03.28/guides/proxysql/overview/configure-proxysql).
- Learn to use ProxySQL to Load Balance MySQL Group Replication with KubeDB Operator [here](/docs/v2022.03.28/guides/proxysql/quickstart/load-balance-mysql-group-replication).
- Monitor your ProxySQL with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2022.03.28/guides/proxysql/monitoring/using-builtin-prometheus).
- Monitor your ProxySQL with KubeDB using [out-of-the-box Prometheus operator](/docs/v2022.03.28/guides/proxysql/monitoring/using-prometheus-operator).
- Use private Docker registry to deploy ProxySQL with KubeDB [here](/docs/v2022.03.28/guides/proxysql/private-registry/using-private-registry).
- Use custom config file to configure ProxySQL [here](/docs/v2022.03.28/guides/proxysql/configuration/using-config-file).
- Detail concepts of ProxySQL CRD [here](/docs/v2022.03.28/guides/proxysql/concepts/proxysql).
- Detail concepts of ProxySQLVersion CRD [here](/docs/v2022.03.28/guides/proxysql/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2022.03.28/CONTRIBUTING).
