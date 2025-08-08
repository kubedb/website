---
title: ProxySQL Cluster Overview
menu:
  docs_v2024.8.2-rc.2:
    identifier: guides-proxysql-clustering-overview
    name: ProxySQL Cluster Overview
    parent: guides-proxysql-clustering
    weight: 10
menu_name: docs_v2024.8.2-rc.2
section_menu_id: guides
info:
  autoscaler: v0.32.0-rc.2
  cli: v0.47.0-rc.2
  dashboard: v0.23.0-rc.2
  installer: v2024.8.2-rc.2
  ops-manager: v0.34.0-rc.2
  provisioner: v0.47.0-rc.2
  schema-manager: v0.23.0-rc.2
  ui-server: v0.23.0-rc.2
  version: v2024.8.2-rc.2
  webhook-server: v0.23.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2024.8.2-rc.2/README).

# ProxySQL Cluster

Here we'll discuss some concepts about ProxySQL Cluster.

## So What is Replication

Replication means there are multiple proxy server who are doing proxy with the traffic and all necessary configuration in all the nodes are same and in sync always. Change in any server configuration will eventually propagate to all other nodes and will behave the same. One can read or write in any server of the cluster. The following figure shows a cluster of four ProxySQL servers:

![ProxySQL Cluster](/docs/v2024.8.2-rc.2/guides/proxysql/clustering/overview/images/proxy-cluster.png)


## ProxySQL Cluster Features

- Virtually synchronous replication
- Read and write through any cluster node
- Cluster failover recovery
- Enhanced in performance than standalone proxy server
- Load balance in ProxySQL end


## Next Steps

- [Deploy ProxySQL Cluster](/docs/v2024.8.2-rc.2/guides/proxysql/clustering/proxysql-cluster/) using KubeDB.