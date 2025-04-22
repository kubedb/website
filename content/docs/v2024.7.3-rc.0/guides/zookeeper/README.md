---
title: ZooKeeper
menu:
  docs_v2024.7.3-rc.0:
    identifier: zk-readme-zookeeper
    name: ZooKeeper
    parent: zk-zookeeper-guides
    weight: 10
menu_name: docs_v2024.7.3-rc.0
section_menu_id: guides
url: /docs/v2024.7.3-rc.0/guides/zookeeper/
aliases:
- /docs/v2024.7.3-rc.0/guides/zookeeper/README/
info:
  cli: v0.47.0-rc.0
  dashboard: v0.23.0-rc.0
  installer: v2024.7.3-rc.0
  provisioner: v0.47.0-rc.0
  schema-manager: v0.23.0-rc.0
  ui-server: v0.23.0-rc.0
  version: v2024.7.3-rc.0
  webhook-server: v0.23.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2024.7.3-rc.0/README).

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
  <img alt="lifecycle"  src="/docs/v2024.7.3-rc.0/images/zookeeper/zookeeper-lifecycle.png">
</p>

## User Guide

- [Quickstart ZooKeeper](/docs/v2024.7.3-rc.0/guides/zookeeper/quickstart/quickstart) with KubeDB Operator.
- Detail Concept of [ZooKeeper Object](/docs/v2024.7.3-rc.0/guides/zookeeper/concepts/zookeeper).


## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.7.3-rc.0/CONTRIBUTING).