---
title: Reconfiguring TLS/SSL
menu:
  docs_v2024.9.30:
    identifier: guides-druid-reconfigure-tls-overview
    name: Overview
    parent: guides-druid-reconfigure-tls
    weight: 10
menu_name: docs_v2024.9.30
section_menu_id: guides
info:
  autoscaler: v0.33.0
  cli: v0.48.0
  dashboard: v0.24.0
  installer: v2024.9.30
  ops-manager: v0.35.0
  provisioner: v0.48.0
  schema-manager: v0.24.0
  ui-server: v0.24.0
  version: v2024.9.30
  webhook-server: v0.24.0
---

> New to KubeDB? Please start [here](/docs/v2024.9.30/README).

# Reconfiguring TLS of Druid

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of `Druid`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Druid](/docs/v2024.9.30/guides/druid/concepts/druid)
    - [DruidOpsRequest](/docs/v2024.9.30/guides/druid/concepts/druidopsrequest)

## How Reconfiguring Druid TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Druid`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Druid" src="/docs/v2024.9.30/guides/druid/reconfigure-tls/images/reconfigure-tls.png">
<figcaption align="center">Fig: Reconfiguring TLS process of Druid</figcaption>
</figure>

The Reconfiguring Druid TLS process consists of the following steps:

1. At first, a user creates a `Druid` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Druid` CRO.

3. When the operator finds a `Druid` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Druid` database the user creates a `DruidOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `DruidOpsRequest` CR.

6. When it finds a `DruidOpsRequest` CR, it pauses the `Druid` object which is referred from the `DruidOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Druid` object during the reconfiguring TLS process.

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `DruidOpsRequest` CR.

9. After the successful reconfiguring of the `Druid` TLS, the `KubeDB` Ops-manager operator resumes the `Druid` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a Druid database using `DruidOpsRequest` CRD.