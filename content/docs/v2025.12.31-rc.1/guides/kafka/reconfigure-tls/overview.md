---
title: Reconfiguring TLS/SSL
menu:
  docs_v2025.12.31-rc.1:
    identifier: kf-reconfigure-tls-overview
    name: Overview
    parent: kf-reconfigure-tls
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Reconfiguring TLS of Kafka

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of `Kafka`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2025.12.31-rc.1/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2025.12.31-rc.1/guides/kafka/concepts/kafkaopsrequest)

## How Reconfiguring Kafka TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Kafka`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Kafka" src="/docs/v2025.12.31-rc.1/images/day-2-operation/kafka/kf-reconfigure-tls.svg">
<figcaption align="center">Fig: Reconfiguring TLS process of Kafka</figcaption>
</figure>

The Reconfiguring Kafka TLS process consists of the following steps:

1. At first, a user creates a `Kafka` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Kafka` CRO.

3. When the operator finds a `Kafka` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Kafka` database the user creates a `KafkaOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `KafkaOpsRequest` CR.

6. When it finds a `KafkaOpsRequest` CR, it pauses the `Kafka` object which is referred from the `KafkaOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Kafka` object during the reconfiguring TLS process.

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `KafkaOpsRequest` CR.

9. After the successful reconfiguring of the `Kafka` TLS, the `KubeDB` Ops-manager operator resumes the `Kafka` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a Kafka database using `KafkaOpsRequest` CRD.