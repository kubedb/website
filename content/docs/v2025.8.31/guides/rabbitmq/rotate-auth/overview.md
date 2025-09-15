---
title: Rotate Authentication Overview
menu:
  docs_v2025.8.31:
    identifier: rm-rotate-auth-overview
    name: Overview
    parent: rm-rotateauth
    weight: 5
menu_name: docs_v2025.8.31
section_menu_id: guides
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

# Rotate Authentication of RabbitMQ

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [RabbitMQ](/docs/v2025.8.31/guides/rabbitmq/concepts/rabbitmq)
    - [RabbitMQOpsRequest](/docs/v2025.8.31/guides/rabbitmq/concepts/opsrequest)

## How Rotate RabbitMQ Authentication Configuration Process Works

[//]: # (The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `RabbitMQ`. Open the image in a new tab to see the enlarged version.)

[//]: # ()
[//]: # (<figure align="center">)

[//]: # (  <img alt="Rotate Authentication process of RabbitMQ" src="/docs/v2025.8.31/images/day-2-operation/RabbitMQ/kf-rotate-auth.svg">)

[//]: # (<figcaption align="center">Fig: Rotate Auth process of RabbitMQ</figcaption>)

[//]: # (</figure>)

The authentication rotation process for RabbitMQ using KubeDB involves the following steps:

1. A user first creates a `RabbitMQ` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `RabbitMQ` CROs.

3. When the operator detects a `RabbitMQ` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `RabbitMQOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `RabbitMQOpsRequest` CRs.

6. Upon detecting a `RabbitMQOpsRequest`, the operator pauses the referenced `RabbitMQ` object, ensuring that the Provisioner
   operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `RabbitMQOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `RabbitMQ` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `RabbitMQ` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating RabbitMQ authentication using the `RabbitMQOpsRequest` CRD.
