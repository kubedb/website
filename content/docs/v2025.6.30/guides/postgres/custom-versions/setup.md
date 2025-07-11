---
title: Setup Custom PostgresVersions
menu:
  docs_v2025.6.30:
    identifier: pg-custom-versions-setup-postgres
    name: Overview
    parent: pg-custom-versions-postgres
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

## Setting up Custom PostgresVersions

PostgresVersions are KubeDB crds that define the docker images KubeDB will use when deploying a postgres database. For more details about PostgresVersion crd, please visit [here](/docs/v2025.6.30/guides/postgres/concepts/catalog).

## Creating a Custom Postgres Database Image for KubeDB

The best way to create a custom image is to build on top of the existing kubedb image.

```docker
FROM kubedb/postgres:10.2-v3

ENV TIMESCALEDB_VERSION 0.9.1

RUN set -ex \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    openssl \
    tar \
    && mkdir -p /build/timescaledb \
    && wget -O /timescaledb.tar.gz https://github.com/timescale/timescaledb/archive/$TIMESCALEDB_VERSION.tar.gz \
    && tar -C /build/timescaledb --strip-components 1 -zxf /timescaledb.tar.gz \
    && rm -f /timescaledb.tar.gz \
    \
    && apk add --no-cache --virtual .build-deps \
    coreutils \
    dpkg-dev dpkg \
    gcc \
    libc-dev \
    make \
    cmake \
    util-linux-dev \
    \
    && cd /build/timescaledb \
    && ./bootstrap \
    && cd build && make install \
    && cd ~ \
    \
    && apk del .fetch-deps .build-deps \
    && rm -rf /build

RUN sed -r -i "s/[#]*\s*(shared_preload_libraries)\s*=\s*'(.*)'/\1 = 'timescaledb,\2'/;s/,'/'/" /scripts/primary/postgresql.conf
```

From there, we would define a PostgresVersion that contains this new image. Let's say we tagged it as `myco/postgres:timescale-0.9.1`

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PostgresVersion
metadata:
  name: timescaledb-2.14.2-pg14
spec:
  archiver:
    addon:
      name: postgres-addon
      tasks:
        manifestBackup:
          name: manifest-backup
        manifestRestore:
          name: manifest-restore
        volumeSnapshot:
          name: volume-snapshot
    walg:
      image: ghcr.io/kubedb/postgres-archiver:(v0.6.0)_14.10-alpine
  coordinator:
    image: ghcr.io/kubedb/pg-coordinator:v0.29.0
  db:
    baseOS: alpine
    image: timescale/timescaledb:2.14.2-pg14-oss
  distribution: TimescaleDB
  exporter:
    image: prometheuscommunity/postgres-exporter:v0.15.0
  initContainer:
    image: ghcr.io/kubedb/postgres-init:0.12.0
  podSecurityPolicies:
    databasePolicyName: postgres-db
  securityContext:
    runAsAnyNonRoot: false
    runAsUser: 70
  stash:
    addon:
      backupTask:
        name: postgres-backup-14.0
      restoreTask:
        name: postgres-restore-14.0
  version: "14.11"
```

Once we add this PostgresVersion we can use it in a new Postgres like:

```yaml
apiVersion: kubedb.com/v1
kind: Postgres
metadata:
  name: timescale-postgres
  namespace: demo
spec:
  version: "timescaledb-2.14.2-pg14" # points to the name of our custom PostgresVersion
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
```
