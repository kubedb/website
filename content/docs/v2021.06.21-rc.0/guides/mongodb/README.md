---
title: MongoDB
menu:
  docs_v2021.06.21-rc.0:
    identifier: mg-readme-mongodb
    name: MongoDB
    parent: mg-mongodb-guides
    weight: 10
menu_name: docs_v2021.06.21-rc.0
section_menu_id: guides
url: /docs/v2021.06.21-rc.0/guides/mongodb/
aliases:
- /docs/v2021.06.21-rc.0/guides/mongodb/README/
info:
  autoscaler: v0.4.0-rc.0
  cli: v0.19.0-rc.0
  community: v0.19.0-rc.0
  enterprise: v0.6.0-rc.0
  installer: v2021.06.21-rc.0
  version: v2021.06.21-rc.0
---

> New to KubeDB? Please start [here](/docs/v2021.06.21-rc.0/README).

## Supported MongoDB Features

| Features                                     | Availability |
| -------------------------------------------- | :----------: |
| Clustering - Sharding                        |   &#10003;   |
| Clustering - Replication                     |   &#10003;   |
| Persistent Volume                            |   &#10003;   |
| Instant Backup                               |   &#10003;   |
| Scheduled Backup                             |   &#10003;   |
| Initialize using Snapshot                    |   &#10003;   |
| Initialize using Script (\*.js and/or \*.sh) |   &#10003;   |
| Custom Configuration                         |   &#10003;   |
| Using Custom docker image                    |   &#10003;   |
| Builtin Prometheus Discovery                 |   &#10003;   |
| Using Prometheus operator                    |   &#10003;   |

## Life Cycle of a MongoDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2021.06.21-rc.0/images/mongodb/mgo-lifecycle.png">
</p>

## User Guide

- [Quickstart MongoDB](/docs/v2021.06.21-rc.0/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [MongoDB Replicaset](/docs/v2021.06.21-rc.0/guides/mongodb/clustering/replicaset) with KubeDB Operator.
- [MongoDB Sharding](/docs/v2021.06.21-rc.0/guides/mongodb/clustering/sharding) with KubeDB Operator.
- [Backup & Restore](/docs/v2021.06.21-rc.0/guides/mongodb/backup/overview/) MongoDB databases using Stash.
- Initialize [MongoDB with Script](/docs/v2021.06.21-rc.0/guides/mongodb/initialization/using-script).
- Start [MongoDB with Custom Config](/docs/v2021.06.21-rc.0/guides/mongodb/configuration/using-config-file).
- Monitor your MongoDB database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.06.21-rc.0/guides/mongodb/monitoring/using-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.06.21-rc.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.06.21-rc.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/v2021.06.21-rc.0/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/v2021.06.21-rc.0/guides/mongodb/concepts/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v2021.06.21-rc.0/guides/mongodb/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.06.21-rc.0/CONTRIBUTING).
