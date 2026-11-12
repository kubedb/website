---
title: Rotate Authentication Overview
menu:
  docs_v2026.6.19:
    identifier: milvus-rotate-auth-overview
    name: Overview
    parent: milvus-rotate-auth
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

# Rotate Authentication of Milvus

This guide will give an overview on how the KubeDB Ops-manager operator rotates the authentication credentials of a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.6.19/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.6.19/guides/milvus/concepts/milvusopsrequest)

## How Rotate Authentication Process Works

Milvus authentication is enabled by default (`spec.disableSecurity` defaults to `false`). When you do not provide `spec.authSecret`, KubeDB auto-generates a `kubernetes.io/basic-auth` secret named `<db>-auth` containing a `root` user and a random password.

A `MilvusOpsRequest` of type `RotateAuth` rotates that credential. There are two modes:

1. **Operator-generated password** — omit `spec.authentication`. The operator generates a new random password and updates the existing auth secret in place.
2. **User-supplied credentials** — set `spec.authentication.secretRef.name` to a `Secret` (with `username`/`password` keys) you created. The operator switches the database to use your secret.

The flow is:

1. A user creates a `MilvusOpsRequest` of type `RotateAuth`.
2. The operator validates the request and pauses the `Milvus` database.
3. The credential is updated dynamically inside the running Milvus, then the rendered configuration and PetSets are reconciled to reference the new secret.
4. Pods are restarted to ensure every component uses the new credential.
5. The operator resumes the database and marks the `MilvusOpsRequest` as `Successful`.

## Relationship with the Recommendation Engine

Two fields on `spec.authSecret` drive automatic auth-rotation recommendations:

- **`rotateAfter`** — the maximum age of the credential. Once the secret is older than this duration, the Recommendation Engine emits a `RotateAuth` recommendation.
- **`activeFrom`** — the timestamp from which the current credential is considered active (also stamped on the secret via the `kubedb.com/auth-active-from` annotation). It is the reference point `rotateAfter` is measured from.

See the [Recommendation Engine guide](/docs/v2026.6.19/guides/milvus/recommendation/guide) for the end-to-end flow.

In the next doc, we will see a step-by-step guide on rotating authentication of a Milvus database.
