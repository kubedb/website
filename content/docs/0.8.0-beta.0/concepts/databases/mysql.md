---
title: MySQL
menu:
  docs_0.8.0-beta.0:
    identifier: mysql-db
    name: MySQL
    parent: databases
    weight: 25
menu_name: docs_0.8.0-beta.0
section_menu_id: concepts
info:
  version: 0.8.0-beta.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.0/guides/README).

# MySQL

## What is MySQL
A `MySQL` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [MySQL](https://www.mysql.com/) in a Kubernetes native way. You only need to describe the desired database configuration in a MySQL object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## MySQL Spec
As with all other Kubernetes objects, a MySQL needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example MySQL object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MySQL
metadata:
  name: m1
  namespace: demo
spec:
  version: 8.0
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  databaseSecret:
    secretName: m1-admin-auth
  nodeSelector:
    disktype: ssd
  init:
    scriptSource:
      gitRepo:
        repository: "https://github.com/kubedb/mysql-init-scripts.git"
        directory: .
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: ms-snap-secret
    gcs:
      bucket: restic
      prefix: demo
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
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
`spec.version` is a required field specifying the version of MySQL database. Official [mysql docker images](https://hub.docker.com/r/library/mysql/tags/) will be used for the specific version.


### spec.storage
`spec.storage` is an optional field that specifies the StorageClass of PVCs dynamically allocated to store data for the database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests. If no storage spec is given, an `emptyDir` is used.

 - `spec.storage.storageClassName` is the name of the StorageClass used to provision PVCs. PVCs don’t necessarily have to request a class. A PVC with its storageClassName set equal to "" is always interpreted to be requesting a PV with no class, so it can only be bound to PVs with no class (no annotation or one set equal to ""). A PVC with no storageClassName is not quite the same and is treated differently by the cluster depending on whether the DefaultStorageClass admission plugin is turned on.

 - `spec.storage.accessModes` uses the same conventions as Kubernetes PVCs when requesting storage with specific access modes.

 - `spec.storage.resources` can be used to request specific quantities of storage. This follows the same resource model used by PVCs.

To learn how to configure `spec.storage`, please visit the links below:
 - https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims


### spec.databaseSecret
`spec.databaseSecret` is an optional field that points to a Secret used to hold credentials for `mysql` super user. If not set, KubeDB operator creates a new Secret `{mysql-object-name}-admin-auth` for storing the password for `mysql` superuser for each MySQL object. If you want to use an existing secret please specify that when creating the MySQL object using `spec.databaseSecret.secretName`.

This secret contains a `.admin` key with a ini formatted key-value pairs. Example:
```ini
vPlT2PzewCaC3XZP
```


### spec.nodeSelector
`spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .


### spec.init
`spec.init` is an optional section that can be used to initialize a newly created MySQL database. MySQL databases can be initialized in one of two ways:

#### Initialize via Script
To initialize a MySQL database using a script (shell script, sql script etc.), set the `spec.init.scriptSource` section when creating a MySQL object. It will execute files alphabetically with extensions `.sh` , `.sql`  and `.sql.gz` that are found in the repository. ScriptSource must have following information:

 - [VolumeSource](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes): Where your script is loaded from.

Below is an example showing how a shell script from a git repository can be used to initialize a MySQL database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MySQL
metadata:
  name: m1
spec:
  version: 8.0
  init:
    scriptSource:
      gitRepo:
        repository: "https://github.com/kubedb/mysql-init-scripts.git"
        directory: .
```

In the above example, KubeDB operator will launch a Job to execute all sql script of `mysql-init-script` repo in alphabetical  order once StatefulSet pods are running.


#### Initialize from Snapshots
To initialize from prior snapshots, set the `spec.init.snapshotSource` section when creating a MySQL object. In this case, SnapshotSource must have following information:

 - `name:` Name of the Snapshot

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MySQL
metadata:
  name: m1
spec:
  version: 8.0
  init:
    snapshotSource:
      name: "snapshot-xyz"
```

In the above example, MySQL database will be initialized from Snapshot `snapshot-xyz` in `default` namespace. Here, KubeDB operator will launch a Job to initialize MySQL once StatefulSet pods are running.

### spec.backupSchedule
KubeDB supports taking periodic snapshots for MySQL database. This is an optional section in `.spec`. When `spec.backupSchedule` section is added, KubeDB operator immediately takes a backup to validate this information. After that, at each tick kubeDB operator creates a [Snapshot](/docs/0.8.0-beta.0/concepts/snapshot) object. This triggers operator to create a Job to take backup. If used, set the various sub-fields accordingly.

 - `spec.backupSchedule.cronExpression` is a required [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26). This specifies the schedule for backup operations.

 - `spec.backupSchedule.{storage}` is a required field that is used as the destination for storing snapshot data. KubeDB supports cloud storage providers like S3, GCS, Azure and OpenStack Swift. It also supports any locally mounted Kubernetes volumes, like NFS, Ceph , etc. Only one backend can be used at a time. To learn how to configure this, please visit [here](/docs/0.8.0-beta.0/concepts/snapshot).

 - `spec.backupSchedule.resources` is an optional field that can request compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


### spec.doNotPause
`spec.doNotPause` is an optional field that tells KubeDB operator that if this MySQL object is deleted, whether it should be reverted automatically. This should be set to `true` for production databases to avoid accidental deletion. If not set or set to false, deleting a MySQL object put the database into a dormant state. THe StatefulSet for a DormantDatabase is deleted but the underlying PVCs are left intact. This allows user to resume the database later.


### spec.monitor
To learn how to monitor MySQL databases, please visit [here](/docs/0.8.0-beta.0/concepts/monitoring).


### spec.resources
`spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


## Next Steps
- Learn how to use KubeDB to run a MySQL database [here](/docs/0.8.0-beta.0/guides/mysql/overview).
- See the list of supported storage providers for snapshots [here](/docs/0.8.0-beta.0/concepts/snapshot).
- Thinking about monitoring your database? KubeDB works [out-of-the-box with Prometheus](/docs/0.8.0-beta.0/guides/monitoring).
- Learn how to use KubeDB in a [RBAC](/docs/0.8.0-beta.0/guides/rbac) enabled cluster.
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.0/CONTRIBUTING).
