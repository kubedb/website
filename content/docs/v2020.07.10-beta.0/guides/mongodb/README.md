---
title: MongoDB
menu:
  docs_v2020.07.10-beta.0:
    identifier: mg-readme-mongodb
    name: MongoDB
    parent: mg-mongodb-guides
    weight: 10
menu_name: docs_v2020.07.10-beta.0
section_menu_id: guides
url: /docs/v2020.07.10-beta.0/guides/mongodb/
aliases:
- /docs/v2020.07.10-beta.0/guides/mongodb/README/
info:
  version: v2020.07.10-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.07.10-beta.0/concepts/README).

## Supported MongoDB Features

|                   Features                   | Availability |
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
| Using CoreOS Prometheus Operator             |   &#10003;   |

## Life Cycle of a MongoDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2020.07.10-beta.0/images/mongodb/mgo-lifecycle.png">
</p>

## Supported MongoDB Versions

| KubeDB Version | Mongo:3.4 | Mongo:3.6 | Mongo:4.0.5, 4.0 | Mongo:4.1.7 |
| :------------: | :-------: | :-------: | :--------------: | :---------: |
| 0.1.0 - 0.7.0  | &#10007;  | &#10007;  |     &#10007;     |  &#10007;   |
|     0.8.0      | &#10003;  | &#10003;  |     &#10007;     |  &#10007;   |
|     0.9.0      | &#10003;  | &#10003;  |     &#10007;     |  &#10007;   |
|     0.10.0     | &#10003;  | &#10003;  |     &#10003;     |  &#10003;   |
|     0.11.0     | &#10003;  | &#10003;  |     &#10003;     |  &#10003;   |
|     0.12.0     | &#10003;  | &#10003;  |     &#10003;     |  &#10003;   |
|  v0.13.0-rc.0  | &#10003;  | &#10003;  |     &#10003;     |  &#10003;   |

## Supported MongoDBVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

|       NAME       | VERSION  | KubeDB: 0.9.0 | KubeDB: 0.10.0 | KubeDB: 0.11.0 | KubeDB: 0.12.0 | KubeDB: v0.13.0-rc.0 |
| :--------------: | :------: | :-----------: | :------------: | :------------: | :------------: | :------------------: |
|       3.4        |   3.4    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|      3.4-v1      |   3.4    |   &#10003;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|      3.4-v2      |   3.4    |   &#10007;    |    &#10003;    |    &#10003;    |    &#10007;    |       &#10007;       |
|      3.4-v3      |   3.4    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
|      3.4.14      |  3.4.17  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|  3.4.22, 3.4-v4  |  3.4.22  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|       3.6        |   3.6    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|      3.6-v1      |   3.6    |   &#10003;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10007;       |
|      3.6-v2      |   3.6    |   &#10007;    |    &#10003;    |    &#10003;    |    &#10007;    |       &#10007;       |
|      3.6-v3      |   3.6    |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
|      3.6.8       |  3.6.8   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|  3.6.13, 3.6-v4  |  3.6.13  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|    4.0.5, 4.0    |  4.0.5   |   &#10007;    |    &#10003;    |    &#10003;    |    &#10007;    |       &#10007;       |
| 4.0.5-v1, 4.0-v1 |  4.0.5   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
|      4.0.3       |  4.0.3   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|     4.0.5-v2     |  4.0.5   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|  4.0.11, 4.0-v2  |  4.0.11  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|      4.1.7       |  4.1.7   |   &#10007;    |    &#10003;    |    &#10003;    |    &#10007;    |       &#10007;       |
|     4.1.7-v1     |  4.1.7   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10003;    |       &#10003;       |
|      4.1.4       |  4.1.4   |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|     4.1.7-v2     | 4.1.7-v2 |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |
|   4.1.13, 4.1    |  4.1.13  |   &#10007;    |    &#10007;    |    &#10007;    |    &#10007;    |       &#10003;       |

## External tools dependency

| Tool                                                   | Version |
| ------------------------------------------------------ | :-----: |
| [peer-finder](https://github.com/kmodules/peer-finder) | latest  |
| [osm](https://github.com/appscode/osm)                 |  0.9.1  |

## User Guide

- [Quickstart MongoDB](/docs/v2020.07.10-beta.0/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [MongoDB Replicaset](/docs/v2020.07.10-beta.0/guides/mongodb/clustering/replicaset) with KubeDB Operator.
- [MongoDB Sharding](/docs/v2020.07.10-beta.0/guides/mongodb/clustering/sharding) with KubeDB Operator.
- [Snapshot and Restore](/docs/v2020.07.10-beta.0/guides/mongodb/snapshot/backup-and-restore) process of MongoDB databases using KubeDB.
- Take [Scheduled Snapshot](/docs/v2020.07.10-beta.0/guides/mongodb/snapshot/scheduled-backup) of MongoDB databases using KubeDB.
- Initialize [MongoDB with Script](/docs/v2020.07.10-beta.0/guides/mongodb/initialization/using-script).
- Initialize [MongoDB with Snapshot](/docs/v2020.07.10-beta.0/guides/mongodb/initialization/using-snapshot).
- Start [MongoDB with Custom Config](/docs/v2020.07.10-beta.0/guides/mongodb/configuration/using-custom-config).
- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v2020.07.10-beta.0/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2020.07.10-beta.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2020.07.10-beta.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/v2020.07.10-beta.0/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/v2020.07.10-beta.0/concepts/databases/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v2020.07.10-beta.0/concepts/catalog/mongodb).
- Detail concepts of [Snapshot object](/docs/v2020.07.10-beta.0/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.07.10-beta.0/CONTRIBUTING).
