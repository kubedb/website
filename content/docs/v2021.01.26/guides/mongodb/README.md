---
title: MongoDB
menu:
  docs_v2021.01.26:
    identifier: mg-readme-mongodb
    name: MongoDB
    parent: mg-mongodb-guides
    weight: 10
menu_name: docs_v2021.01.26
section_menu_id: guides
url: /docs/v2021.01.26/guides/mongodb/
aliases:
- /docs/v2021.01.26/guides/mongodb/README/
info:
  autoscaler: v0.1.2
  cli: v0.16.2
  community: v0.16.2
  enterprise: v0.3.2
  installer: v0.16.2
  version: v2021.01.26
---

> New to KubeDB? Please start [here](/docs/v2021.01.26/README).

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
  <img alt="lifecycle"  src="/docs/v2021.01.26/images/mongodb/mgo-lifecycle.png">
</p>

## User Guide

- [Quickstart MongoDB](/docs/v2021.01.26/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [MongoDB Replicaset](/docs/v2021.01.26/guides/mongodb/clustering/replicaset) with KubeDB Operator.
- [MongoDB Sharding](/docs/v2021.01.26/guides/mongodb/clustering/sharding) with KubeDB Operator.
- [Backup & Restore](/docs/v2021.01.26/guides/mongodb/backup/stash) MongoDB databases using Stash.
- Initialize [MongoDB with Script](/docs/v2021.01.26/guides/mongodb/initialization/using-script).
- Start [MongoDB with Custom Config](/docs/v2021.01.26/guides/mongodb/configuration/using-config-file).
- Monitor your MongoDB database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.01.26/guides/mongodb/monitoring/using-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.01.26/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2021.01.26/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/v2021.01.26/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/v2021.01.26/guides/mongodb/concepts/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v2021.01.26/guides/mongodb/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.01.26/CONTRIBUTING).
