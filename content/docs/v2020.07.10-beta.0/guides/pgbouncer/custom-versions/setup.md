---
title: Setup Custom PgBouncerVersions
menu:
  docs_v2020.07.10-beta.0:
    identifier: pb-custom-versions-setup-pgbouncer
    name: Overview
    parent: pb-custom-versions-pgbouncer
    weight: 10
menu_name: docs_v2020.07.10-beta.0s
section_menu_id: guides
info:
  version: v2020.07.10-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.07.10-beta.0/concepts/README).

## Setting up Custom PgBouncerVersions

PgBouncerVersions are KubeDB crds that define the docker images KubeDB will use when deploying a pgbouncer server. For more details about PgBouncerVersion crd, please visit [here](/docs/v2020.07.10-beta.0/concepts/catalog/pgbouncer).

## Creating a Custom PgBouncer Image for KubeDB

If you want to create a custom image of pgbouncer with additional features, the best way is to build on top of the existing kubedb image.

```docker
FROM kubedb/pgbouncer:1.11.0

ENV SOME_VERSION_VAR 0.9.1

RUN set -ex \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    curl \
    bash
```

From there, we would define a PgBouncerVersion that contains this new image. Lets say we tagged it as `myco/pgbouncer:custom-1.11.0`.  You can also build exporter image yourself using [pgbouncer_exporter](https://github.com/kubedb/pgbouncer_exporter) repository.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PgBouncerVersion
metadata:
  name: "1.11.0-dev"
spec:
  deprecated: false
  version: "1.11.0"
  server:
    image: "myco/pgbouncer:custom-1.11.0"
  exporter:
    image: "myco/pgbouncer_exporter:v0.1.1"
```

Once we add this PgBouncerVersion we can use it in a new PgBouncer like:

```yaml
apiVersion: kubedb.com/v1alpha1
kind: PgBouncer
metadata:
  name: pgbouncer-server
  namespace: demo
spec:
  version: "1.11.0-dev"
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
      namespace: ""
  userListSecretRef:
    name: db-user-pass
```
