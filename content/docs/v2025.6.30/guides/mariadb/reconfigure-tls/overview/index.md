---
title: Reconfiguring TLS of MariaDB Database
menu:
  docs_v2025.6.30:
    identifier: guides-mariadb-reconfigure-tls-overview
    name: Overview
    parent: guides-mariadb-reconfigure-tls
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Reconfiguring TLS of MariaDB Database

This guide will give an overview on how KubeDB Ops Manager reconfigures TLS configuration i.e. add TLS, remove TLS, update issuer/cluster issuer or Certificates and rotate the certificates of a `MariaDB` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MariaDB](/docs/v2025.6.30/guides/mariadb/concepts/mariadb)
  - [MariaDBOpsRequest](/docs/v2025.6.30/guides/mariadb/concepts/opsrequest)

## How Reconfiguring MariaDB TLS Configuration Process Works

The following diagram shows how KubeDB Ops Manager reconfigures TLS of a `MariaDB` database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="Reconfiguring TLS process of MariaDB" src="/docs/v2025.6.30/guides/mariadb/reconfigure-tls/overview/images/reconfigure-tls.jpeg">
<figcaption align="center">Fig: Reconfiguring TLS process of MariaDB</figcaption>
</figure>

The Reconfiguring MariaDB TLS process consists of the following steps:

1. At first, a user creates a `MariaDB` Custom Resource Object (CRO).

2. `KubeDB` Community operator watches the `MariaDB` CRO.

3. When the operator finds a `MariaDB` CR, it creates required number of `PetSets` and related necessary stuff like secrets, services, etc.

4. Then, in order to reconfigure the TLS configuration of the `MariaDB` database the user creates a `MariaDBOpsRequest` CR with desired information.

5. `KubeDB` Enterprise operator watches the `MariaDBOpsRequest` CR.

6. When it finds a `MariaDBOpsRequest` CR, it pauses the `MariaDB` object which is referred from the `MariaDBOpsRequest`. So, the `KubeDB` Community operator doesn't perform any operations on the `MariaDB` object during the reconfiguring TLS process.  

7. Then the `KubeDB` Enterprise operator will add, remove, update or rotate TLS configuration based on the Ops Request yaml.

8. Then the `KubeDB` Enterprise operator will restart all the Pods of the database so that they restart with the new TLS configuration defined in the `MariaDBOpsRequest` CR.

9. After the successful reconfiguring of the `MariaDB` TLS, the `KubeDB` Enterprise operator resumes the `MariaDB` object so that the `KubeDB` Community operator resumes its usual operations.

In the next docs, we are going to show a step by step guide on reconfiguring TLS configuration of a MariaDB database using `MariaDBOpsRequest` CRD.