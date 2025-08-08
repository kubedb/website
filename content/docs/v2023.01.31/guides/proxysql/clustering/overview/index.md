---
title: ProxySQL Cluster Overview
menu:
  docs_v2023.01.31:
    identifier: guides-proxysql-clustering-overview
    name: ProxySQL Cluster Overview
    parent: guides-proxysql-clustering
    weight: 10
menu_name: docs_v2023.01.31
section_menu_id: guides
info:
  autoscaler: v0.16.0
  cli: v0.31.0
  dashboard: v0.7.0
  installer: v2023.01.31
  ops-manager: v0.18.0
  provisioner: v0.31.0
  schema-manager: v0.7.0
  ui-server: v0.7.0
  version: v2023.01.31
  webhook-server: v0.7.0
---

> New to KubeDB? Please start [here](/docs/v2023.01.31/README).

# ProxySQL Cluster

Here we'll discuss some concepts about ProxySQL Cluster.

## So What is Replication

Replication means there are multiple proxy server who are doing proxy with the traffic and all necessary configuration in all the nodes are same and in sync always. Change in any server configuration will eventually propagate to all other nodes and will behave the same. One can read or write in any server of the cluster. The following figure shows a cluster of four ProxySQL servers:

![ProxySQL Cluster](/docs/v2023.01.31/guides/proxysql/clustering/overview/images/proxy-cluster.png)


## ProxySQL Cluster Features

- Virtually synchronous replication
- Read and write through any cluster node
- Cluster failover recovery
- Enhanced in performance than standalone proxy server
- Load balance in ProxySQL end


## Next Steps

- [Deploy ProxySQL Cluster](/docs/v2023.01.31/guides/proxysql/clustering/proxysql-cluster/) using KubeDB.