---
title: Updating RabbitMQ Overview
menu:
  docs_v2025.6.30:
    identifier: rm-update-version-overview
    name: Overview
    parent: rm-update-version
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# updating RabbitMQ version Overview

This guide will give you an overview on how KubeDB Ops-manager operator update the version of `RabbitMQ` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [RabbitMQ](/docs/v2025.6.30/guides/rabbitmq/concepts/rabbitmq)
  - [RabbitMQOpsRequest](/docs/v2025.6.30/guides/rabbitmq/concepts/opsrequest)

## How update version Process Works

The following diagram shows how KubeDB Ops-manager operator used to update the version of `RabbitMQ`. Open the image in a new tab to see the enlarged version.

The updating process consists of the following steps:

1. At first, a user creates a `RabbitMQ` Custom Resource (CR).

2. `KubeDB` Provisioner  operator watches the `RabbitMQ` CR.

3. When the operator finds a `RabbitMQ` CR, it creates required number of `PetSets` and other kubernetes native resources like secrets, services, etc.

4. Then, in order to update the version of the `RabbitMQ` database the user creates a `RabbitMQOpsRequest` CR with the desired version.

5. `KubeDB` Ops-manager operator watches the `RabbitMQOpsRequest` CR.

6. When it finds a `RabbitMQOpsRequest` CR, it halts the `RabbitMQ` object which is referred from the `RabbitMQOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `RabbitMQ` object during the updating process.  

7. By looking at the target version from `RabbitMQOpsRequest` CR, `KubeDB` Ops-manager operator updates the images of all the `PetSets`. After each image update, the operator performs some checks such as if the oplog is synced and database size is almost same or not.

8. After successfully updating the `PetSets` and their `Pods` images, the `KubeDB` Ops-manager operator updates the image of the `RabbitMQ` object to reflect the updated state of the database.

9. After successfully updating of `RabbitMQ` object, the `KubeDB` Ops-manager operator resumes the `RabbitMQ` object so that the `KubeDB` Provisioner  operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on updating of a RabbitMQ database using updateVersion operation.