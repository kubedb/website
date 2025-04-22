---
title: MariaDB Galera Cluster Overview
menu:
  docs_v2024.6.4:
    identifier: guides-mariadb-clustering-overview
    name: MariaDB Galera Cluster Overview
    parent: guides-mariadb-clustering
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# MariaDB Galera Cluster

Here we'll discuss some concepts about MariaDB Galera Cluster.

## So What is Replication

Replication means data being copied from one MariaDB server to one or more other MariaDB servers, instead of only stored in one server. One can read or write in any server of the cluster. The following figure shows a cluster of four MariaDB servers:

![MariaDB Cluster](/docs/v2024.6.4/guides/mariadb/clustering/overview/images/galera_small.png)

Image ref: <https://mariadb.com/kb/en/what-is-mariadb-galera-cluster/+image/galera_small>

## Galera Replication

MariaDB Galera Cluster is a [virtually synchronous](https://mariadb.com/kb/en/about-galera-replication/#synchronous-vs-asynchronous-replication) multi-master cluster for MariaDB. The Server replicates a transaction at commit time by broadcasting the write set associated with the transaction to every node in the cluster. The client connects directly to the DBMS and experiences behavior that is similar to native MariaDB in most cases. The wsrep API (write set replication API) defines the interface between Galera replication and MariaDB.

Ref: [About Galera Replication](https://mariadb.com/kb/en/about-galera-replication/)

## MariaDB Galera Cluster Features

- Virtually synchronous replication
- Active-active multi-master topology
- Read and write to any cluster node
- Automatic membership control, failed nodes drop from the cluster
- Automatic node joining
- True parallel replication, on row level
- Direct client connections, native MariaDB look & feel

Ref: [What is MariaDB Galera Cluster?](https://mariadb.com/kb/en/what-is-mariadb-galera-cluster/#features)

### Limitations

There are some limitations in MariaDB Galera Cluster that are listed [here](https://mariadb.com/kb/en/mariadb-galera-cluster-known-limitations/).

## Next Steps

- [Deploy MariaDB Galera Cluster](/docs/v2024.6.4/guides/mariadb/clustering/galera-cluster) using KubeDB.
