---
title: Kafka Horizontal Scaling Overview
menu:
  docs_v2025.4.30:
    identifier: kf-horizontal-scaling-overview
    name: Overview
    parent: kf-horizontal-scaling
    weight: 10
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Kafka Horizontal Scaling

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `Kafka` cluster replicas of various component such as Combined, Broker, Controller.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2025.4.30/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2025.4.30/guides/kafka/concepts/kafkaopsrequest)

## How Horizontal Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator scales up or down `Kafka` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Horizontal scaling process of Kafka" src="/docs/v2025.4.30/images/day-2-operation/kafka/kf-horizontal-scaling.svg">
<figcaption align="center">Fig: Horizontal scaling process of Kafka</figcaption>
</figure>

The Horizontal scaling process consists of the following steps:

1. At first, a user creates a `Kafka` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Kafka` CR.

3. When the operator finds a `Kafka` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to scale the various components (ie. ReplicaSet, Shard, ConfigServer, Mongos, etc.) of the `Kafka` cluster, the user creates a `KafkaOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `KafkaOpsRequest` CR.

6. When it finds a `KafkaOpsRequest` CR, it halts the `Kafka` object which is referred from the `KafkaOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Kafka` object during the horizontal scaling process.

7. Then the `KubeDB` Ops-manager operator will scale the related PetSet Pods to reach the expected number of replicas defined in the `KafkaOpsRequest` CR.

8. After the successfully scaling the replicas of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the number of replicas in the `Kafka` object to reflect the updated state.

9. After the successful scaling of the `Kafka` replicas, the `KubeDB` Ops-manager operator resumes the `Kafka` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on horizontal scaling of Kafka cluster using `KafkaOpsRequest` CRD.