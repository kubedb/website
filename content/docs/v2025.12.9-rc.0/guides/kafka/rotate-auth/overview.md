---
title: Rotate Authentication Overview
menu:
  docs_v2025.12.9-rc.0:
    identifier: kf-rotate-auth-overview
    name: Overview
    parent: kf-rotate-auth
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

# Rotate Authentication of Kafka

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2025.12.9-rc.0/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2025.12.9-rc.0/guides/kafka/concepts/kafkaopsrequest)

## How Rotate Kafka Authentication Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `Kafka`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Rotate Authentication process of Kafka" src="/docs/v2025.12.9-rc.0/images/day-2-operation/kafka/kf-rotate-auth.svg">
<figcaption align="center">Fig: Rotate Auth process of Kafka</figcaption>
</figure>

The Rotate Kafka Authentication process consists of the following steps:

1. At first, a user creates a `Kafka` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Kafka` CRO.

3. When the operator finds a `Kafka` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to rotate the authentication configuration of the `Kafka`, the user creates a `KafkaOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `KafkaOpsRequest` CR.

6. When it finds a `KafkaOpsRequest` CR, it pauses the `Kafka` object which is referred from the `KafkaOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Kafka` object during the rotating Authentication process.

7. Then the `KubeDB` Ops-manager operator will update necessary configuration based on the Ops Request yaml to update credentials.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new authentication `ENVs` or other configuration defined in the `KafkaOpsRequest` CR.

9. After the successful rotating of the `Kafka` Authentication, the `KubeDB` Ops-manager operator resumes the `Kafka` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on rotating Authentication configuration of a Kafka using `KafkaOpsRequest` CRD.
