---
title: ZooKeeper
menu:
  docs_v2024.8.14-rc.3:
    identifier: zk-readme-zookeeper
    name: ZooKeeper
    parent: zk-zookeeper-guides
    weight: 10
menu_name: docs_v2024.8.14-rc.3
section_menu_id: guides
url: /docs/v2024.8.14-rc.3/guides/zookeeper/
aliases:
- /docs/v2024.8.14-rc.3/guides/zookeeper/README/
info:
  autoscaler: v0.32.0-rc.3
  cli: v0.47.0-rc.3
  dashboard: v0.23.0-rc.3
  installer: v2024.8.14-rc.3
  ops-manager: v0.34.0-rc.3
  provisioner: v0.47.0-rc.3
  schema-manager: v0.23.0-rc.3
  ui-server: v0.23.0-rc.3
  version: v2024.8.14-rc.3
  webhook-server: v0.23.0-rc.3
---

> New to KubeDB? Please start [here](/docs/v2024.8.14-rc.3/README).

## Supported ZooKeeper Features
| Features                                                                  | Availability |
|---------------------------------------------------------------------------|:------------:|
| Ensemble                                                                  |   &#10003;   |
| Standalone                                                                |   &#10003;   |
| Authentication & Autorization                                             |   &#10003;   | 
| Custom Configuration                                                      |   &#10003;   | 
| Grafana Dashboards                                                        |   &#10003;   | 
| Externally manageable Auth Secret                                         |   &#10003;   |
| Reconfigurable Health Checker                                             |   &#10003;   |
| Backup/Recovery: Instant, Scheduled ([KubeStash](https://kubestash.com/)) |   &#10003;   | 
| Persistent Volume                                                         |   &#10003;   |
| Initializing from Snapshot ( [Stash](https://stash.run/) )                |   &#10003;   |
| Builtin Prometheus Discovery                                              |   &#10003;   | 
| Using Prometheus operator                                                 |   &#10003;   |

## Life Cycle of a ZooKeeper Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2024.8.14-rc.3/images/zookeeper/zookeeper-lifecycle.png">
</p>

## User Guide

- [Quickstart ZooKeeper](/docs/v2024.8.14-rc.3/guides/zookeeper/quickstart/quickstart) with KubeDB Operator.
- Detail Concept of [ZooKeeper Object](/docs/v2024.8.14-rc.3/guides/zookeeper/concepts/zookeeper).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.8.14-rc.3/CONTRIBUTING).