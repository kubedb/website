---
title: Kafka Vertical Scaling Overview
menu:
  docs_v2026.1.19:
    identifier: kf-vertical-scaling-overview
    name: Overview
    parent: kf-vertical-scaling
    weight: 10
menu_name: docs_v2026.1.19
section_menu_id: guides
info:
  autoscaler: v0.45.0
  cli: v0.60.0
  dashboard: v0.36.0
  installer: v2026.1.19
  ops-manager: v0.47.0
  provisioner: v0.60.0
  schema-manager: v0.36.0
  ui-server: v0.36.0
  version: v2026.1.19
  webhook-server: v0.36.0
---

> New to KubeDB? Please start [here](/docs/v2026.1.19/README).

# Kafka Vertical Scaling

This guide will give an overview on how KubeDB Ops-manager operator updates the resources(for example CPU and Memory etc.) of the `Kafka`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2026.1.19/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2026.1.19/guides/kafka/concepts/kafkaopsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops-manager operator updates the resources of the `Kafka`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Vertical scaling process of Kafka" src="/docs/v2026.1.19/images/day-2-operation/kafka/kf-vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of Kafka</figcaption>
</figure>

The vertical scaling process consists of the following steps:

1. At first, a user creates a `Kafka` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Kafka` CR.

3. When the operator finds a `Kafka` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to update the resources(for example `CPU`, `Memory` etc.) of the `Kafka` cluster, the user creates a `KafkaOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `KafkaOpsRequest` CR.

6. When it finds a `KafkaOpsRequest` CR, it halts the `Kafka` object which is referred from the `KafkaOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Kafka` object during the vertical scaling process.

7. Then the `KubeDB` Ops-manager operator will update resources of the PetSet Pods to reach desired state.

8. After the successful update of the resources of the PetSet's replica, the `KubeDB` Ops-manager operator updates the `Kafka` object to reflect the updated state.

9. After the successful update  of the `Kafka` resources, the `KubeDB` Ops-manager operator resumes the `Kafka` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on updating resources of Kafka database using `KafkaOpsRequest` CRD.