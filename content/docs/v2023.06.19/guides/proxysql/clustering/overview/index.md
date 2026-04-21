---
title: ProxySQL Cluster Overview
menu:
  docs_v2023.06.19:
    identifier: guides-proxysql-clustering-overview
    name: ProxySQL Cluster Overview
    parent: guides-proxysql-clustering
    weight: 10
menu_name: docs_v2023.06.19
section_menu_id: guides
info:
  autoscaler: v0.19.0
  cli: v0.34.0
  dashboard: v0.10.0
  installer: v2023.06.19
  ops-manager: v0.21.0
  provisioner: v0.34.0
  schema-manager: v0.10.0
  ui-server: v0.10.0
  version: v2023.06.19
  webhook-server: v0.10.0
---

> New to KubeDB? Please start [here](/docs/v2023.06.19/README).

# ProxySQL Cluster

Here we'll discuss some concepts about ProxySQL Cluster.

## So What is Replication

Replication means there are multiple proxy server who are doing proxy with the traffic and all necessary configuration in all the nodes are same and in sync always. Change in any server configuration will eventually propagate to all other nodes and will behave the same. One can read or write in any server of the cluster. The following figure shows a cluster of four ProxySQL servers:

![ProxySQL Cluster](/docs/v2023.06.19/guides/proxysql/clustering/overview/images/proxy-cluster.png)


## ProxySQL Cluster Features

- Virtually synchronous replication
- Read and write through any cluster node
- Cluster failover recovery
- Enhanced in performance than standalone proxy server
- Load balance in ProxySQL end


## Next Steps

- [Deploy ProxySQL Cluster](/docs/v2023.06.19/guides/proxysql/clustering/proxysql-cluster/) using KubeDB.