---
title: Setup Custom PgpoolVersions
menu:
  docs_v2024.6.4:
    identifier: pp-custom-versions-setup-pgpool
    name: Overview
    parent: pp-custom-versions-pgpool
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

## Setting up Custom PgpoolVersions

PgpoolVersions are KubeDB crds that define the docker images KubeDB will use when deploying a pgpool server. For more details about PgpoolVersion crd, please visit [here](/docs/v2024.6.4/guides/pgpool/concepts/catalog).

## Creating a Custom Pgpool Image for KubeDB

If you want to create a custom image of pgpool with additional features, the best way is to build on top of the existing kubedb image.

```docker
FROM ghcr.io/appscode-images/pgpool2:4.5.0

ENV SOME_VERSION_VAR 0.9.1

RUN set -ex \
    && apk add --no-cache --virtual .fetch-deps \
    ca-certificates \
    curl \
    bash
```

From there, we would define a PgpoolVersion that contains this new image. Let's say we tagged it as `myco/pgpool:custom-4.5.0`.  You can also build exporter image yourself using [pgpool_exporter](https://github.com/appscode-images/pgpool2_exporter/) repository.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PgpoolVersion
metadata:
  name: 4.5.0
spec:
  exporter:
    image: ghcr.io/appscode-images/pgpool2_exporter:v1.2.2
  pgpool:
    image: ghcr.io/appscode-images/pgpool2:4.5.0
  version: 4.5.0
  deprecated: false
```

Once we add this PgpoolVersion we can use it in a new Pgpool like:

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Pgpool
metadata:
  name: quick-pgpool
  namespace: pool
spec:
  version: "4.5.0"
  replicas: 1
  postgresRef:
    name: quick-postgres
    namespace: demo
  sslMode: disable
  clientAuthMode: md5
  syncUsers: true
  deletionPolicy: WipeOut
```
