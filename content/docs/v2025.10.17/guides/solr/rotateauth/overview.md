---
title: Rotate Authentication Overview
menu:
  docs_v2025.10.17:
    identifier: sl-rotate-auth-overview
    name: Overview
    parent: sl-rotate-auth
    weight: 5
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

# Rotate Authentication of Solr

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.10.17/guides/solr/concepts/solr)
    - [SolrOpsRequest](/docs/v2025.10.17/guides/solr/concepts/solropsrequests)

## How Rotate Solr Authentication Configuration Process Works

[//]: # (The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `Solr`. Open the image in a new tab to see the enlarged version.)

[//]: # ()
[//]: # (<figure align="center">)

[//]: # (  <img alt="Rotate Authentication process of Solr" src="/docs/v2025.10.17/images/day-2-operation/Solr/kf-rotate-auth.svg">)

[//]: # (<figcaption align="center">Fig: Rotate Auth process of Solr</figcaption>)

[//]: # (</figure>)

The authentication rotation process for Solr using KubeDB involves the following steps:

1. A user first creates a `Solr` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `Solr` CROs.

3. When the operator detects a `Solr` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `SolrOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `SolrOpsRequest` CRs.

6. Upon detecting a `SolrOpsRequest`, the operator pauses the referenced `Solr` object, ensuring that the Provisioner
operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `SolrOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `Solr` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `Solr` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating Solr authentication using the `SolrOpsRequest` CRD.