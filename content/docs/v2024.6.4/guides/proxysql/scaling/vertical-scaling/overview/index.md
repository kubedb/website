---
title: ProxySQL Vertical Scaling Overview
menu:
  docs_v2024.6.4:
    identifier: guides-proxysql-scaling-vertical-overview
    name: Overview
    parent: guides-proxysql-scaling-vertical
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

# ProxySQL Vertical Scaling

This guide will give an overview on how KubeDB Ops Manager vertically scales up `ProxySQL`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [ProxySQL](/docs/v2024.6.4/guides/proxysql/concepts/proxysql/)
  - [ProxySQLOpsRequest](/docs/v2024.6.4/guides/proxysql/concepts/opsrequest/)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops Manager scales up or down `ProxySQL` instance resources. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of ProxySQL" src="/docs/v2024.6.4/guides/proxysql/scaling/vertical-scaling/overview/images/vertical-scaling.png">
<figcaption align="center">Fig: Vertical scaling process of ProxySQL</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `ProxySQL` Custom Resource (CR).

2. `KubeDB` Community operator watches the `ProxySQL` CR.

3. When the operator finds a `ProxySQL` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `ProxySQL` the user creates a `ProxySQLOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `ProxySQLOpsRequest` CR.

6. When it finds a `ProxySQLOpsRequest` CR, it halts the `ProxySQL` object which is referred from the `ProxySQLOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `ProxySQL` object during the vertical scaling process.  

7. Then the `KubeDB` Enterprise operator will update resources of the StatefulSet Pods to reach desired state.

8. After the successful update of the resources of the StatefulSet's replica, the `KubeDB` Enterprise operator updates the `ProxySQL` object to reflect the updated state.

9. After the successful update  of the `ProxySQL` resources, the `KubeDB` Enterprise operator resumes the `ProxySQL` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of ProxySQL using `ProxySQLOpsRequest` CRD.