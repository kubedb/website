---
title: Scheduled Backup of PostgreSQL
menu:
  docs_v0.13.0-rc.0:
    identifier: pg-scheduled-backup-snapshot
    name: Scheduled Backup
    parent: pg-snapshot-postgres
    weight: 15
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
info:
  version: v0.13.0-rc.0
---

> Don't know how backup works?  Check [tutorial](/docs/v0.13.0-rc.0/guides/postgres/snapshot/instant_backup) on Instant Backup.

# Database Scheduled Snapshots

KubeDB supports taking periodic backups for PostgreSQL database.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace/demo created
```

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Create Postgres with BackupSchedule

KubeDB supports taking periodic backups for a database using a [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26). KubeDB operator will launch a Job periodically that takes backup and uploads the output files to various cloud providers S3, GCS, Azure,
OpenStack Swift and/or locally mounted volumes using [osm](https://github.com/appscode/osm).

In this tutorial, snapshots will be stored in a Google Cloud Storage (GCS) bucket. To do so, a secret is needed that has the following 2 keys:

|                Key                |                    Description                    |
| --------------------------------- | ------------------------------------------------- |
| `GOOGLE_PROJECT_ID`               | `Required`. Google Cloud project ID               |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key |

```console
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key > GOOGLE_SERVICE_ACCOUNT_JSON_KEY
$ kubectl create secret -n demo generic gcs-secret \
    --from-file=./GOOGLE_PROJECT_ID \
    --from-file=./GOOGLE_SERVICE_ACCOUNT_JSON_KEY
secret "gcs-secret" created
```

To learn how to configure other storage destinations for Snapshots, please [visit here](/docs/v0.13.0-rc.0/concepts/snapshot).

Below is the Postgres object with BackupSchedule field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: scheduled-pg
  namespace: demo
spec:
  version: "9.6-v2"
  replicas: 3
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 2m"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
```

Here,

- [`cronExpression`](https://github.com/robfig/cron/blob/v2/doc.go) represents a set of times or interval when a single backup will be created.
- `storageSecretName` points to the Secret containing the credentials for snapshot storage destination.
- `gcs.bucket` points to the bucket name used to store the snapshot data

> Note: Secret object must be in the same namespace as Postgres, `scheduled-pg`, in this case.

Let's create a Postgres crd with backupSchedule,

```console
$ kubectl create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/postgres/snapshot/scheduled-pg.yaml
postgres.kubedb.com/scheduled-pg created
```

When PostgreSQL is successfully created, KubeDB operator creates a Snapshot object immediately and registers to create a new Snapshot object on each tick of the cron expression.

```console
$ kubectl get snap -n demo --selector="kubedb.com/kind=Postgres,kubedb.com/name=scheduled-pg"
NAME                           DATABASENAME   STATUS      AGE
scheduled-pg-20180921-090932   scheduled-pg   Succeeded   32s
```

## Update Postgres to Disable Periodic Backup

If you already have a running PostgreSQL that takes backup periodically, you can disable that by removing BackupSchedule field.

Edit your Postgres object and remove BackupSchedule. This will stop taking future backups for this schedule.

```console
$ kubectl edit pg -n demo scheduled-pg
spec:
#  backupSchedule:
#    cronExpression: '@every 2m'
#    storageSecretName: gcs-secret
#    gcs:
#      bucket: kubedb-qa
```

## Update Postgres to Enable Periodic Backup

If you already have a running Postgres, you can enable periodic backups by adding BackupSchedule.

Edit the Postgres `scheduled-pg` to add following `spec.backupSchedule` section.

```console
$ kubectl edit pg scheduled-pg -n demo
spec:
  backupSchedule:
    cronExpression: "@every 2m"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
```

Once the `spec.backupSchedule` is added, KubeDB operator creates a Snapshot object immediately and registers to create a new Snapshot object on each tick of the cron expression.

```console
$ kubectl get snap -n demo --selector="kubedb.com/kind=Postgres,kubedb.com/name=script-postgres"
NAME                              DATABASE             STATUS      AGE
instant-snapshot                  pg/script-postgres   Succeeded   30m
script-postgres-20180208-105625   pg/script-postgres   Succeeded   1m
```

## Customizing `backupSchedule`

You can customize pod template spec and volume claim spec for the backup jobs by customizing `backupSchedule` section.

Some common customization examples are shown below:

**Specify PVC Template:**

Backup jobs use temporary storage to hold `dump` files before it can be uploaded to cloud backend. By default, KubeDB reads storage specification from `spec.storage` section of database crd and creates a PVC with similar specification for backup job. However, if you want to specify a custom PVC template, you can do it through `spec.backupSchedule.podVolumeClaimSpec` field. This is particularly helpful when you want to use different `storageclass` for backup jobs and the database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: scheduled-pg
  namespace: demo
spec:
  version: "9.6-v2"
  replicas: 3
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
    podVolumeClaimSpec:
      storageClassName: "standard"
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi # make sure size is larger or equal than your database size
```

**Specify Resources for Backup Jobs:**

You can specify resources for backup jobs through `spec.backupSchedule.podTemplate.spec.resources` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: scheduled-pg
  namespace: demo
spec:
  version: "9.6-v2"
  replicas: 3
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
    podTemplate:
      spec:
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

**Provide Annotations for Backup Jobs:**

If you need to add some annotations to backup jobs, you can specify those in `spec.backupSchedule.podTemplate.controller.annotations`. You can also specify annotations for the pod created by backup jobs in `spec.backupSchedule.podTemplate.annotations` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: scheduled-pg
  namespace: demo
spec:
  version: "9.6-v4"
  replicas: 3
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
    podTemplate:
      annotations:
        passMe: ToBackupJobPod
      controller:
        annotations:
          passMe: ToBackupJob
```

**Pass Arguments to Backup Jobs:**

KubeDB allows users to pass extra arguments for backup jobs. You can provide these arguments via `spec.backupSchedule.podTemplate.spec.args` field of a Snapshot crd.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: scheduled-pg
  namespace: demo
spec:
  version: "9.6-v4"
  replicas: 3
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb-qa
    podTemplate:
      spec:
        args:
        - --extra-args-to-backup-command
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo pg/scheduled-pg -p '{"spec":{terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/scheduled-pg

kubectl delete -n demo secret/gcs-secret
kubectl delete ns demo
```

## Next Steps

- Learn about [taking instant backup](/docs/v0.13.0-rc.0/guides/postgres/snapshot/instant_backup) of PostgreSQL database using KubeDB Snapshot.
- Learn about initializing [PostgreSQL from KubeDB Snapshot](/docs/v0.13.0-rc.0/guides/postgres/initialization/snapshot_source).
- Setup [Continuous Archiving](/docs/v0.13.0-rc.0/guides/postgres/snapshot/continuous_archiving) in PostgreSQL using `wal-g`
- Want to setup PostgreSQL cluster? Check how to [configure Highly Available PostgreSQL Cluster](/docs/v0.13.0-rc.0/guides/postgres/clustering/ha_cluster)
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/v0.13.0-rc.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [CoreOS Prometheus Operator](/docs/v0.13.0-rc.0/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).
