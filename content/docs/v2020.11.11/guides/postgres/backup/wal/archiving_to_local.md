---
title: Continuous Archiving to Local Storage
menu:
  docs_v2020.11.11:
    identifier: pg-wal-local
    name: To Local Storage
    parent: pg-wal
    weight: 45
menu_name: docs_v2020.11.11
section_menu_id: guides
info:
  cli: v0.15.0
  community: v0.15.0
  enterprise: v0.2.0
  installer: v0.15.0
  version: v2020.11.11
---

> New to KubeDB? Please start [here](/docs/v2020.11.11/README).

# Continuous Archiving to Local Storage

**WAL-G** is used to continuously archive PostgreSQL WAL files. Please refer to [continuous archiving in KubeDB](/docs/v2020.11.11/guides/postgres/backup/wal/continuous_archiving) to learn more.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2020.11.11/setup/README).

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

## Create PostgreSQL with Continuous Archiving

For archiving, we need to configure Local Storage properly and use storage backend's information. Below is a Postgres object created with Continuous Archiving support that backs up WAL files to Local Storage.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Postgres
metadata:
  name: wal-postgres
  namespace: demo
spec:
  version: "11.1-v3"
  storageType: Durable
  replicas: 2
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  archiver:
    storage:
      local:
        mountPath: /tmp/sub0
        persistentVolumeClaim:
          claimName: pgbackup
```

Here,

- `spec.archiver.storage` specifies storage information that will be used by `WAL-G`
  - `storage.local` points to Local Storage configuration.
  - `storage.local.mountPath` points to the directory inside the pod where the local storage will be mounted.
  - `storage.local.persistentVolumeClaim` points to a local volume that can be mounted to store WAL files.

**Archiver Storage Setup**

Users can use any supported local volume as storage destination.
To keep things simple, persistent volume will be used as local storage destination throughout this tutorial.
Persistent volumes can be created automatically by creating a claim.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  namespace: demo
  name: pgbackup
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```

Additionally users can manually create persistent volume to use a specific directory and create claims to use that volume.

```yaml
#first Create PV storage
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0004
  labels:
    release: stable
spec:
  capacity:
    storage: 20Mi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: "standard"
  hostPath:
    path: "/data"
---
#Claim PV for your pods to use
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  namespace: demo
  name: pgbackup
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Mi
  storageClassName: "standard"
  selector:
    matchLabels:
      release: stable
```

Users need to make sure that the specified directory is accessible by pods using the Persistent Volume. Access permissions of file system objects can be altered by commands, such as `chmod -R 777 data`.

**Archiver Storage Backend**

To configure Local backend, following parameters are available:

| Parameter                                                     | Description                                                                                                 |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `spec.archiver.storage.local.mountPath`                       | `Required`. Path inside the pod where local volume will be mounted                                          |
| `spec.archiver.storage.local.persistentVolumeClaim.claimName` | `Required`. Name of the persistent volume claim that provides local directory where archives will be stored |

Now create this Postgres object with continuous archiving support.

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/postgres/backup/wal-postgres-local.yaml
postgres.kubedb.com/wal-postgres created
```

When database is ready, **WAL-G** takes a base backup and uploads it to the cloud storage defined by storage backend.

Archived data is stored where Persistent Volume points to.

## Termination Policy

If termination policy of this `wal-postgres` is set to `WipeOut` or, If `Spec.WipeOut` of dormant database is set to `true`, then the data in cloud backend will be deleted.

The data will be intact in other scenarios.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo pg/wal-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/wal-postgres

kubectl delete ns demo
```

## Next Steps

- Learn about initializing [PostgreSQL from WAL](/docs/v2020.11.11/guides/postgres/initialization/wal/wal_source) files stored in cloud.
