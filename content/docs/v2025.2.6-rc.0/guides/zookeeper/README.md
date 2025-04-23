---
title: ZooKeeper
menu:
  docs_v2025.2.6-rc.0:
    identifier: zk-readme-zookeeper
    name: ZooKeeper
    parent: zk-zookeeper-guides
    weight: 10
menu_name: docs_v2025.2.6-rc.0
section_menu_id: guides
url: /docs/v2025.2.6-rc.0/guides/zookeeper/
aliases:
- /docs/v2025.2.6-rc.0/guides/zookeeper/README/
info:
  autoscaler: v0.37.0-rc.0
  cli: v0.52.0-rc.0
  dashboard: v0.28.0-rc.0
  installer: v2025.2.6-rc.0
  ops-manager: v0.39.0-rc.0
  provisioner: v0.52.0-rc.0
  schema-manager: v0.28.0-rc.0
  ui-server: v0.28.0-rc.0
  version: v2025.2.6-rc.0
  webhook-server: v0.28.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.2.6-rc.0/README).

## Supported ZooKeeper Features
| Features                                                                           | Availability |
|------------------------------------------------------------------------------------|:------------:|
| Ensemble                                                                           |   &#10003;   |
| Standalone                                                                         |   &#10003;   |
| Authentication & Autorization                                                      |   &#10003;   | 
| Custom Configuration                                                               |   &#10003;   | 
| Grafana Dashboards                                                                 |   &#10003;   | 
| Externally manageable Auth Secret                                                  |   &#10003;   |
| Reconfigurable Health Checker                                                      |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) |   &#10003;   |
| Automated Version update                                                           |   &#10003;   |
| Automatic Vertical Scaling                                                         |   &#10003;   |
| Automated Horizontal Scaling                                                       |   &#10003;   |
| Automated Volume Expansion                                                         |   &#10003;   |
| Backup/Recovery: Instant, Scheduled ([KubeStash](https://kubestash.com/))          |   &#10003;   | 
| Persistent Volume                                                                  |   &#10003;   |
| Initializing from Snapshot ( [Stash](https://stash.run/) )                         |   &#10003;   |
| Builtin Prometheus Discovery                                                       |   &#10003;   | 
| Using Prometheus operator                                                          |   &#10003;   |

## Life Cycle of a ZooKeeper Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.2.6-rc.0/images/zookeeper/zookeeper-lifecycle.png">
</p>

## User Guide

- [Quickstart ZooKeeper](/docs/v2025.2.6-rc.0/guides/zookeeper/quickstart/quickstart) with KubeDB Operator.
- Detail Concept of [ZooKeeper Object](/docs/v2025.2.6-rc.0/guides/zookeeper/concepts/zookeeper).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.2.6-rc.0/CONTRIBUTING).