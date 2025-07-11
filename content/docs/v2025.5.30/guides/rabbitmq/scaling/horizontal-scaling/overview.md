---
title: RabbitMQ Horizontal Scaling Overview
menu:
  docs_v2025.5.30:
    identifier: rm-horizontal-scaling-overview
    name: Overview
    parent: rm-horizontal-scaling
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# RabbitMQ Horizontal Scaling

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `RabbitMQ` cluster.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [RabbitMQ](/docs/v2025.5.30/guides/rabbitmq/concepts/rabbitmq)
  - [RabbitMQOpsRequest](/docs/v2025.5.30/guides/rabbitmq/concepts/opsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator scales up or down `RabbitMQ` database components. Open the image in a new tab to see the enlarged version.

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `RabbitMQ` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `RabbitMQ` CR.

3. When the operator finds a `RabbitMQ` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the `RabbitMQ` cluster, the user creates a `RabbitMQOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `RabbitMQOpsRequest` CR.

6. When it finds a `RabbitMQOpsRequest` CR, it halts the `RabbitMQ` object which is referred from the `RabbitMQOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `RabbitMQ` object during the horizontal scaling process.  

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `RabbitMQOpsRequest` CR.

8. After the successfully scaling the replicas of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `RabbitMQ` object to reflect the updated state.

9. After the successful scaling of the `RabbitMQ` replicas, the `KubeDB` Ops-manager operator resumes the `RabbitMQ` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of RabbitMQ database using `RabbitMQOpsRequest` CRD.