---
title: ProxySQL
menu:
  docs_v2020.07.10-beta.0:
    identifier: proxysql-readme
    name: ProxySQL
    parent: proxysql-guides
    weight: 10
menu_name: docs_v2020.07.10-beta.0
section_menu_id: guides
url: /docs/v2020.07.10-beta.0/guides/proxysql/
aliases:
- /docs/v2020.07.10-beta.0/guides/proxysql/README/
info:
  version: v2020.07.10-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.07.10-beta.0/concepts/README).

## Supported ProxySQL Features

|                        Features                         | Availability |
| ------------------------------------------------------- | :----------: |
| Load balance MySQL Group Replication                    |   &#10003;   |
| Load balance PerconaXtraDB Cluster                      |   &#10007;   |
| Custom Configuration                                    |   &#10003;   |
| Using Custom docker image                               |   &#10003;   |
| Builtin Prometheus Discovery                            |   &#10003;   |
| Using CoreOS Prometheus Operator                        |   &#10003;   |

## Supported ProxySQL Versions

| KubeDB Version | ProxySQL:2.0.4 |
| :------------: | :------------: |
|  v0.13.0-rc.1  |    &#10003;    |

## Supported ProxySQLVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|  NAME  | VERSION | KubeDB: v0.13.0-rc.0 | KubeDB: v0.13.0-rc.0 |
| :----: | :-----: | :-----------: | :------------: |
|   2.0.4    |    2.0.4    |   &#10007;    |    &#10003;    |

## External tools dependency

|                                Tool                               | Version |
| :---------------------------------------------------------------: | :-----: |
| [proxysql-exporter](https://github.com/percona/proxysql_exporter) | latest  |

## User Guide

- Overview of ProxySQL [here](/docs/v2020.07.10-beta.0/guides/proxysql/overview/overview).
- Configure ProxySQL for Group Replication [here](/docs/v2020.07.10-beta.0/guides/proxysql/overview/configure-proxysql).
- Learn to use ProxySQL to Load Balance MySQL Group Replication with KubeDB Operator [here](/docs/v2020.07.10-beta.0/guides/proxysql/quickstart/load-balance-mysql-group-replication).
- Monitor your ProxySQL with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.07.10-beta.0/guides/proxysql/monitoring/using-builtin-prometheus).
- Monitor your ProxySQL with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v2020.07.10-beta.0/guides/proxysql/monitoring/using-coreos-prometheus-operator).
- Use private Docker registry to deploy ProxySQL with KubeDB [here](/docs/v2020.07.10-beta.0/guides/proxysql/private-registry/using-private-registry).
- Use custom config file to configure ProxySQL [here](/docs/v2020.07.10-beta.0/guides/proxysql/configuration/using-custom-config).
- Detail concepts of ProxySQL CRD [here](/docs/v2020.07.10-beta.0/concepts/database-proxy/proxysql).
- Detail concepts of ProxySQLVersion CRD [here](/docs/v2020.07.10-beta.0/concepts/catalog/proxysql).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.07.10-beta.0/CONTRIBUTING).
