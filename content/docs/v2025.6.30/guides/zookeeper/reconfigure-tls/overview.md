---
title: Reconfiguring TLS/SSL
menu:
  docs_v2025.6.30:
    identifier: zk-reconfigure-tls-overview
    name: Overview
    parent: zk-reconfigure-tls
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Reconfiguring TLS of ZooKeeper

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update Issuer/Cluster Issuer or Certificates and rotate the Certificates of `ZooKeeper`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [ZooKeeper](/docs/v2025.6.30/guides/zookeeper/concepts/zookeeper)
    - [ZooKeeperOpsRequest](/docs/v2025.6.30/guides/zookeeper/concepts/opsrequest)

## How Reconfiguring ZooKeeper TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `ZooKeeper`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of ZooKeeper" src="/docs/v2025.6.30/images/day-2-operation/zookeeper/zk-reconfigure-tls.svg">
<figcaption align="center">Fig: Reconfiguring TLS process of ZooKeeper</figcaption>
</figure>

The Reconfiguring ZooKeeper TLS process consists of the following steps:

1. At first, a user creates a `ZooKeeper` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `ZooKeeper` CRO.

3. When the operator finds a `ZooKeeper` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `ZooKeeper` database the user creates a `ZooKeeperOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `ZooKeeperOpsRequest` CR.

6. When it finds a `ZooKeeperOpsRequest` CR, it pauses the `ZooKeeper` object which is referred from the `ZooKeeperOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `ZooKeeper` object during the reconfiguring TLS process.

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `ZooKeeperOpsRequest` CR.

9. After the successful reconfiguring of the `ZooKeeper` TLS, the `KubeDB` Ops-manager operator resumes the `ZooKeeper` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the [next](/docs/v2025.6.30/guides/zookeeper/reconfigure-tls/reconfigure-tls) docs, we are going to show a step by step guide on reconfiguring TLS configuration of a ZooKeeper database using `ZooKeeperOpsRequest` CRD.