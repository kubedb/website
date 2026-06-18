---
title: Setup Custom PgBouncerVersions
menu:
  docs_v2026.6.18-rc.2:
    identifier: pb-custom-versions-setup-pgbouncer
    name: Overview
    parent: pb-custom-versions-pgbouncer
    weight: 10
menu_name: docs_v2026.6.18-rc.2
section_menu_id: guides
info:
  autoscaler: v0.50.0-rc.2
  cli: v0.65.0-rc.2
  dashboard: v0.41.0-rc.2
  installer: v2026.6.18-rc.2
  ops-manager: v0.52.0-rc.2
  product: kubedb
  provisioner: v0.65.0-rc.2
  schema-manager: v0.41.0-rc.2
  ui-server: v0.41.0-rc.2
  version: v2026.6.18-rc.2
  webhook-server: v0.41.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.6.18-rc.2/README).

## Setting up Custom PgBouncerVersions

PgBouncerVersions are KubeDB crds that define the docker images KubeDB will use when deploying a pgbouncer server. For more details about PgBouncerVersion crd, please visit [here](/docs/v2026.6.18-rc.2/guides/pgbouncer/concepts/catalog).

## Creating a Custom PgBouncer Image for KubeDB

If you want to create a custom image of pgbouncer with additional features, the best way is to build on top of the existing kubedb image.

```docker
FROM kubedb/pgbouncer:1.23.1

ENV SOME_VERSION_VAR 0.9.1

RUN set -ex \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    curl \
    bash
```

From there, we would define a PgBouncerVersion that contains this new image. Let's say we tagged it as `myco/pgbouncer:custom-1.23.1`.  You can also build exporter image yourself using [pgbouncer_exporter](https://github.com/kubedb/pgbouncer_exporter) repository.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PgBouncerVersion
metadata:
  name: "1.23.1"
spec:
  deprecated: false
  version: "1.23.1"
  pgBouncer:
    image: "myco/pgbouncer:custom-1.23.1"
  exporter:
    image: "myco/pgbouncer_exporter:v0.1.1"
```

Once we add this PgBouncerVersion we can use it in a new PgBouncer like:

```yaml
apiVersion: kubedb.com/v1
kind: PgBouncer
metadata:
  name: pgbouncer-server
  namespace: demo
spec:
  version: "1.23.1"
  replicas: 1
  connectionPool:
    poolMode: session
    port: 5432
    reservePoolSize: 5
  database:
    syncUsers: true
    databaseName: "postgres"
    databaseRef:
      name: "quick-postgres"
      namespace: demo
```
