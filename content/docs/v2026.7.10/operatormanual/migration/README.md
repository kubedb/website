---
title: Migration
menu:
  docs_v2026.7.10:
    identifier: migration
    name: Migration
    parent: operatormanual
    weight: 20
menu_name: docs_v2026.7.10
section_menu_id: operatormanual
url: /docs/v2026.7.10/operatormanual/migration/
aliases:
- /docs/v2026.7.10/operatormanual/migration/README/
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# Migrate To KubeDB

KubeDB Migration lets you move an existing database — such as a MySQL instance running on AWS RDS or any external host — entirely into a KubeDB-managed database. The migration runs in the background while your source database continues to serve live traffic, and you only cut over once the streaming lag has dropped to a few megabytes — at which point stopping writes to the source drains the remaining lag to zero almost instantly.

## Why It Matters

- **No maintenance window** — the source database stays fully operational and accepting reads and writes before the cutover
- **Minimal downtime cutover** — you only stop writes to the source for the brief moment it takes for streaming lag to reach zero, then immediately redirect application endpoints to the new KubeDB-managed database.
- **Source stays untouched** — KubeDB never modifies the source database; you remain in control of when and whether to cut over.

## Setup

### Fresh Install

Add `--set kubedb-courier.enabled=true` to the standard [KubeDB helm install](/docs/v2026.7.10/setup/install/kubedb/helm) guide.

### Upgrade Existing Install

Each database has its own migration CRD (`PostgresMigration`, `MySQLMigration`, `MariaDBMigration`, `MongoDBMigration`, `MSSQLServerMigration`). The Helm upgrade command doesn't apply CRDs, so apply the one for the database you are migrating (or all of them) manually:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubedb/apimachinery/refs/heads/master/crds/courier.kubedb.com_postgresmigrations.yaml
kubectl apply -f https://raw.githubusercontent.com/kubedb/apimachinery/refs/heads/master/crds/courier.kubedb.com_mysqlmigrations.yaml
kubectl apply -f https://raw.githubusercontent.com/kubedb/apimachinery/refs/heads/master/crds/courier.kubedb.com_mariadbmigrations.yaml
kubectl apply -f https://raw.githubusercontent.com/kubedb/apimachinery/refs/heads/master/crds/courier.kubedb.com_mongodbmigrations.yaml
kubectl apply -f https://raw.githubusercontent.com/kubedb/apimachinery/refs/heads/master/crds/courier.kubedb.com_mssqlservermigrations.yaml
```

Add `--set kubedb-courier.enabled=true` to the [Kubedb helm upgrade](/docs/v2026.7.10/setup/upgrade/) 


## Migration Steps

1. **Create a migration CR** for your database — `PostgresMigration`, `MySQLMigration`, `MariaDBMigration`, `MongoDBMigration`, or `MSSQLServerMigration` — with your source connection details and target KubeDB database reference. Migration starts automatically.
2. **Source stays live** — the KubeDB Migration first copies the schema, then takes an initial bulk snapshot of your data. Your source database continues to accept reads and writes throughout.
3. **Streaming phase begins** — once the snapshot is complete, KubeDB streams ongoing changes from the source using CDC (change-data capture). 
4. **Stop writes to the source** — when the streaming lag approaches zero, stop source database write
5. **Wait for lag to reach zero** — once lag is exactly zero, the two databases are fully in sync.
6. **Switch endpoints** — update your application connection string to point to the new KubeDB-managed database.
7. **Downtime is minimal** — the only downtime is the window between steps 4 and 6, which is typically just a few minutes.

## Supported Database

The following database has migration support.

[PostgreSQL](/docs/v2026.7.10/guides/postgres/migration/databaseMigration)

[MySQL](/docs/v2026.7.10/guides/mysql/migration/databaseMigration)

[MariaDB](/docs/v2026.7.10/guides/mariadb/migration/databaseMigration)

[MongoDB](/docs/v2026.7.10/guides/mongodb/migration/databaseMigration)
