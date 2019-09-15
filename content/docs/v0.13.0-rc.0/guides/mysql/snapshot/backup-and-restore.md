---
title: Instant Backup of MySQL
menu:
  docs_v0.13.0-rc.0:
    identifier: my-backup-and-restore-snapshot
    name: Instant Backup
    parent: my-snapshot-mysql
    weight: 10
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
info:
  version: v0.13.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).

# Database Snapshots

This tutorial will show you how to take snapshots of a KubeDB managed MySQL database.

> Note: The yaml files used in this tutorial are stored in [docs/examples/mysql](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/mysql) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

- [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) is required to run KubeDB. Check the available StorageClass in cluster.

  ```console
  $ kubectl get storageclasses
  NAME                 PROVISIONER                AGE
  standard (default)   k8s.io/minikube-hostpath   4h
  ```

- A `MySQL` database is needed to take snapshot for this tutorial. To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```console
  $ kubectl create ns demo
  namespace/demo created
  
  $ kubedb create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/mysql/snapshot/demo-1.yaml
  mysql.kubedb.com/mysql-instant created
  ```

## Instant Backups

You can easily take a snapshot of `MySQL` database by creating a `Snapshot` object. When a `Snapshot` object is created, KubeDB operator will launch a Job that runs the `mysql dump` command and uploads the output bson file to various cloud providers S3, GCS, Azure, OpenStack Swift and/or locally mounted volumes using [osm](https://github.com/appscode/osm).

In this tutorial, snapshots will be stored in a Google Cloud Storage (GCS) bucket. To do so, a secret is needed that has the following 2 keys:

| Key                               | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `GOOGLE_PROJECT_ID`               | `Required`. Google Cloud project ID                        |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key          |

```console
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key > GOOGLE_SERVICE_ACCOUNT_JSON_KEY
$ kubectl create secret generic my-snap-secret -n demo \
    --from-file=./GOOGLE_PROJECT_ID \
    --from-file=./GOOGLE_SERVICE_ACCOUNT_JSON_KEY
secret/my-snap-secret created
```

```yaml
$ kubectl get secret my-snap-secret -n demo -o yaml
apiVersion: v1
data:
  GOOGLE_PROJECT_ID: PHlvdX....1pZD4=
  GOOGLE_SERVICE_ACCOUNT_JSON_KEY: ewogICJ0eXBlIjogInN...9tIgp9Cg==
kind: Secret
metadata:
  creationTimestamp: 2018-02-09T12:02:08Z
  name: my-snap-secret
  namespace: demo
  resourceVersion: "30349"
  selfLink: /api/v1/namespaces/demo/secrets/my-snap-secret
  uid: 0dccee80-0d91-11e8-9091-08002751ae8c
type: Opaque
```

To lean how to configure other storage destinations for Snapshots, please visit [here](/docs/v0.13.0-rc.0/concepts/snapshot). Now, create the Snapshot object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
  gcs:
    bucket: kubedb-qa
```

```console
$ kubedb create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/mysql/snapshot/demo-2.yaml
snapshot.kubedb.com/snap-mysql-instant created

$ kubedb get snap -n demo
NAME                DATABASENAME   STATUS    AGE
snap-mysql-instant   mysql-instant   Running   13s
```

```yaml
$ kubedb get snap -n demo snap-mysql-instant -o yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: "2019-02-07T10:03:04Z"
  finalizers:
  - kubedb.com
  generation: 1
  labels:
    kubedb.com/kind: MySQL
    kubedb.com/name: mysql-instant
  name: snap-mysql-instant
  namespace: demo
  resourceVersion: "33763"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/demo/snapshots/snap-mysql-instant
  uid: 8f6d99b6-2abf-11e9-9d44-080027154f61
spec:
  databaseName: mysql-instant
  gcs:
    bucket: kubedb-qa
  storageSecretName: my-snap-secret
status:
  completionTime: "2019-02-07T10:03:15Z"
  phase: Succeeded
  startTime: "2019-02-07T10:03:04Z"
```

Here,

- `metadata.labels` should include the type of database `kubedb.com/kind: MySQL` whose snapshot will be taken.
- `spec.databaseName` points to the database whose snapshot is taken.
- `spec.storageSecretName` points to the Secret containing the credentials for snapshot storage destination.
- `spec.gcs.bucket` points to the bucket name used to store the snapshot data.

You can also run the `kubedb describe` command to see the recent snapshots taken for a database.

```console
$ kubedb describe my -n demo mysql-instant
Name:               mysql-instant
Namespace:          demo
CreationTimestamp:  Thu, 07 Feb 2019 16:02:40 +0600
Labels:             <none>
Annotations:        <none>
Replicas:           1  total
Status:             Running
  StorageType:      Durable
Volume:
  StorageClass:  standard
  Capacity:      1Gi
  Access Modes:  RWO

StatefulSet:          
  Name:               mysql-instant
  CreationTimestamp:  Thu, 07 Feb 2019 16:02:40 +0600
  Labels:               kubedb.com/kind=MySQL
                        kubedb.com/name=mysql-instant
  Annotations:        <none>
  Replicas:           824639341548 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:        
  Name:         mysql-instant
  Labels:         kubedb.com/kind=MySQL
                  kubedb.com/name=mysql-instant
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.96.188.33
  Port:         db  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.7:3306

Database Secret:
  Name:         mysql-instant-auth
  Labels:         kubedb.com/kind=MySQL
                  kubedb.com/name=mysql-instant
  Annotations:  <none>
  
Type:  Opaque
  
Data
====
  password:  16 bytes
  username:  4 bytes

Snapshots:
  Name               Bucket        StartTime                        CompletionTime                   Phase
  ----               ------        ---------                        --------------                   -----
  snap-mysql-instant  gs:kubedb-qa  Thu, 07 Feb 2019 16:03:04 +0600  Thu, 07 Feb 2019 16:03:15 +0600  Succeeded

Events:
  Type    Reason              Age   From             Message
  ----    ------              ----  ----             -------
  Normal  Successful          57s   KubeDB operator  Successfully created Service
  Normal  Successful          50s   KubeDB operator  Successfully created StatefulSet
  Normal  Successful          50s   KubeDB operator  Successfully created MySQL
  Normal  Successful          50s   KubeDB operator  Successfully created appbinding
  Normal  Successful          50s   KubeDB operator  Successfully patched StatefulSet
  Normal  Successful          50s   KubeDB operator  Successfully patched MySQL
  Normal  Starting            31s   KubeDB operator  Backup running
  Normal  SuccessfulSnapshot  22s   KubeDB operator  Successfully completed snapshot
```

Once the snapshot Job is complete, you should see the output of the `mysql dump` command stored in the GCS bucket.

![snapshot-console](/docs/v0.13.0-rc.0/images/mysql/m1-xyz-snapshot.png)

From the above image, you can see that the snapshot output is stored in a folder called `{bucket}/kubedb/{namespace}/{mysql-object}/{snapshot}/`.

## Restore from Snapshot

You can create a new database from a previously taken Snapshot. Specify the Snapshot name in the `spec.init.snapshotSource` field of a new MySQL object. See the example `mysql-recovered` object below:

> Note: MySQL `mysql-recovered` must have same superuser credentials as MySQL `mysql-instant`.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MySQL
metadata:
  name: mysql-recovered
  namespace: demo
spec:
  version: "8.0-v2"
  databaseSecret:
    secretName: mysql-instant-auth
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  init:
    snapshotSource:
      name: snap-mysql-instant
      namespace: demo
```

```console
$ kubedb create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/mysql/snapshot/demo-3.yaml
mysql.kubedb.com/mysql-recovered created
```

Here,

- `spec.init.snapshotSource.name` refers to a Snapshot object for a MySQL database in the same namespaces as this new `mysql-recovered` MySQL object.

Now, wait several seconds. KubeDB operator will create a new StatefulSet. Then KubeDB operator launches a Kubernetes Job to initialize the new database using the data from `snap-mysql-instant` Snapshot.

```console
$ kubedb get my -n demo
NAME              VERSION   STATUS         AGE
mysql-instant      8.0-v2    Running        27m
mysql-recovered   8.0-v2    Initializing   5m

$ kubedb get my -n demo
NAME              VERSION   STATUS    AGE
mysql-instant      8.0-v2    Running   31m
mysql-recovered   8.0-v2    Running   9m

$ kubedb describe my -n demo mysql-recovered
Name:               mysql-recovered
Namespace:          demo
CreationTimestamp:  Thu, 07 Feb 2019 16:04:04 +0600
Labels:             <none>
Annotations:        kubedb.com/initialized=
Replicas:           1  total
Status:             Running
  StorageType:      Durable
Volume:
  StorageClass:  standard
  Capacity:      1Gi
  Access Modes:  RWO

StatefulSet:          
  Name:               mysql-recovered
  CreationTimestamp:  Thu, 07 Feb 2019 16:04:05 +0600
  Labels:               kubedb.com/kind=MySQL
                        kubedb.com/name=mysql-recovered
  Annotations:        <none>
  Replicas:           824639093276 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:        
  Name:         mysql-recovered
  Labels:         kubedb.com/kind=MySQL
                  kubedb.com/name=mysql-recovered
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.99.68.200
  Port:         db  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.8:3306

Database Secret:
  Name:         mysql-instant-auth
  Labels:         kubedb.com/kind=MySQL
                  kubedb.com/name=mysql-instant
  Annotations:  <none>
  
Type:  Opaque
  
Data
====
  password:  16 bytes
  username:  4 bytes

No Snapshots.

Events:
  Type    Reason                Age   From             Message
  ----    ------                ----  ----             -------
  Normal  Successful            30s   KubeDB operator  Successfully created Service
  Normal  Successful            27s   KubeDB operator  Successfully created StatefulSet
  Normal  Successful            27s   KubeDB operator  Successfully created MySQL
  Normal  Initializing          26s   KubeDB operator  Initializing from Snapshot: "snap-mysql-instant"
  Normal  Successful            26s   KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            26s   KubeDB operator  Successfully patched MySQL
  Normal  SuccessfulInitialize  6s    KubeDB operator  Successfully completed initialization
  Normal  Successful            6s    KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            6s    KubeDB operator  Successfully patched MySQL
  Normal  Successful            6s    KubeDB operator  Successfully created appbinding
  Normal  Successful            6s    KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            6s    KubeDB operator  Successfully patched MySQL
```

## Customizing Snapshot

You can customize pod template spec and volume claim spec for the backup and restore jobs. For details options read [this doc](/docs/v0.13.0-rc.0/concepts/snapshot).

Some common customization sample is shown below.

**Specify PVC Template:**

Backup and recovery job needs a temporary storage to hold `dump` files before it can be uploaded to cloud backend or inserted into database. By default, KubeDB reads storage specification from `spec.storage` section of database crd and creates PVC with similar specification for backup or recovery job. However, if you want to specify custom PVC template, you can do it through `spec.podVolumeClaimSpec` field of Snapshot crd. This is particularly helpful when you want to use different `storageclass` for backup or recovery job than the database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
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

**Specify Resources for Backup/Recovery Job:**

You can specify resources for backup or recovery job through `spec.podTemplate.spec.resources` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
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

**Provide Annotation for Backup/Recovery Job:**

If you need to add some annotations to backup or recovery job, you can specify this in `spec.podTemplate.controller.annotations`. You can also specify annotation for the pod created by backup or recovery job through `spec.podTemplate.annotations` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
  gcs:
    bucket: kubedb
  podTemplate:
    annotations:
      passMe: ToBackupJobPod
    controller:
      annotations:
        passMe: ToBackupJob
```

**Pass Arguments to Backup/Recovery Job:**

KubeDB also allows to pass extra arguments for backup or recovery job. You can provide these arguments through `spec.podTemplate.spec.args` field of Snapshot crd.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
  gcs:
    bucket: kubedb
  podTemplate:
    spec:
      args:
      - --extra-args-to-backup-command
```

## Customizing Snapshot

You can customize pod template spec and volume claim spec for backup and restore jobs. For details options read [this doc](/docs/v0.13.0-rc.0/concepts/snapshot).

Some common customization examples are shown below:

**Specify PVC Template:**

Backup and recovery jobs use temporary storage to hold `dump` files before it can be uploaded to cloud backend or restored into database. By default, KubeDB reads storage specification from `spec.storage` section of database crd and creates a PVC with similar specification for backup or recovery job. However, if you want to specify a custom PVC template, you can do it via `spec.podVolumeClaimSpec` field of Snapshot crd. This is particularly helpful when you want to use different `storageclass` for backup or recovery jobs and the database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
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

**Specify Resources for Backup/Recovery Jobs:**

You can specify resources for backup or recovery jobs using `spec.podTemplate.spec.resources` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
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

**Provide Annotations for Backup/Recovery Jobs:**

If you need to add some annotations to backup or recovery jobs, you can specify those in `spec.podTemplate.controller.annotations`. You can also specify annotations for the pod created by backup or recovery jobs through `spec.podTemplate.annotations` field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
  gcs:
    bucket: kubedb
  podTemplate:
    annotations:
      passMe: ToBackupJobPod
    controller:
      annotations:
        passMe: ToBackupJob
```

**Pass Arguments to Backup/Recovery Job:**

KubeDB allows users to pass extra arguments for backup or recovery jobs. You can provide these arguments through `spec.podTemplate.spec.args` field of Snapshot crd.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mysql-instant
  namespace: demo
  labels:
    kubedb.com/kind: MySQL
spec:
  databaseName: mysql-instant
  storageSecretName: my-snap-secret
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
kubectl patch -n demo mysql/mysql-instant mysql/mysql-recovered -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mysql/mysql-instant mysql/mysql-recovered

kubectl patch -n demo drmn/mysql-instant drmn/mysql-recovered -p '{"spec":{"wipeOut":true}}' --type="merge"
kubectl delete -n demo drmn/mysql-instant drmn/mysql-recovered

kubectl delete ns demo
```

## Next Steps

- See the list of supported storage providers for snapshots [here](/docs/v0.13.0-rc.0/concepts/snapshot).
- Take [Scheduled Snapshot](/docs/v0.13.0-rc.0/guides/mysql/snapshot/scheduled-backup) of MySQL databases using KubeDB.
- Initialize [MySQL with Script](/docs/v0.13.0-rc.0/guides/mysql/initialization/using-script).
- Initialize [MySQL with Snapshot](/docs/v0.13.0-rc.0/guides/mysql/initialization/using-snapshot).
- Monitor your MySQL database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v0.13.0-rc.0/guides/mysql/monitoring/using-coreos-prometheus-operator).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v0.13.0-rc.0/guides/mysql/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v0.13.0-rc.0/guides/mysql/private-registry/using-private-registry) to deploy MySQL with KubeDB.
- Detail concepts of [MySQL object](/docs/v0.13.0-rc.0/concepts/databases/mysql).
- Detail concepts of [MySQLVersion object](/docs/v0.13.0-rc.0/concepts/catalog/mysql).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).
