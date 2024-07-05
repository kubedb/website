---
title: Reconfiguring TLS of MongoDB Database
menu:
  docs_v2021.06.23:
    identifier: mg-reconfigure-tls-overview
    name: Overview
    parent: mg-reconfigure-tls
    weight: 10
menu_name: docs_v2021.06.23
section_menu_id: guides
info:
  autoscaler: v0.4.0
  cli: v0.19.0
  community: v0.19.0
  enterprise: v0.6.0
  installer: v2021.06.23
  version: v2021.06.23
---

> New to KubeDB? Please start [here](/docs/v2021.06.23/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.06.23/setup/install/enterprise) to try this feature." >}}

# Reconfiguring TLS of MongoDB Database

This guide will give an overview on how KubeDB Enterprise operator reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `MongoDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2021.06.23/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2021.06.23/guides/mongodb/concepts/opsrequest)

## How Reconfiguring MongoDB TLS Configuration Process Works

The following diagram shows how KubeDB Enterprise operator reconfigures TLS of a `MongoDB` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of MongoDB" src="/docs/v2021.06.23/images/day-2-operation/mongodb/mg-reconfigure-tls.svg">
<figcaption align="center">Fig: Reconfiguring TLS process of MongoDB</figcaption>
</figure>

The Reconfiguring MongoDB TLS process consists of the following steps:

1. At first, a user creates a `MongoDB` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `MongoDB` CRO.

3. When the operator finds a `MongoDB` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `MongoDB` database the user creates a `MongoDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MongoDBOpsRequest` CR.

6. When it finds a `MongoDBOpsRequest` CR, it pauses the `MongoDB` object which is referred from the `MongoDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the reconfiguring TLS process.  

7. Then the `KubeDB` Enterprise operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Enterprise operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `MongoDBOpsRequest` CR.

9. After the successful reconfiguring of the `MongoDB` TLS, the `KubeDB` Enterprise operator resumes the `MongoDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a MongoDB database using `MongoDBOpsRequest` CRD.