---
title: Reconfiguring TLS of Pgpool
menu:
  docs_v2025.5.30:
    identifier: pp-reconfigure-tls-overview
    name: Overview
    parent: pp-reconfigure-tls
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

# Reconfiguring TLS of Pgpool

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `Pgpool`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Pgpool](/docs/v2025.5.30/guides/pgpool/concepts/pgpool)
  - [PgpoolOpsRequest](/docs/v2025.5.30/guides/pgpool/concepts/opsrequest)

## How Reconfiguring Pgpool TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Pgpool`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Pgpool" src="/docs/v2025.5.30/images/day-2-operation/pgpool/pp-reconfigure-tls.png">
<figcaption align="center">Fig: Reconfiguring TLS process of Pgpool</figcaption>
</figure>

The Reconfiguring Pgpool TLS process consists of the following steps:

1. At first, a user creates a `Pgpool` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Pgpool` CRO.

3. When the operator finds a `Pgpool` CR, it creates `PetSet` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Pgpool` the user creates a `PgpoolOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `PgpoolOpsRequest` CR.

6. When it finds a `PgpoolOpsRequest` CR, it pauses the `Pgpool` object which is referred from the `PgpoolOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Pgpool` object during the reconfiguring TLS process.  

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the pgpool so that they restart with the new TLS configuration defined in the `PgpoolOpsRequest` CR.

9. After the successful reconfiguring of the `Pgpool` TLS, the `KubeDB` Ops-manager operator resumes the `Pgpool` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step-by-step guide on reconfiguring TLS configuration of a Pgpool using `PgpoolOpsRequest` CRD.