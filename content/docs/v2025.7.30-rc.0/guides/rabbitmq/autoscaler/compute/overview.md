---
title: RabbitMQ Compute Autoscaling Overview
menu:
  docs_v2025.7.30-rc.0:
    identifier: rm-autoscaling-compute-overview
    name: Overview
    parent: rm-autoscaling-compute
    weight: 10
menu_name: docs_v2025.7.30-rc.0
section_menu_id: guides
info:
  autoscaler: v0.42.0-rc.0
  cli: v0.57.0-rc.0
  dashboard: v0.33.0-rc.0
  installer: v2025.7.30-rc.0
  ops-manager: v0.44.0-rc.0
  provisioner: v0.57.0-rc.0
  schema-manager: v0.33.0-rc.0
  ui-server: v0.33.0-rc.0
  version: v2025.7.30-rc.0
  webhook-server: v0.33.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.7.30-rc.0/README).

# RabbitMQ Compute Resource Autoscaling

This guide will give an overview on how KubeDB Autoscaler operator autoscales the database compute resources i.e. cpu and memory using `RabbitMQautoscaler` crd.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [RabbitMQ](/docs/v2025.7.30-rc.0/guides/rabbitmq/concepts/rabbitmq)
  - [RabbitMQAutoscaler](/docs/v2025.7.30-rc.0/guides/rabbitmq/concepts/autoscaler)
  - [RabbitMQOpsRequest](/docs/v2025.7.30-rc.0/guides/rabbitmq/concepts/opsrequest)

## How Compute Autoscaling Works

The following diagram shows how KubeDB Autoscaler operator autoscales the resources of `RabbitMQ` database components. Open the image in a new tab to see the enlarged version.


The Auto Scaling process consists of the following steps:

1. At first, a user creates a `RabbitMQ` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `RabbitMQ` CRO.

3. When the operator finds a `RabbitMQ` CRO, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to set up autoscaling of the of the `RabbitMQ` cluster the user creates a `RabbitMQAutoscaler` CRO with desired configuration.

5. `KubeDB` Autoscaler operator watches the `RabbitMQAutoscaler` CRO.

6. `KubeDB` Autoscaler operator generates recommendation using the modified version of kubernetes [official recommender](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler/pkg/recommender) for different components of the database, as specified in the `RabbitMQAutoscaler` CRO.

7. If the generated recommendation doesn't match the current resources of the database, then `KubeDB` Autoscaler operator creates a `RabbitMQOpsRequest` CRO to scale the database to match the recommendation generated.

8. `KubeDB` Ops-manager operator watches the `RabbitMQOpsRequest` CRO.

9. Then the `KubeDB` Ops-manager operator will scale the database component vertically as specified on the `RabbitMQOpsRequest` CRO.

In the next docs, we are going to show a step by step guide on Autoscaling of various RabbitMQ database components using `RabbitMQAutoscaler` CRD.
