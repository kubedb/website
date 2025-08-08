---
title: Setup Custom PgBouncerVersions
menu:
  docs_v2022.12.13-rc.0:
    identifier: pb-custom-versions-setup-pgbouncer
    name: Overview
    parent: pb-custom-versions-pgbouncer
    weight: 10
menu_name: docs_v2022.12.13-rc.0s
section_menu_id: guides
info:
  autoscaler: v0.15.0-rc.0
  cli: v0.30.0-rc.0
  dashboard: v0.6.0-rc.0
  installer: v2022.12.13-rc.0
  ops-manager: v0.17.0-rc.0
  provisioner: v0.30.0-rc.0
  schema-manager: v0.6.0-rc.0
  ui-server: v0.6.0-rc.0
  version: v2022.12.13-rc.0
  webhook-server: v0.6.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2022.12.13-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2022.12.13-rc.0/setup/install/enterprise) to try this feature." >}}

## Setting up Custom PgBouncerVersions

PgBouncerVersions are KubeDB crds that define the docker images KubeDB will use when deploying a pgbouncer server. For more details about PgBouncerVersion crd, please visit [here](/docs/v2022.12.13-rc.0/guides/pgbouncer/concepts/catalog).

## Creating a Custom PgBouncer Image for KubeDB

If you want to create a custom image of pgbouncer with additional features, the best way is to build on top of the existing kubedb image.

```docker
FROM kubedb/pgbouncer:1.17.0

ENV SOME_VERSION_VAR 0.9.1

RUN set -ex \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    curl \
    bash
```

From there, we would define a PgBouncerVersion that contains this new image. Let's say we tagged it as `myco/pgbouncer:custom-1.17.0`.  You can also build exporter image yourself using [pgbouncer_exporter](https://github.com/kubedb/pgbouncer_exporter) repository.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PgBouncerVersion
metadata:
  name: "1.17.0"
spec:
  deprecated: false
  version: "1.17.0"
  pgBouncer:
    image: "myco/pgbouncer:custom-1.17.0"
  exporter:
    image: "myco/pgbouncer_exporter:v0.1.1"
```

Once we add this PgBouncerVersion we can use it in a new PgBouncer like:

```yaml
apiVersion: kubedb.com/v1alpha2
kind: PgBouncer
metadata:
  name: pgbouncer-server
  namespace: demo
spec:
  version: "1.17.0"
  replicas: 1
  connectionPool:
    adminUsers:
    - admin
    - admin1
    poolMode: session
    port: 5432
    reservePoolSize: 5
  databases:
    - alias: postgres
    databaseName: postgres
    databaseRef:
      name: quick-postgres
      namespace: demo
  userListSecretRef:
    name: db-user-pass
```
