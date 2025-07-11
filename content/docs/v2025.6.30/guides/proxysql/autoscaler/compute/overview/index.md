---
title: ProxySQL Compute Autoscaling Overview
menu:
  docs_v2025.6.30:
    identifier: guides-proxysql-autoscaling-compute-overview
    name: Overview
    parent: guides-proxysql-autoscaling-compute
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

# ProxySQL Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `proxysqlautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [ProxySQL](/docs/v2025.6.30/guides/proxysql/concepts/proxysql)
  - [ProxySQLAutoscaler](/docs/v2025.6.30/guides/proxysql/concepts/autoscaler)
  - [ProxySQLOpsRequest](/docs/v2025.6.30/guides/proxysql/concepts/opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `ProxySQL` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Auto Scaling process of ProxySQL" src="/docs/v2025.6.30/guides/proxysql/autoscaler/compute/overview/images/proxy-as-compute.png">
<figcaption align="center">Fig: Auto Scaling process of ProxySQL</figcaption>
</figure>

The Auto Scaling process consists of the following steps:

1. At first, the user creates a `ProxySQL` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `ProxySQL` CRO.

3. When the operator finds a `ProxySQL` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the CPU & Memory resources of the `ProxySQL` database the user creates a `ProxySQLAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `ProxySQLAutoscaler` CRO.

6. `KubeDB` Autoscaler operator utilizes the modified version of Kubernetes official [VPA-Recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg) for different components of the database, as specified in the `proxysqlautoscaler` CRO.
It generates recommendations based on resource usages, & store them in the `status` section of the autoscaler CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `ProxySQLOpsRequest` CRO to scale the database to match the recommendation provided by the VPA object.

8. `KubeDB Ops-Manager operator` watches the `ProxySQLOpsRequest` CRO.

9. Lastly, the `KubeDB Ops-Manager operator` will scale the database component vertically as specified on the `ProxySQLOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of ProxySQL database using `ProxySQLAutoscaler` CRD.
