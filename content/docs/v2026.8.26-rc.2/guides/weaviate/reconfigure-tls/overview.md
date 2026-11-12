---
title: Weaviate Reconfigure TLS Overview
menu:
  docs_v2026.8.26-rc.2:
    identifier: weaviate-reconfigure-tls-overview
    name: Overview
    parent: weaviate-reconfigure-tls
    weight: 10
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

# Reconfigure Weaviate TLS

This guide will give you an overview of how KubeDB Ops Manager reconfigures the TLS configuration of a `Weaviate` cluster — adding TLS, rotating certificates, updating the issuer, and removing TLS.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.8.26-rc.2/guides/weaviate/concepts/weaviate)
  - [Weaviate TLS](/docs/v2026.8.26-rc.2/guides/weaviate/tls/overview)

## How Reconfigure TLS Process Works

Weaviate TLS uses [cert-manager](https://cert-manager.io/) to issue the server and client certificates. The TLS configuration is referenced through `spec.tls` on the `Weaviate` object.

The reconfigure TLS process consists of the following steps:

1. The user creates a `WeaviateOpsRequest` CR of type `ReconfigureTLS` referencing the `Weaviate` database. The `spec.tls` field describes the desired change:
   - **Add / Update TLS** — provide `spec.tls.issuerRef` (and optionally `clientAuth`) to enable TLS or switch to a new issuer.
   - **Rotate certificates** — set `spec.tls.rotateCertificates: true` to re-issue the certificates.
   - **Remove TLS** — set `spec.tls.remove: true` to disable TLS.

2. `KubeDB` Ops Manager watches for the `WeaviateOpsRequest` CR and halts the `Weaviate` object.

3. For add/rotate/update operations, the Ops Manager creates or re-issues the `server` and `client` certificates through cert-manager and waits for them to be ready. For remove, it deletes the certificate references.

4. The Ops Manager updates the PetSet and restarts the pods one by one so they pick up the new TLS configuration. When TLS is enabled, the REST service port switches from `8080` (http) to `8443` (https); when removed, it switches back.

5. After successfully reconfiguring TLS, the `KubeDB` Ops Manager resumes the `Weaviate` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next doc, we are going to show a step-by-step guide on reconfiguring TLS for a Weaviate cluster.
