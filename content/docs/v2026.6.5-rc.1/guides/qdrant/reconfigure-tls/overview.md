---
title: Reconfiguring Qdrant TLS
menu:
  docs_v2026.6.5-rc.1:
    identifier: qdrant-reconfigure-tls-overview
    name: Overview
    parent: qdrant-reconfigure-tls
    weight: 10
menu_name: docs_v2026.6.5-rc.1
section_menu_id: guides
info:
  autoscaler: v0.50.0-rc.1
  cli: v0.65.0-rc.1
  dashboard: v0.41.0-rc.1
  installer: v2026.6.5-rc.1
  ops-manager: v0.52.0-rc.1
  product: kubedb
  provisioner: v0.65.0-rc.1
  schema-manager: v0.41.0-rc.1
  ui-server: v0.41.0-rc.1
  version: v2026.6.5-rc.1
  webhook-server: v0.41.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2026.6.5-rc.1/README).

# Reconfiguring TLS for Qdrant

This guide will give an overview of how KubeDB Ops-manager reconfigures TLS for a `Qdrant` database.

**QdrantOpsRequest CRD Specification:**

KubeDB uses the following CRD fields to reconfigure TLS in `Qdrant`.

- `spec:`
  - `type: ReconfigureTLS`
  - `tls:`
    - `issuerRef`
    - `certificates`
    - `client`
    - `p2p`
    - `rotateCertificates`
    - `remove`

Read about the fields in detail from the [QdrantOpsRequest Concepts](/docs/v2026.6.5-rc.1/guides/qdrant/concepts/opsrequest) page.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Qdrant](/docs/v2026.6.5-rc.1/guides/qdrant/concepts/qdrant)
  - [QdrantOpsRequest](/docs/v2026.6.5-rc.1/guides/qdrant/concepts/opsrequest)
  - [TLS Overview](/docs/v2026.6.5-rc.1/guides/qdrant/tls/overview)
- Use the example files from `docs/examples/qdrant/quickstart/distributed.yaml` and `docs/examples/qdrant/reconfigure-tls/`.

```bash
kubectl create ns demo
```

## Deploy Qdrant

```bash
kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/qdrant/quickstart/distributed.yaml
kubectl get qdrant -n demo qdrant-sample -w
```

## How Reconfigure TLS Works

The following figure shows how `KubeDB` reconfigures TLS in Qdrant. Open the image in a new tab to see the enlarged version.

<figure align="center">
<img alt="Reconfigure Qdrant TLS" src="/docs/v2026.6.5-rc.1/guides/qdrant/images/qdrant-tls.png">
<figcaption align="center">Fig: Reconfigure Qdrant TLS</figcaption>
</figure>

The Reconfigure TLS process consists of the following steps:

1. At first, a user creates a `Qdrant` CR.

2. `KubeDB-Provisioner` operator watches the `Qdrant` CR.

3. When the operator finds a `Qdrant` CR, it creates a `PetSet` and related necessary resources like secrets, services, etc.

4. Then, in order to reconfigure TLS of the `Qdrant` database, the user creates a `QdrantOpsRequest` CR specifying the desired TLS configuration. The user can add TLS to an existing non-TLS database, rotate the existing certificates, change the issuer, or remove TLS entirely.

5. `KubeDB` Ops-manager operator watches the `QdrantOpsRequest` CR.

6. When it finds a `QdrantOpsRequest` CR, it pauses the `Qdrant` object so that the `KubeDB-Provisioner` operator doesn't perform any operations on the `Qdrant` during the TLS reconfiguration process.

7. Then the `KubeDB` Ops-manager operator updates the TLS secrets and restarts the pods in a rolling fashion with the new TLS configuration.

8. After the successful TLS reconfiguration, the `KubeDB` Ops-manager updates the `Qdrant` object to reflect the updated TLS state.

9. After the successful Reconfigure TLS, the `KubeDB` Ops-manager resumes the `Qdrant` object so that the `KubeDB-Provisioner` resumes its usual operations.

KubeDB supports the following TLS reconfiguration operations for Qdrant:

- **Add TLS** — Enable TLS on an existing non-TLS Qdrant database.
- **Rotate TLS** — Rotate the existing TLS certificates to refresh expiring certificates.
- **Remove TLS** — Remove TLS from an existing TLS-enabled Qdrant database.

In the next doc, we are going to show a step-by-step guide on reconfiguring TLS for a Qdrant database using `QdrantOpsRequest` CRD.
