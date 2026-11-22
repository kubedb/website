---
title: Neo4j TLS/SSL Encryption Overview
menu:
  docs_v2026.6.19:
    identifier: neo4j-tls-overview
    name: Overview
    parent: neo4j-tls
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

# Neo4j TLS/SSL Encryption
## Before You Begin

To configure TLS/SSL in `Neo4j`, KubeDB uses `cert-manager` to issue certificates. Make sure `cert-manager` is installed in your cluster. You can install it by following the official guide [here](https://cert-manager.io/docs/installation/kubernetes/).

To issue certificates, the following cert-manager CRDs are used:

- `Issuer/ClusterIssuer`: Represents the certificate authority used to sign certificate requests.
- `Certificate`: Describes the desired X.509 certificate that cert-manager keeps renewed.

**Neo4j CRD Specification:**

KubeDB uses `spec.tls` in the `Neo4j` CR to enable transport encryption.

- `spec.tls.issuerRef` — the cert-manager Issuer or ClusterIssuer that signs Neo4j certificates.
- Protocol-specific TLS settings under `spec.tls` (for example `bolt`, `https`, and cluster channels).

**TLS mode reference:**

| Mode | What it means |
|------|---------------|
| `TLS` | Encrypts traffic. The server presents a certificate; clients do not need one. |
| `mTLS` | Mutual TLS. Both the server and client present certificates signed by the same CA. Use this to restrict which clients can connect. |

Read field details in [Neo4j concept](/docs/v2026.6.19/guides/neo4j/concepts/neo4j).

## How TLS/SSL is configured in Neo4j

The following figure shows the operational flow used by KubeDB to configure TLS/SSL in Neo4j.

<figure align="center">
  <img alt="Neo4j with TLS/SSL Flow" src="/docs/v2026.6.19/images/neo4j/TLS.png">
  <figcaption align="center">Fig: Deploy Neo4j with TLS/SSL</figcaption>
</figure>

Deploying Neo4j with TLS/SSL configuration consists of the following steps:

1. User creates an `Issuer/ClusterIssuer`.
2. User creates a `Neo4j` CR with `spec.tls`.
3. KubeDB operator watches the `Neo4j` CR and creates required resources.
4. KubeDB Ops Manager detects required resources and creates `Certificate` resources.
5. cert-manager watches `Certificate` resources and issues certificate Secrets.
6. KubeDB reconciles Neo4j pods with issued TLS certificates mounted.
7. Neo4j cluster becomes ready with encrypted transport enabled for configured protocols.

In the next document, we show a step-by-step guide for configuring a `Neo4j` database with TLS/SSL.
