---
title: MySQL Schema Manager Overview
menu:
  docs_v2024.6.4:
    identifier: mysql-schema-manager-overview
    name: Overview
    parent: guides-mysql-schema-manager
    weight: 10
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


## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2024.6.4/guides/mysql/concepts/database/)
  - [MySQLDatabase](/docs/v2024.6.4/guides/mysql/concepts/mysqldatabase/)


## What is Schema Manager

`Schema Manager` is a Kubernetes operator developed by AppsCode that implements multi-tenancy inside KubeDB provisioned database servers like MySQL, MariaDB, PosgreSQL and MongoDB etc. With `Schema Manager` one can create database into specific database server. An user will also be created with KubeVault and assigned to that database. Using the newly created user credential one can access the database and run operations into it. One may pass the database server reference, configuration, user access policy through a single yaml and `Schema Manager` will do all the task above mentioned. `Schema Manager` also allows initializing the database and restore snapshot while bootstrap.


## How MySQL Schema Manager Process Works

The following diagram shows how MySQL Schema Manager process worked. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="MySQL Schema Mananger Diagram" src="/docs/v2024.6.4/guides/mysql/schema-manager/overview/images/mysql-schema-manager-diagram.svg">
<figcaption align="center">Fig: Process of MySQL Schema Manager</figcaption>
</figure>

The process consists of the following steps:

1. At first the user will deploy a `MySQLDatabase` object.

2. Once a `MySQLDatabase` object is deployed to the cluster, the `Schema Manager` operator first verifies the object by checking the `Double-OptIn`. 

3. After the `Double-OptIn` verification `Schema Manager` operator checks in the `MySQL` server if the target database is already present or not. If the database already present there, then the `MySQLDatabase` object will be immediately denied. 

4. Once everything is ok in the `MySQL` server side, then the target database will be created and an entry for that will be entered in the `kubedb_system` database.

5. After successful database creation, the `Vault` server creates a user in the `MySQL` server. The user gets all the privileges on our target database and its credentials are served with a secret.

6. The user credentials secret reference is patched with the `MySQLDatabase` object yaml in the `.status.authSecret.name` field.

7. If there is any `init script` associated with the `MySQLDatabase` object, it will be executed in this step with the `Schema Manager` operator. 

8. The user can also provide a `snapshot` reference for initialization. In that case `Schema Manager` operator fetches necessary `appbinding`, `secrets`, `repository` and then the `Stash` operator takes action with all the information.

In the next doc, we are going to show a step by step guide of using MySQL Schema Manager with KubeDB.