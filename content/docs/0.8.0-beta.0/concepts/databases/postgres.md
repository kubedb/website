---
title: Postgres
menu:
  docs_0.8.0-beta.0:
    identifier: postgres-db
    name: Postgres
    parent: databases
    weight: 30
menu_name: docs_0.8.0-beta.0
section_menu_id: concepts
info:
  version: 0.8.0-beta.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.0/guides/README).

# Postgres

## What is Postgres
A `Postgres` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [PostgreSQL](https://www.postgresql.org/) in a Kubernetes native way. You only need to describe the desired database configuration in a Postgres object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## Postgres Spec
As with all other Kubernetes objects, a Postgres needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example Postgres object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: p1
  namespace: demo
spec:
  version: 9.6.5
  replicas: 2
  standby: hot
  archiver:
    storage:
      storageSecretName: s3-secret
      s3:
        bucket: kubedb
  databaseSecret:
    secretName: p1-auth
  storage:
    storageClassName: standard
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  nodeSelector:
    disktype: ssd
  init:
    scriptSource:
      gitRepo:
        directory: "."
        repository: "https://github.com/kubedb/postgres-init-scripts.git"
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: snap-secret
    gcs:
      bucket: kubedb
      prefix: demo
  doNotPause: true
  monitor:
    agent: coreos-prometheus-operator
    prometheus:
      namespace: demo
      labels:
        app: kubedb
      interval: 10s
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### spec.version
`spec.version` is a required field specifying the version of PostgreSQL database. Currently the supported versions are:
 - `9.5`
 - `9.6.5`

### spec.replicas
`spec.replicas` specifies the total number of primary and standby nodes in Postgres database cluster configuration. One pod is selected as Primary and others are acted as standby replicas.

### spec.standby
`spec.standby` is an optional field that specifies standby mode (_warm/hot_) supported by Postgres. **Hot standby** can run read-only queries where **Warm standby** can't accept connect and only used for replication purpose.

### spec.archiver
`spec.archiver` is an optional field which specifies storage information that will be used by `wal-g`.

 - `spec.archiver.storage.storageSecretName` points to the Secret containing the credentials for cloud storage destination.
 - `spec.archiver.storage.s3.bucket` points to the bucket name used to store continuous archiving data.

Continuous archiving data will be stored in a folder called `{bucket}/kubedb/{namespace}/{CRD object}/archive/`.

### spec.databaseSecret
`spec.databaseSecret` is an optional field that points to a Secret used to hold credentials for `postgres` superuser. If not set, KubeDB operator creates a new Secret `{Postgres name}-auth` for storing the password for `postgres` superuser for each Postgres object. If you want to use an existing secret, please specify that when creating Postgres using `spec.databaseSecret.secretName`.

This secret contains a `.admin` key with a ini formatted key-value pairs. Example:
```ini
POSTGRES_PASSWORD=vPlT2PzewCaC3XZP
```


### spec.storage
`spec.storage` is an optional field that specifies the StorageClass of PVCs dynamically allocated to store data for the database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests. If no storage spec is given, an `emptyDir` is used.

 - `spec.storage.storageClassName` is the name of the StorageClass used to provision PVCs. PVCs don’t necessarily have to request a class. A PVC with its storageClassName set equal to "" is always interpreted to be requesting a PV with no class, so it can only be bound to PVs with no class (no annotation or one set equal to ""). A PVC with no storageClassName is not quite the same and is treated differently by the cluster depending on whether the DefaultStorageClass admission plugin is turned on.

 - `spec.storage.accessModes` uses the same conventions as Kubernetes PVCs when requesting storage with specific access modes.

 - `spec.storage.resources` can be used to request specific quantities of storage. This follows the same resource model used by PVCs.

To learn how to configure `spec.storage`, please visit the links below:
 - https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims


### spec.databaseSecret
`spec.databaseSecret` is an optional field that points to a Secret used to hold credentials for `postgres` super user. If not set, KubeDB operator creates a new Secret `{postgres-object-name}-admin-auth` for storing the password for `postgres` superuser for each Postgres object. If you want to use an existing secret please specify that when creating the Postgres object using `spec.databaseSecret.secretName`.

This secret contains a `.admin` key with a ini formatted key-value pairs. Example:
```ini
POSTGRES_PASSWORD=vPlT2PzewCaC3XZP
```


### spec.nodeSelector
`spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .


### spec.init
`spec.init` is an optional section that can be used to initialize a newly created Postgres database. PostgreSQL databases can be initialized in one of three ways:

#### Initialize via Script
To initialize a PostgreSQL database using a script (shell script, db migrator, etc.), set the `spec.init.scriptSource` section when creating a Postgres object. ScriptSource must have following information:

 - [VolumeSource](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes): Where your script is loaded from.

Below is an example showing how a script from a git repository can be used to initialize a PostgreSQL database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: postgres-db
spec:
  version: 9.6.5
  init:
    scriptSource:
      gitRepo:
        directory: "."
        repository: "https://github.com/kubedb/postgres-init-scripts.git"
```

In the above example, Postgres will execute provided script once database is running. `directory: .` is used to get repository contents directly in mount path.


#### Initialize from Snapshots
To initialize from prior Snapshot, set the `spec.init.snapshotSource` section when creating a Postgres object. In this case, SnapshotSource must have following information:

 - `name:` Name of the Snapshot
 - `namespace:` Namespace of the Snapshot

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: postgres-db
spec:
  version: 9.6.5
  databaseSecret:
    secretName: postgres-old-auth
  init:
    snapshotSource:
      name: "snapshot-xyz"
      namespace: "demo"
```

In the above example, PostgreSQL database will be initialized from Snapshot `snapshot-xyz` in `default` namespace. Here, KubeDB operator will launch a Job to initialize PostgreSQL once StatefulSet pods are running.

When initializing from Snapshot, superuser `postgres` must have to match with previous one. For example, lets say, Snapshot `snapshot-xyz` is for Postgres `postgres-old`. In this case, new Postgres `postgres-db` should use same credential for superuser of `postgres-old`. Otherwise, restoration process will be failed.


#### Initialize from WAL archive
To initialize from WAL archive, set the `spec.init.postgresWAL` section when creating a Postgres object.

Below is an example showing how to initialize a PostgreSQL database from WAL archive.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: postgres-db
spec:
  version: 9.6.5
  databaseSecret:
    secretName: postgres-old
  init:
    postgresWAL:
      storageSecretName: s3-secret
      s3:
        endpoint: 's3.amazonaws.com'
        bucket: kubedb
        prefix: 'kubedb/demo/old-pg/archive'
```

In the above example, PostgreSQL database will be initialized from WAL archive.

When initializing from WAL archive, superuser `postgres` must have to match with previous one. For example, lets say, we want to initialize this database from `postgres-old` WAL archive. In this case, superuser of new Postgres should use same password as `postgres-old`. Otherwise, restoration process will be failed.


### spec.backupSchedule
KubeDB supports taking periodic snapshots for Postgres database. This is an optional section in `.spec`. When `spec.backupSchedule` section is added, KubeDB operator immediately takes a backup to validate this information. After that, at each tick kubeDB operator creates a [Snapshot](/docs/0.8.0-beta.0/concepts/snapshot) object. This triggers operator to create a Job to take backup. If used, set the various sub-fields accordingly.

 - `spec.backupSchedule.cronExpression` is a required [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26). This specifies the schedule for backup operations.

 - `spec.backupSchedule.{storage}` is a required field that is used as the destination for storing snapshot data. KubeDB supports cloud storage providers like S3, GCS, Azure and OpenStack Swift. It also supports any locally mounted Kubernetes volumes, like NFS, Ceph , etc. Only one backend can be used at a time. To learn how to configure this, please visit [here](/docs/0.8.0-beta.0/concepts/snapshot).

 - `spec.backupSchedule.resources` is an optional field that can request compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


### spec.doNotPause
`spec.doNotPause` is an optional field that tells KubeDB operator that if this Postgres object is deleted, whether it should be reverted automatically. This should be set to `true` for production databases to avoid accidental deletion. If not set or set to false, deleting a Postgres object put the database into a dormant state. THe StatefulSet for a DormantDatabase is deleted but the underlying PVCs are left intact. This allows user to resume the database later.


### spec.monitor
To learn how to monitor Postgres databases, please visit [here](/docs/0.8.0-beta.0/concepts/monitoring).


### spec.resources
`spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


## Next Steps
- Learn how to use KubeDB to run a PostgreSQL database [here](/docs/0.8.0-beta.0/guides/postgres/overview).
- See the list of supported storage providers for snapshots [here](/docs/0.8.0-beta.0/concepts/snapshot).
- Thinking about monitoring your database? KubeDB works [out-of-the-box with Prometheus](/docs/0.8.0-beta.0/guides/monitoring).
- Learn how to use KubeDB in a [RBAC](/docs/0.8.0-beta.0/guides/rbac) enabled cluster.
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.0/CONTRIBUTING).
