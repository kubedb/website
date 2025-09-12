---
title: MongoDB
menu:
  docs_v2025.2.6-rc.0:
    identifier: mg-readme-mongodb
    name: MongoDB
    parent: mg-mongodb-guides
    weight: 10
menu_name: docs_v2025.2.6-rc.0
section_menu_id: guides
url: /docs/v2025.2.6-rc.0/guides/mongodb/
aliases:
- /docs/v2025.2.6-rc.0/guides/mongodb/README/
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

## Supported MongoDB Features


| Features                                                                           | Availability |
|------------------------------------------------------------------------------------|:------------:|
| Clustering - Sharding                                                              |   &#10003;   |
| Clustering - Replication                                                           |   &#10003;   |
| Custom Configuration                                                               |   &#10003;   |
| Using Custom Docker Image                                                          |   &#10003;   |
| Initialization From Script (\*.js and/or \*.sh)                                    |   &#10003;   |
| Initializing from Snapshot ( [Stash](https://stash.run/) )                         |   &#10003;   |
| Authentication & Autorization                                                      |   &#10003;   |
| Arbiter support                                                                    |   &#10003;   |
| Persistent Volume                                                                  |   &#10003;   |
| Instant Backup                                                                     |   &#10003;   |
| Scheduled Backup                                                                   |   &#10003;   |
| Builtin Prometheus Discovery                                                       |   &#10003;   |
| Using Prometheus operator                                                          |   &#10003;   |
| Automated Version Update                                                           |   &#10003;   |
| Automatic Vertical Scaling                                                         |   &#10003;   |
| Automated Horizontal Scaling                                                       |   &#10003;   |
| Automated db-configure Reconfiguration                                             |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) |   &#10003;   |
| Automated Reprovision                                                              |   &#10003;   |
| Automated Volume Expansion                                                         |   &#10003;   |
| Autoscaling (vertically)                                                           |   &#10003;   |


## Life Cycle of a MongoDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.2.6-rc.0/images/mongodb/quick-start.png">
</p>

## User Guide

- [Quickstart MongoDB](/docs/v2025.2.6-rc.0/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [MongoDB Replicaset](/docs/v2025.2.6-rc.0/guides/mongodb/clustering/replicaset) with KubeDB Operator.
- [MongoDB Sharding](/docs/v2025.2.6-rc.0/guides/mongodb/clustering/sharding) with KubeDB Operator.
- [Backup & Restore](/docs/v2025.2.6-rc.0/guides/mongodb/backup/stash/overview/) MongoDB databases using Stash.
- Initialize [MongoDB with Script](/docs/v2025.2.6-rc.0/guides/mongodb/initialization/using-script).
- Start [MongoDB with Custom Config](/docs/v2025.2.6-rc.0/guides/mongodb/configuration/using-config-file).
- Monitor your MongoDB database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.2.6-rc.0/guides/mongodb/monitoring/using-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.2.6-rc.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.2.6-rc.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/v2025.2.6-rc.0/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/v2025.2.6-rc.0/guides/mongodb/concepts/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v2025.2.6-rc.0/guides/mongodb/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.2.6-rc.0/CONTRIBUTING).
