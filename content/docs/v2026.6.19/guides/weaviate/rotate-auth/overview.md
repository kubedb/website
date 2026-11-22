---
title: Weaviate Rotate Authentication Overview
menu:
  docs_v2026.6.19:
    identifier: weaviate-rotate-auth-overview
    name: Overview
    parent: weaviate-rotate-auth
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# Rotate Authentication of Weaviate

This guide will give you an overview of how KubeDB Ops Manager rotates the API-key authentication of a `Weaviate` cluster.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.6.19/guides/weaviate/concepts/weaviate)
  - [Weaviate Quickstart](/docs/v2026.6.19/guides/weaviate/quickstart/quickstart)

## How Rotate Authentication Process Works

By default, KubeDB enables API-key authentication for a Weaviate cluster and stores the generated key in a Secret named `<database-name>-auth`. Rotating authentication replaces this key.

The rotate authentication process consists of the following steps:

1. The user creates a `WeaviateOpsRequest` CR of type `RotateAuth` referencing the `Weaviate` database. There are two modes:
   - **Operator-generated key** — when no `spec.authentication.secretRef` is provided, the Ops Manager generates a brand-new random API key.
   - **User-provided key** — when `spec.authentication.secretRef` is provided, the Ops Manager uses the key from the referenced Secret.

2. `KubeDB` Ops Manager watches for the `WeaviateOpsRequest` CR and halts the `Weaviate` object.

3. The Ops Manager updates the auth Secret with the new key. It also keeps the previous key in a `*-PREV` data field so that in-flight clients still using the old key have a short grace window, and it records the `activeFrom` timestamp.

4. The Ops Manager updates the PetSet and restarts the pods one by one so they pick up the new key.

5. After successfully rotating the key, the `KubeDB` Ops Manager resumes the `Weaviate` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next doc, we are going to show a step-by-step guide on rotating the authentication of a Weaviate cluster.
