---
title: Scheduled Backup of MongoDB
menu:
  docs_v0.13.0-rc.0:
    identifier: mg-scheduled-backup-snapshot
    name: Scheduled Backup
    parent: mg-snapshot-mongodb
    weight: 10
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).

# Database Scheduled Snapshots

This tutorial will show you how to use KubeDB to take scheduled snapshot of a MongoDB database.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

- [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) is required to run KubeDB. Check the available StorageClass in cluster.

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```console
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: The yaml files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/mongodb) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Scheduled Backups

KubeDB supports taking periodic backups for a database using a [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26).  KubeDB operator will launch a Job periodically that runs the `mongodump` command and uploads the output bson file to various cloud providers S3, GCS, Azure, OpenStack Swift and/or locally mounted volumes using [osm](https://github.com/appscode/osm).

In this tutorial, snapshots will be stored in a Google Cloud Storage (GCS) bucket. To do so, a secret is needed that has the following 2 keys:

| Key  | Description  |
| ---- | ------------ |
| `GOOGLE_PROJECT_ID` | `Required`. Google Cloud project ID |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key |

```console
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key > GOOGLE_SERVICE_ACCOUNT_JSON_KEY
$ kubectl create secret generic mg-snap-secret -n demo \
    --from-file=./GOOGLE_PROJECT_ID \
    --from-file=./GOOGLE_SERVICE_ACCOUNT_JSON_KEY
secret "mg-snap-secret" created
```

```yaml
$ kubectl get secret mg-snap-secret -n demo -o yaml
apiVersion: v1
data:
  GOOGLE_PROJECT_ID: PHlvdXItcHJvamVjdC1pZD4=
  GOOGLE_SERVICE_ACCOUNT_JSON_KEY: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3V...9tIgp9Cg==
kind: Secret
metadata:
  creationTimestamp: 2018-02-02T10:02:09Z
  name: mg-snap-secret
  namespace: demo
  resourceVersion: "48679"
  selfLink: /api/v1/namespaces/demo/secrets/mg-snap-secret
  uid: 220a7c60-0800-11e8-946f-080027c05a6e
type: Opaque
```

To learn how to configure other storage destinations for Snapshots, please visit [here](/docs/v0.13.0-rc.0/concepts/snapshot).  Now, create the `MongoDB` object with scheduled snapshot.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
spec:
  version: "3.4-v3"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 1m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb-qa
```

```console
$ kubedb create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/mongodb/snapshot/demo-4.yaml
mongodb.kubedb.com/mgo-scheduled created
```

It is also possible to add  backup scheduler to an existing `MongoDB`. You just have to edit the `MongoDB` CRD and add below spec:

```yaml
$ kubedb edit mg {db-name} -n demo
spec:
  backupSchedule:
    cronExpression: '@every 1m'
    gcs:
      bucket: kubedb-qa
    storageSecretName: mg-snap-secret
```

Once the `spec.backupSchedule` is added, KubeDB operator will create a new Snapshot object on each tick of the cron expression. This triggers KubeDB operator to create a Job as it would for any regular instant backup process. You can see the snapshots as they are created using `kubedb get snap` command.

```console
$ kubedb get snap -n demo
NAME                            DATABASENAME    STATUS      AGE
mgo-scheduled-20180924-112630   mgo-scheduled   Succeeded   3m
mgo-scheduled-20180924-112741   mgo-scheduled   Succeeded   2m
mgo-scheduled-20180924-112841   mgo-scheduled   Succeeded   1m
mgo-scheduled-20180924-112941   mgo-scheduled   Running     8s
```

you should see the output of the `mongodump` command for each snapshot stored in the GCS bucket.

![snapshot-console](/docs/v0.13.0-rc.0/images/mongodb/mgo-scheduled.png)

From the above image, you can see that the snapshot output is stored in a folder called `{bucket}/kubedb/{namespace}/{mongodb-object}/{snapshot}/`.

## Remove Scheduler

To remove scheduler, edit the MongoDB object  to remove `spec.backupSchedule` section.

```yaml
$ kubedb edit mg mgo-scheduled -n demo
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
  ...
spec:
# backupSchedule:
#   cronExpression: '@every 1m'
#   gcs:
#     bucket: kubedb-qa
#   storageSecretName: mg-snap-secret
  databaseSecret:
    secretName: mgo-scheduled-auth
  storage:
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
    storageClassName: standard
  version: 3.4-v3
status:
  creationTime: 2018-02-02T10:46:18Z
  phase: Running
```

## Customizing `backupSchedule`

You can customize pod template spec and volume claim spec for the backup jobs by customizing `backupSchedule` section.

Some common customization examples are shown below:

**Specify PVC Template:**

Backup jobs use temporary storage to hold `dump` files before it can be uploaded to cloud backend. By default, KubeDB reads storage specification from `spec.storage` section of database crd and creates a PVC with similar specification for backup job. However, if you want to specify a custom PVC template, you can do it through `spec.backupSchedule.podVolumeClaimSpec` field. This is particularly helpful when you want to use different `storageclass` for backup jobs and the database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
spec:
  version: "3.4-v3"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 1m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb
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
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
spec:
  version: "3.4-v3"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 1m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb
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
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
spec:
  version: "3.4-v3"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 1m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb
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
kind: MongoDB
metadata:
  name: mgo-scheduled
  namespace: demo
spec:
  version: "3.4-v3"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backupSchedule:
    cronExpression: "@every 1m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb
    podTemplate:
      spec:
        args:
        - --extra-args-to-backup-command
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo mg/mgo-scheduled -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mg/mgo-scheduled

kubectl patch -n demo drmn/mgo-scheduled -p '{"spec":{"wipeOut":true}}' --type="merge"
kubectl delete -n demo drmn/mgo-scheduled

kubectl delete ns demo
```

## Next Steps

- See the list of supported storage providers for snapshots [here](/docs/v0.13.0-rc.0/concepts/snapshot).
- Initialize [MongoDB with Script](/docs/v0.13.0-rc.0/guides/mongodb/initialization/using-script).
- Initialize [MongoDB with Snapshot](/docs/v0.13.0-rc.0/guides/mongodb/initialization/using-snapshot).
- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v0.13.0-rc.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Detail concepts of [MongoDB object](/docs/v0.13.0-rc.0/concepts/databases/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v0.13.0-rc.0/concepts/catalog/mongodb).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).
