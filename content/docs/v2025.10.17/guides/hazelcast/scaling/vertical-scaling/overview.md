---
title: Hazelcast Vertical Scaling Overview
menu:
  docs_v2025.10.17:
    identifier: hz-vertical-scaling-overview
    name: Overview
    parent: hz-vertical-scaling
    weight: 10
menu_name: docs_v2025.10.17
section_menu_id: guides
info:
  autoscaler: v0.44.0
  cli: v0.59.0
  dashboard: v0.35.0
  installer: v2025.10.17
  ops-manager: v0.46.0
  provisioner: v0.59.0
  schema-manager: v0.35.0
  ui-server: v0.35.0
  version: v2025.10.17
  webhook-server: v0.35.0
---

> New to KubeDB? Please start [here](/docs/v2025.10.17/README).

# Hazelcast Vertical Scaling Overview

This guide will give you an overview on how KubeDB Ops Manager updates the resources(CPU and Memory) of the `Hazelcast` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Hazelcast](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast)
  - [HazelcastOpsRequest](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast-opsrequest)

## How Vertical Scaling Process Works

The following diagram shows how KubeDB Ops Manager updates the resources of the `Hazelcast` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
      <img alt="Vertical scaling process of Hazelcast" src="/docs/v2025.10.17/images/day-2-operation/hazelcast/hz-vertical-scaling.svg">
<figcaption align="center">Fig: Vertical scaling process of Hazelcast</figcaption>
</figure>

The updating process consists of the following steps:

1. At first, a user creates a `Hazelcast` Custom Resource (CR).

2. `KubeDB` Community operator watches the `Hazelcast` CR.

3. When the operator finds a `Hazelcast` CR, it creates required number of `StatefulSets` and related necessary stuff like appbinding, services, etc.

4. Then, in order to update the resources of the `Hazelcast` database the user creates a `HazelcastOpsRequest` CR with the desired resources.

5. `KubeDB` Enterprise operator watches the `HazelcastOpsRequest` CR.

6. When it finds a `HazelcastOpsRequest` CR, it halts the `Hazelcast` object which is referred from the `HazelcastOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `Hazelcast` object during the updating process.

7. Then the `KubeDB` Enterprise operator will update the resources of the related PetSets to match the desired resources defined in the `HazelcastOpsRequest` CR.

8. After the successful update of the resources of the StatefulSet's replicas, the `KubeDB` Enterprise operator updates the `Hazelcast` object to reflect the updated state.

9. After successfully updating of `Hazelcast` object, the `KubeDB` Enterprise operator resumes the `Hazelcast` object so that the `KubeDB` Community operator can resume its usual operations.

In the next doc, we are going to show a step-by-step guide on vertical scaling of a Hazelcast database using vertical scaling operation.
