---
title: MongoDB
menu:
  docs_0.9.0-rc.2:
    identifier: mg-readme-mongodb
    name: MongoDB
    parent: mg-mongodb-guides
    weight: 10
menu_name: docs_0.9.0-rc.2
section_menu_id: guides
url: /docs/0.9.0-rc.2/guides/mongodb/
aliases:
- /docs/0.9.0-rc.2/guides/mongodb/README/
info:
  version: 0.9.0-rc.2
---

> New to KubeDB? Please start [here](/docs/0.9.0-rc.2/concepts/README).

## Supported MongoDB Features

|                   Features                   | Availability |
| -------------------------------------------- | :----------: |
| Clustering - Sharding                        |   &#10007;   |
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

<br/>

## Life Cycle of a MongoDB Object

<p align="center">
  <img alt="lifecycle"  src="/docs/0.9.0-rc.2/images/mongodb/mgo-lifecycle.png">
</p>

<br/>

## Supported MongoDB Versions

| KubeDB Version | Mongo:3.4 | Mongo:3.6 |
|:--------------:|:---------:|:---------:|
| 0.1.0 - 0.7.0  | &#10007;  | &#10007;  |
| 0.8.0          | &#10003;  | &#10003;  |
| 0.9.0-rc.2     | &#10003;  | &#10003;  |

## Supported MongoDBVersion CRD

Here, &#10003; means supported and &#10007; means deprecated.

| NAME     | VERSION | KubeDB: 0.9.0-rc.2 |
|----------|---------|--------------------|
| 3.4      | 3.4     | &#10007;           |
| 3.4-v1   | 3.4     | &#10003;           |
| 3.6      | 3.6     | &#10007;           |
| 3.6-v1   | 3.6     | &#10003;           |

## External tools dependency

|    Tool   | Version |
| --------- | :-----: |
| [peer-finder](https://github.com/kubernetes/contrib/tree/master/peer-finder) | latest  |
| [osm](https://github.com/appscode/osm) |  0.8.0  |

<br/>

## User Guide

- [Quickstart MongoDB](/docs/0.9.0-rc.2/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [Snapshot and Restore](/docs/0.9.0-rc.2/guides/mongodb/snapshot/backup-and-restore) process of MongoDB databases using KubeDB.
- Take [Scheduled Snapshot](/docs/0.9.0-rc.2/guides/mongodb/snapshot/scheduled-backup) of MongoDB databases using KubeDB.
- Initialize [MongoDB with Script](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-script).
- Initialize [MongoDB with Snapshot](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-snapshot).
- Start [MongoDB with Custom Config](/docs/0.9.0-rc.2/guides/mongodb/custom-config/using-custom-config).
- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.9.0-rc.2/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/0.9.0-rc.2/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/0.9.0-rc.2/concepts/databases/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/0.9.0-rc.2/concepts/catalog/mongodb).
- Detail concepts of [Snapshot object](/docs/0.9.0-rc.2/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0-rc.2/CONTRIBUTING).
