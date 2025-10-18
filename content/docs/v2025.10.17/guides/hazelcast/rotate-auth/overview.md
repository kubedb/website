---
title: Rotate Authentication Overview
menu:
  docs_v2025.10.17:
    identifier: hz-rotate-auth-overview
    name: Overview
    parent: hz-rotate-auth
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

# Rotate Authentication of Hazelcast

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Hazelcast](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast)
    - [HazelcastOpsRequest](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast-opsrequest)

## How Rotate Hazelcast Authentication Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `Hazelcast`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Rotate Authentication process of Hazelcast" src="/docs/v2025.10.17/images/day-2-operation/hazelcast/hz-rotate-auth.svg">
<figcaption align="center">Fig: Rotate Auth process of Hazelcast</figcaption>
</figure>

The Rotate Hazelcast Authentication process consists of the following steps:

1. At first, a user creates a `Hazelcast` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Hazelcast` CRO.

3. When the operator finds a `Hazelcast` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to rotate the authentication configuration of the `Hazelcast`, the user creates a `HazelcastOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `HazelcastOpsRequest` CR.

6. When it finds a `HazelcastOpsRequest` CR, it pauses the `Hazelcast` object which is referred from the `HazelcastOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Hazelcast` object during the rotating Authentication process.

7. Then the `KubeDB` Ops-manager operator will update necessary configuration based on the Ops Request yaml to update credentials.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new authentication `ENVs` or other configuration defined in the `HazelcastOpsRequest` CR.

9. After the successful rotating of the `Hazelcast` Authentication, the `KubeDB` Ops-manager operator resumes the `Hazelcast` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on rotating Authentication configuration of a Hazelcast using `HazelcastOpsRequest` CRD.
