---
title: PerconaXtraDB Galera Cluster Overview
menu:
  docs_v2023.08.18:
    identifier: guides-perconaxtradb-clustering-overview
    name: PerconaXtraDB Galera Cluster Overview
    parent: guides-perconaxtradb-clustering
    weight: 10
menu_name: docs_v2023.08.18
section_menu_id: guides
info:
  autoscaler: v0.20.0
  cli: v0.35.0
  dashboard: v0.11.0
  installer: v2023.08.18
  ops-manager: v0.22.0
  provisioner: v0.35.0
  schema-manager: v0.11.0
  ui-server: v0.11.0
  version: v2023.08.18
  webhook-server: v0.11.0
---

> New to KubeDB? Please start [here](/docs/v2023.08.18/README).

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

- [Deploy PerconaXtraDB Galera Cluster](/docs/v2023.08.18/guides/percona-xtradb/clustering/galera-cluster) using KubeDB.
