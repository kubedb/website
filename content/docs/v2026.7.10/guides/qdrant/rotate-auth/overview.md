---
title: Rotate Authentication Overview
menu:
  docs_v2026.7.10:
    identifier: qdrant-rotate-auth-overview
    name: Overview
    parent: qdrant-rotate-auth
    weight: 10
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# Rotate Authentication of Qdrant

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Qdrant](/docs/v2026.7.10/guides/qdrant/concepts/qdrant)
  - [QdrantOpsRequest](/docs/v2026.7.10/guides/qdrant/concepts/opsrequest)

## How Rotate Qdrant Authentication Configuration Process Works

The authentication rotation process for Qdrant using KubeDB involves the following steps:

1. A user first creates a `Qdrant` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `Qdrant` CROs.

3. When the operator detects a `Qdrant` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `QdrantOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `QdrantOpsRequest` CRs.

6. Upon detecting a `QdrantOpsRequest`, the operator pauses the referenced `Qdrant` object, ensuring that the Provisioner operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `QdrantOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `Qdrant` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `Qdrant` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating Qdrant authentication using the `QdrantOpsRequest` CRD.
