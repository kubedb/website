---
title: PerconaXtraDB Galera Cluster Overview
menu:
  docs_v2023.01.17:
    identifier: guides-perconaxtradb-clustering-overview
    name: PerconaXtraDB Galera Cluster Overview
    parent: guides-perconaxtradb-clustering
    weight: 10
menu_name: docs_v2023.01.17
section_menu_id: guides
info:
  autoscaler: v0.15.1
  cli: v0.30.1
  dashboard: v0.6.1
  installer: v2023.01.17
  ops-manager: v0.17.1
  provisioner: v0.30.1
  schema-manager: v0.6.1
  ui-server: v0.6.1
  version: v2023.01.17
  webhook-server: v0.6.1
---

> New to KubeDB? Please start [here](/docs/v2023.01.17/README).

# PerconaXtraDB Galera Cluster

Here we'll discuss some concepts about PerconaXtraDB Galera Cluster.

## Galera Clustering

PerconaXtraDB Galera Cluster is a `virtually synchronous` multi-master cluster for PerconaXtraDB. The Server replicates a transaction at commit time by broadcasting the write set associated with the transaction to every node in the cluster. The client connects directly to the DBMS and experiences behavior that is similar to native PerconaXtraDB in most cases. The wsrep API (write set replication API) defines the interface between Galera replication and PerconaXtraDB.

Ref: [About Galera Replication](https://galeracluster.com/library/documentation/tech-desc-introduction.html)

## PerconaXtraDB Galera Cluster Features

- Virtually synchronous replication
- Active-active multi-master topology
- Read and write to any cluster node
- Automatic membership control, failed nodes drop from the cluster
- Automatic node joining
- True parallel replication, on row level
- Direct client connections, native PerconaXtraDB look & feel

Ref: [Common Operations of PerconaXtraDB Galera Cluster and Group Replication?](https://www.percona.com/blog/2020/04/28/group-replication-and-percona-xtradb-cluster-overview-of-common-operations/)

### Limitations

There are some limitations in PerconaXtraDB Galera Cluster that are listed [here](https://docs.percona.com/percona-xtradb-cluster/8.0/limitation.html).

## Next Steps

- [Deploy PerconaXtraDB Galera Cluster](/docs/v2023.01.17/guides/percona-xtradb/clustering/galera-cluster) using KubeDB.
