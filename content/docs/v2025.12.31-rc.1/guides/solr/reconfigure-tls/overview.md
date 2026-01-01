---
title: Reconfiguring TLS/SSL
menu:
  docs_v2025.12.31-rc.1:
    identifier: sl-reconfigure-tls-overview
    name: Overview
    parent: sl-reconfigure-tls
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Reconfiguring TLS of Solr

This guide will give an overview on how KubeDB Ops-manager operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of `Solr`.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.12.31-rc.1/guides/solr/concepts/solr)
    - [SolrOpsRequest](/docs/v2025.12.31-rc.1/guides/solr/concepts/solropsrequests)

## How Reconfiguring Solr TLS Configuration Process Works

The following diagram shows how KubeDB Ops-manager operator reconfigures TLS of a `Solr`. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of Solr" src="/docs/v2025.12.31-rc.1/images/day-2-operation/solr/reconfigure-tls.svg">
<figcaption align="center">Fig: Reconfiguring TLS process of Solr</figcaption>
</figure>

The Reconfiguring Solr TLS process consists of the following steps:

1. At first, a user creates a `Solr` Custom Resource Object (CRO).

2. `KubeDB` Provisioner  operator watches the `Solr` CRO.

3. When the operator finds a `Solr` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `Solr` database the user creates a `SolrOpsRequest` CR with desired information.

5. `KubeDB` Ops-manager operator watches the `SolrOpsRequest` CR.

6. When it finds a `SolrOpsRequest` CR, it pauses the `Solr` object which is referred from the `SolrOpsRequest`. So, the `KubeDB` Provisioner  operator doesn't perform any operations on the `Solr` object during the reconfiguring TLS process.

7. Then the `KubeDB` Ops-manager operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Ops-manager operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `SolrOpsRequest` CR.

9. After the successful reconfiguring of the `Solr` TLS, the `KubeDB` Ops-manager operator resumes the `Solr` object so that the `KubeDB` Provisioner  operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a Solr database using `SolrOpsRequest` CRD.