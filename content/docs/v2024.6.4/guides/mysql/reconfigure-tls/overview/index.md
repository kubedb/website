---
title: MySQL Vertical Reconfigure TLS Overview
menu:
  docs_v2024.6.4:
    identifier: guides-mysql-reconfigure-tls-overview
    name: Overview
    parent: guides-mysql-reconfigure-tls
    weight: 11
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Reconfigure TLS MySQL

This guide will give an overview on how KubeDB Ops Manager reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `MySQL` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2024.6.4/guides/mysql/concepts/database/)
  - [MySQLOpsRequest](/docs/v2024.6.4/guides/mysql/concepts/opsrequest/)

## How Reconfiguring MySQL TLS Configuration Process Works

The following diagram shows how the `KubeDB` Ops Manager reconfigure TLS of  the `MySQL` database server. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="reconfigure tls " src="/docs/v2024.6.4/guides/mysql/reconfigure-tls/overview/images/reconfigure-tls.jpg">
<figcaption align="center">Fig: Vertical scaling process of MySQL</figcaption>
</figure>

The Reconfiguring MySQL TLS process consists of the following steps:

1. At first, a user creates a `MySQL` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `MySQL` CRO.

3. When the operator finds a `MySQL` CR, it creates required number of `StatefulSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `MySQL` database the user creates a `MySQLOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MySQLOpsRequest` CR.

6. When it finds a `MySQLOpsRequest` CR, it pauses the `MySQL` object which is referred from the `MySQLOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MongoDB` object during the reconfiguring TLS process.

7. Then the `KubeDB` Enterprise operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Enterprise operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `MongoDBOpsRequest` CR.

9. After the successful reconfiguring of the `MySQL` TLS, the `KubeDB` Enterprise operator resumes the `MySQL` object so that the `KubeDB` Community operator resumes its usual operations.


In the next docs, we are going to show a step-by-step guide on reconfiguring tls of MySQL database using reconfigure-tls operation.