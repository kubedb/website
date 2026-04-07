---
title: Kafka Volume Expansion Overview
menu:
  docs_v2025.12.9-rc.0:
    identifier: kf-volume-expansion-overview
    name: Overview
    parent: kf-volume-expansion
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

# Kafka Volume Expansion

This guide will give an overview on how KubeDB Ops-manager operator expand the volume of various component of `Kafka` like:. (Combined and Topology).

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2025.12.9-rc.0/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2025.12.9-rc.0/guides/kafka/concepts/kafkaopsrequest)

## How Volume Expansion Process Works

The following diagram shows how KubeDB Ops-manager operator expand the volumes of `Kafka` database components. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Volume Expansion process of Kafka" src="/docs/v2025.12.9-rc.0/images/day-2-operation/kafka/kf-volume-expansion.svg">
<figcaption align="center">Fig: Volume Expansion process of Kafka</figcaption>
</figure>

The Volume Expansion process consists of the following steps:

1. At first, a user creates a `Kafka` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `Kafka` CR.

3. When the operator finds a `Kafka` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Each PetSet creates a Persistent Volume according to the Volume Claim Template provided in the petset configuration. This Persistent Volume will be expanded by the `KubeDB` Ops-manager operator.

5. Then, in order to expand the volume of the various components (ie. Combined, Broker, Controller) of the `Kafka`, the user creates a `KafkaOpsRequest` CR with desired information.

6. `KubeDB` Ops-manager operator watches the `KafkaOpsRequest` CR.

7. When it finds a `KafkaOpsRequest` CR, it halts the `Kafka` object which is referred from the `KafkaOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Kafka` object during the volume expansion process.

8. Then the `KubeDB` Ops-manager operator will expand the persistent volume to reach the expected size defined in the `KafkaOpsRequest` CR.

9. After the successful Volume Expansion of the related PetSet Pods, the `KubeDB` Ops-manager operator updates the new volume size in the `Kafka` object to reflect the updated state.

10. After the successful Volume Expansion of the `Kafka` components, the `KubeDB` Ops-manager operator resumes the `Kafka` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on Volume Expansion of various Kafka database components using `KafkaOpsRequest` CRD.
