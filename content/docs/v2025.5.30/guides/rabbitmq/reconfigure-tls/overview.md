---
title: Reconfiguring TLS of RabbitMQ
menu:
  docs_v2025.5.30:
    identifier: rm-reconfigure-tls-overview
    name: Overview
    parent: rm-reconfigure-tls
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

# Reconfiguring TLS of RabbitMQ Database

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `RabbitMQ` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [RabbitMQ](/docs/v2025.5.30/guides/rabbitmq/concepts/rabbitmq)
  - [RabbitMQOpsRequest](/docs/v2025.5.30/guides/rabbitmq/concepts/opsrequest)

## How Reconfiguring RabbitMQ TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `RabbitMQ` database. Open the image in a new tab to see the enlarged version.

The Reconfiguring RabbitMQ TLS process consists of the following steps:

1. At first, a user creates a `RabbitMQ` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `RabbitMQ` CRO.

3. When the operator finds a `RabbitMQ` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `RabbitMQ` database the user creates a `RabbitMQOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `RabbitMQOpsRequest` CR.

6. When it finds a `RabbitMQOpsRequest` CR, it pauses the `RabbitMQ` object which is referred from the `RabbitMQOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `RabbitMQ` object during the reconfiguring TLS process.  

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `RabbitMQOpsRequest` CR.

9. After the successful reconfiguring of the `RabbitMQ` TLS, the `KubeDB` Ops-manager operator resumes the `RabbitMQ` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a RabbitMQ database using `RabbitMQOpsRequest` CRD.