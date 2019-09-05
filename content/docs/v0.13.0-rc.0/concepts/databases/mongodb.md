---
title: MongoDB
menu:
  docs_v0.13.0-rc.0:
    identifier: mongodb-db
    name: MongoDB
    parent: databases
    weight: 20
menu_name: docs_v0.13.0-rc.0
section_menu_id: concepts
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).

# MongoDB

## What is MongoDB

`MongoDB` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [MongoDB](https://www.mongodb.com/) in a Kubernetes native way. You only need to describe the desired database configuration in a MongoDB object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## MongoDB Spec

As with all other Kubernetes objects, a MongoDB needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example MongoDB object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo1
  namespace: demo
spec:
  version: "3.4-v3"
  replicas: 3
  databaseSecret:
    secretName: mgo1-auth
  certificateSecret:
    secretName: mongodb-demo-cert
  replicaSet:
    name: rs0
  shardTopology:
    configServer:
      podTemplate: {}
      replicas: 3
      storage:
        dataSource: null
        resources:
          requests:
            storage: 1Gi
        storageClassName: standard
    mongos:
      podTemplate: {}
      replicas: 2
      strategy:
        type: RollingUpdate
    shard:
      podTemplate: {}
      replicas: 3
      shards: 3
      storage:
        dataSource: null
        resources:
          requests:
            storage: 1Gi
        storageClassName: standard
  sslMode: preferSSL
  clusterAuthMode: x509
  storageType: "Durable"
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  init:
    scriptSource:
      configMap:
        name: mg-init-script
  backupSchedule:
    cronExpression: "@every 2m"
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb-qa
      prefix: demo
  monitor:
    agent: prometheus.io/coreos-operator
    prometheus:
      namespace: demo
      labels:
        app: kubedb
      interval: 10s
  configSource:
    configMap:
      name: mg-custom-config
  podTemplate:
    annotations:
      passMe: ToDatabasePod
    controller:
      annotations:
        passMe: ToStatefulSet
    spec:
      serviceAccountName: my-service-account
      schedulerName: my-scheduler
      nodeSelector:
        disktype: ssd
      imagePullSecrets:
        - name: myregistrykey
      args:
        - --maxConns=100
      env:
        - name: MONGO_INITDB_DATABASE
          value: myDB
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
  serviceTemplate:
    annotations:
      passMe: ToService
    spec:
      type: NodePort
      ports:
        - name: http
          port: 9200
          targetPort: http
  terminationPolicy: Pause
  updateStrategy:
    type: RollingUpdate
```

### spec.version

`spec.version` is a required field specifying the name of the [MongoDBVersion](/docs/v0.13.0-rc.0/concepts/catalog/mongodb) crd where the docker images are specified. Currently, when you install KubeDB, it creates the following `MongoDBVersion` crds,

- `3.4-v4`, `3.4-v3`, `3.4-v2`, `3.4-v1`, `3.4`
- `3.6-v4`, `3.6-v3`, `3.6-v2`, `3.6-v1`, `3.6`
- `4.0.5-v2`, `4.0.5-v1`, `4.0-v1`, `4.0.5`, `4.0`
- `4.1.7-v2`, `4.1.7-v1`, `4.1.7`

### spec.replicas

`spec.replicas` the number of members in `rs0` mongodb replicaset.

If `spec.shardTopology` is set, then `spec.replicas` needs to be empty. Instead use `spec.shardTopology.<shard/configServer>.replicas`

If both `spec.replicaset` and `spec.shardTopology` is not set, then `spec.replicas` can be value `1`.

KubeDB uses Pod Disruption Budget to ensure that majority of these replicas are available during [voluntary disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions) so that quorum is maintained.

### spec.databaseSecret

`spec.databaseSecret` is an optional field that points to a Secret used to hold credentials for `mongodb` superuser. If not set, KubeDB operator creates a new Secret `{mongodb-object-name}-auth` for storing the password for `mongodb` superuser for each MongoDB object. If you want to use an existing secret please specify that when creating the MongoDB object using `spec.databaseSecret.secretName`.

This secret contains a `user` key and a `password` key which contains the `username` and `password` respectively for `mongodb` superuser.

Example:

```console
$ kubectl create secret generic mgo1-auth -n demo \
--from-literal=username=jhon-doe \
--from-literal=password=6q8u_2jMOW-OOZXk
secret "mgo1-auth" created
```

```yaml
apiVersion: v1
data:
  password: NnE4dV8yak1PVy1PT1pYaw==
  username: amhvbi1kb2U=
kind: Secret
metadata:
  ...
  name: mgo1-auth
  namespace: demo
  ...
type: Opaque
```
Secrets provided by users are not managed by KubeDB, and therefore, won't be modified or garbage collected by the KubeDB operator (version 0.13.0 and higher).

### spec.certificateSecret

`spec.certificateSecret` (optional) is a secret name that contains keyfile (a random string) against `key.txt` key. Each mongod instance in the replica set and `shardTopology` uses the contents of the keyfile as the shared password for authenticating other members in the `replicaset`. Only `mongod` instances with the correct keyfile can join the replica set. _User can provide the `certificateSecret` by creating a secret with key `key.txt`. See [here](https://docs.mongodb.com/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/#create-a-keyfile) to create the string for `certificateSecret`._ If `certificateSecret` is not given, KubeDB operator will generate a `certificateSecret` itself.

Since, KubeDB v0.13.0 release, if the mongodb is either of ReplicaSet or Sharding, or if the `sslMode` is anything other than `disabled`,then `certificateSecret` will contain some required tls certificates including `ca.cert`, `ca.key`, `client.pem`.

Here, `ca.key` & `ca.cert` represents Certificate Authority (CA) Key and Certificate respectively.

KubeDB also creates a `client.pem` certificate for `certificateSecret`. The `subject` of `client.pem` certificate is added as `root` user in `$external` database. So, user can use this client certificate for `MONGODB-X509` `authenticationMechanism`.

To generate the `certificateSecret` Manually,

1. Generate key file first

  ```bash
  openssl rand -base64 756 > key.txt
  ```

2. Generate `ca.key` and `ca.cert`

  ```bash
  openssl genrsa -out ca.key 2048
  openssl req -x509 -new -nodes -key ca.key -days 1024 -out ca.cert -subj "/CN=ca"
  ```

3. Create Secret

  ```bash
  kubectl create secret generic mongodb-demo-cert -n demo \
      --from-file=./key.txt \
      --from-file=./ca.key \
      --from-file=./ca.cert
  ```

Now, use this secret `mongodb-demo-cert` in field `spec.certificateSecret.name`.

### spec.replicaSet

`spec.replicaSet` represents the configuration for replicaset. When `spec.replicaSet` is set, KubeDB will deploy a mongodb replicaset where number of replicaset member is spec.replicas.

- `name` denotes the name of mongodb replicaset.

- `keyFileSecret` is deprecated now. Use `spec.certificateSecret` instead. For existing MongoDB instances, KubeDB operator will handle the migration by itself. `keyFileSecret` field will be removed in future.

NB. If `spec.shardTopology` is set, then `spec.replicaset` needs to be empty.

### spec.shardTopology

`spec.shardTopology` represents the topology configuration for sharding.

Available configurable fields:

- shard
- configServer
- mongos

When `spec.shardTopology` is set, the following fields needs to be empty, otherwise validating webhook will throw error.

- `spec.replicas`
- `spec.podTemplate`
- `spec.configSource`
- `spec.storage`

KubeDB uses Pod Disruption Budget to ensure that majority of the replicas of these shard components are available during [voluntary disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions) so that quorum and data integrity is maintained.
#### spec.shardTopology.shard

`shard` represents configuration for Shard component of mongodb.

Available configurable fields:

- `shards` represents number of shards for a mongodb deployment. Each shard is deployed as a [replicaset](/docs/v0.13.0-rc.0/guides/mongodb/clustering/replication_concept).
- `replicas` represents number of replicas of each shard replicaset.
- `prefix` represents the prefix of each shard node.
- `configSource` is an optional field to provide custom configuration file for shards (i.e mongod.cnf). If specified, this file will be used as configuration file otherwise a default configuration file will be used. See below to know about [spec.configSource](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-configsource) in details.
- `podTemplate` is an optional configuration for pods. See below to know about [spec.podTemplate](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-podtemplate) in details.
- `storage` to specify pvc spec for each node of sharding. You can specify any StorageClass available in your cluster with appropriate resource requests. See below to know about [spec.podTemplate](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-storage) in details.

#### spec.shardTopology.configServer

`configServer` represents configuration for ConfigServer component of mongodb.

Available configurable fields:

- `replicas` represents number of replicas for configServer replicaset. Here, configServer is deployed as a replicaset of mongodb.
- `prefix` represents the prefix of configServer nodes.
- `configSource` is an optional field to provide custom configuration file for configSource (i.e mongod.cnf). If specified, this file will be used as configuration file otherwise a default configuration file will be used. See below to know about [spec.configSource](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-configsource) in details.
- `podTemplate` is an optional configuration for pods. See below to know about [spec.podTemplate](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-podtemplate) in details.
- `storage` to specify pvc spec for each node of configServer. You can specify any StorageClass available in your cluster with appropriate resource requests. See below to know about [spec.podTemplate](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-storage) in details.

#### spec.shardTopology.mongos

`mongos` represents configuration for Mongos component of mongodb.

Available configurable fields:

- `replicas` represents number of replicas of `Mongos` instance. Here, Mongos is deployed as stateless (deployment) instance.
- `prefix` represents the prefix of mongos nodes.
- `configSource` is an optional field to provide custom configuration file for mongos (i.e mongod.cnf). If specified, this file will be used as configuration file otherwise a default configuration file will be used. See below to know about [spec.configSource](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-configsource) in details.
- `podTemplate` is an optional configuration for pods. See below to know about [spec.podTemplate](/docs/v0.13.0-rc.0/concepts/databases/mongodb/#spec-podtemplate) in details.
- `strategy` is the deployment strategy to use to replace existing pods with new ones. This is optional. If not provided, kubernetes will use default deploymentStrategy, ie. `RollingUpdate`. See more about [Deployment Strategy](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy).

### spec.sslMode

Enables TLS/SSL or mixed TLS/SSL used for all network connections. The value of [`sslMode`](https://docs.mongodb.com/manual/reference/program/mongod/#cmdoption-mongod-sslmode) field can be one of the following:

|    Value     | Description                                                  |
| :----------: | :----------------------------------------------------------- |
|  `disabled`  | The server does not use TLS/SSL.                             |
|  `allowSSL`  | Connections between servers do not use TLS/SSL. For incoming connections, the server accepts both TLS/SSL and non-TLS/non-SSL. |
| `preferSSL`  | Connections between servers use TLS/SSL. For incoming connections, the server accepts both TLS/SSL and non-TLS/non-SSL. |
| `requireSSL` | The server uses and accepts only TLS/SSL encrypted connections. |

### spec.clusterAuthMode

The authentication mode used for cluster authentication. This option can have one of the following values:

|     Value     | Description                                                  |
| :-----------: | :----------------------------------------------------------- |
|   `keyFile`   | Use a keyfile for authentication. Accept only keyfiles.      |
| `sendKeyFile` | For rolling upgrade purposes. Send a keyfile for authentication but can accept both keyfiles and x.509 certificates. |
|  `sendX509`   | For rolling upgrade purposes. Send the x.509 certificate for authentication but can accept both keyfiles and x.509 certificates. |
|    `x509`     | Recommended. Send the x.509 certificate for authentication and accept only x.509 certificates. |

### spec.storageType

`spec.storageType` is an optional field that specifies the type of storage to use for database. It can be either `Durable` or `Ephemeral`. The default value of this field is `Durable`. If `Ephemeral` is used then KubeDB will create MongoDB database using [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) volume. In this case, you don't have to specify `spec.storage` field.

### spec.storage

Since 0.9.0-rc.0, If you set `spec.storageType:` to `Durable`, then `spec.storage` is a required field that specifies the StorageClass of PVCs dynamically allocated to store data for the database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests.

- `spec.storage.storageClassName` is the name of the StorageClass used to provision PVCs. PVCs don’t necessarily have to request a class. A PVC with its storageClassName set equal to "" is always interpreted to be requesting a PV with no class, so it can only be bound to PVs with no class (no annotation or one set equal to ""). A PVC with no storageClassName is not quite the same and is treated differently by the cluster depending on whether the DefaultStorageClass admission plugin is turned on.
- `spec.storage.accessModes` uses the same conventions as Kubernetes PVCs when requesting storage with specific access modes.
- `spec.storage.resources` can be used to request specific quantities of storage. This follows the same resource model used by PVCs.

To learn how to configure `spec.storage`, please visit the links below:

- https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims

NB. If `spec.shardTopology` is set, then `spec.storage` needs to be empty. Instead use `spec.shardTopology.<shard/configServer>.storage`

### spec.init

`spec.init` is an optional section that can be used to initialize a newly created MongoDB database. MongoDB databases can be initialized in one of two ways:

1. Initialize from Script
2. Initialize from Snapshot

#### Initialize via Script

To initialize a MongoDB database using a script (shell script, js script), set the `spec.init.scriptSource` section when creating a MongoDB object. It will execute files alphabetically with extensions `.sh` and `.js` that are found in the repository. ScriptSource must have following information:

- [VolumeSource](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes): Where your script is loaded from.

Below is an example showing how a script from a configMap can be used to initialize a MongoDB database.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo1
spec:
  version: 3.4-v2
  init:
    scriptSource:
      configMap:
        name: mongodb-init-script
```

In the above example, KubeDB operator will launch a Job to execute all js script of `mongodb-init-script` in alphabetical order once StatefulSet pods are running. For more details tutorial on how to initialize from script, please visit [here](/docs/v0.13.0-rc.0/guides/mongodb/initialization/script_source).

#### Initialize from Snapshots

To initialize from prior snapshots, set the `spec.init.snapshotSource` section when creating a MongoDB object. In this case, SnapshotSource must have following information:

- `name:` Name of the Snapshot
- `namespace:` Namespace of the Snapshot

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo1
spec:
  version: 3.4-v2
  init:
    snapshotSource:
      name: "snapshot-xyz"
      namespace: "demo"
```

In the above example, MongoDB database will be initialized from Snapshot `snapshot-xyz` in `demo` namespace. Here, KubeDB operator will launch a Job to initialize MongoDB once StatefulSet pods are running.

For more details tutorial on how to initialize from snapshot, please visit [here](/docs/v0.13.0-rc.0/guides/mongodb/initialization/snapshot_source).

### spec.backupSchedule

KubeDB supports taking periodic snapshots for MongoDB database. This is an optional section in `.spec`. When `spec.backupSchedule` section is added, KubeDB operator immediately takes a backup to validate this information. After that, at each tick KubeDB operator creates a [Snapshot](/docs/v0.13.0-rc.0/concepts/snapshot) object. This triggers operator to create a Job to take backup. If used, set the various sub-fields accordingly.

- `spec.backupSchedule.cronExpression` is a required [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26). This specifies the schedule for backup operations.
- `spec.backupSchedule.{storage}` is a required field that is used as the destination for storing snapshot data. KubeDB supports cloud storage providers like S3, GCS, Azure and OpenStack Swift. It also supports any locally mounted Kubernetes volumes, like NFS, Ceph, etc. Only one backend can be used at a time. To learn how to configure this, please visit [here](/docs/v0.13.0-rc.0/concepts/snapshot).

You can also specify a template for pod of backup job through `spec.backupSchedule.podTemplate`. KubeDB will use the information you have provided in `podTemplate` to create the backup job. KubeDB accept following fields to set in `spec.backupSchedule.podTemplate`:

- metadata:
  - annotations (pod's annotation)
- controller:
  - annotations (job's annotation)
- spec:
  - args
  - env
  - resources
  - imagePullSecrets
  - initContainers
  - nodeSelector
  - affinity
  - schedulerName
  - tolerations
  - priorityClassName
  - priority
  - securityContext
  - livenessProbe
  - readinessProbe
  - lifecycle

### spec.monitor

MongoDB managed by KubeDB can be monitored with builtin-Prometheus and CoreOS-Prometheus operator out-of-the-box. To learn more,

- [Monitor MongoDB with builtin Prometheus](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-builtin-prometheus)
- [Monitor MongoDB with CoreOS Prometheus operator](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-coreos-prometheus-operator)

### spec.configSource

`spec.configSource` is an optional field that allows users to provide custom configuration for MongoDB. This field accepts a [`VolumeSource`](https://github.com/kubernetes/api/blob/release-1.11/core/v1/types.go#L47). You can use any kubernetes supported volume source such as `configMap`, `secret`, `azureDisk` etc.

> Please note that, the configfile name needs to be `mongod.conf` for mongodb.

To learn more about how to use a custom configuration file see [here](/docs/v0.13.0-rc.0/guides/mongodb/custom-config/using-custom-config).

NB. If `spec.shardTopology` is set, then `spec.configsource` needs to be empty. Instead use `spec.shardTopology.<shard/configServer/mongos>.configSource`

### spec.podTemplate

KubeDB allows providing a template for database pod through `spec.podTemplate`. KubeDB operator will pass the information provided in `spec.podTemplate` to the StatefulSet created for MongoDB database.

KubeDB accept following fields to set in `spec.podTemplate:`

- metadata:
  - annotations (pod's annotation)
- controller:
  - annotations (statefulset's annotation)
- spec:
  - args
  - env
  - resources
  - initContainers
  - imagePullSecrets
  - nodeSelector
  - affinity
  - serviceAccountName
  - schedulerName
  - tolerations
  - priorityClassName
  - priority
  - securityContext
  - livenessProbe
  - readinessProbe
  - lifecycle

Uses of some field of `spec.podTemplate` is described below,

NB. If `spec.shardTopology` is set, then `spec.podTemplate` needs to be empty. Instead use `spec.shardTopology.<shard/configServer/mongos>.podTemplate`

#### spec.podTemplate.spec.args

`spec.podTemplate.spec.args` is an optional field. This can be used to provide additional arguments to database installation. To learn about available args of `mongod`, visit [here](https://docs.mongodb.com/manual/reference/program/mongod/).

#### spec.podTemplate.spec.env

`spec.podTemplate.spec.env` is an optional field that specifies the environment variables to pass to the MongoDB docker image. To know about supported environment variables, please visit [here](https://hub.docker.com/r/_/mongo/).

Note that, KubeDB does not allow `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD` environment variables to set in `spec.podTemplate.spec.env`. If you want to use custom superuser and password, please use `spec.databaseSecret` instead described earlier.

If you try to set `MONGO_INITDB_ROOT_USERNAME` or `MONGO_INITDB_ROOT_PASSWORD` environment variable in MongoDB crd, Kubed operator will reject the request with following error,

```ini
Error from server (Forbidden): error when creating "./mongodb.yaml": admission webhook "mongodb.validators.kubedb.com" denied the request: environment variable MONGO_INITDB_ROOT_USERNAME is forbidden to use in MongoDB spec
```

Also, note that KubeDB does not allow updating the environment variables as updating them does not have any effect once the database is created. If you try to update environment variables, KubeDB operator will reject the request with following error,

```ini
Error from server (BadRequest): error when applying patch:
...
for: "./mongodb.yaml": admission webhook "mongodb.validators.kubedb.com" denied the request: precondition failed for:
...At least one of the following was changed:
    apiVersion
    kind
    name
    namespace
    spec.ReplicaSet
    spec.databaseSecret
    spec.init
    spec.storageType
    spec.storage
    spec.podTemplate.spec.nodeSelector
    spec.podTemplate.spec.env
```

#### spec.podTemplate.spec.imagePullSecret

`KubeDB` provides the flexibility of deploying MongoDB database from a private Docker registry. `spec.podTemplate.spec.imagePullSecrets` is an optional field that points to secrets to be used for pulling docker image if you are using a private docker registry. To learn how to deploy MongoDB from a private registry, please visit [here](/docs/v0.13.0-rc.0/guides/mongodb/private-registry/using-private-registry).

#### spec.podTemplate.spec.nodeSelector

`spec.podTemplate.spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .

#### spec.podTemplate.spec.serviceAccountName

  `serviceAccountName` is an optional field supported by KubeDB Operator (version 0.13.0 and higher) that can be used to specify a custom service account to fine tune role based access control.

  If this field is left empty, the KubeDB operator will create a service account name matching MongoDB crd name. Role and RoleBinding that provide necessary access permissions will also be generated automatically for this service account.

  If a service account name is given, but there's no existing service account by that name, the KubeDB operator will create one, and Role and RoleBinding that provide necessary access permissions will also be generated for this service account.

  If a service account name is given, and there's an existing service account by that name, the KubeDB operator will use that existing service account. Since this service account is not managed by KubeDB, users are responsible for providing necessary access permissions manually. Follow the guide [here](/docs/v0.13.0-rc.0/guides/mongodb/custom-rbac/using-custom-rbac) to grant necessary permissions in this scenario.

#### spec.podTemplate.spec.resources

`spec.podTemplate.spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).

### spec.serviceTemplate

You can also provide a template for the services created by KubeDB operator for MongoDB database through `spec.serviceTemplate`. This will allow you to set the type and other properties of the services.

KubeDB allows following fields to set in `spec.serviceTemplate`:

- metadata:
  - annotations
- spec:
  - type
  - ports
  - clusterIP
  - externalIPs
  - loadBalancerIP
  - loadBalancerSourceRanges
  - externalTrafficPolicy
  - healthCheckNodePort

### spec.updateStrategy

You can specify [update strategy](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#update-strategies) of StatefulSet created by KubeDB for MongoDB database thorough `spec.updateStrategy` field. The default value of this field is `RollingUpdate`. In future, we will use this field to determine how automatic migration from old KubeDB version to new one should behave.

### spec.terminationPolicy

`terminationPolicy` gives flexibility whether to `nullify`(reject) the delete operation of `MongoDB` crd or which resources KubeDB should keep or delete when you delete `MongoDB` crd. KubeDB provides following four termination policies:

- DoNotTerminate
- Pause (`Default`)
- Delete
- WipeOut

When, `terminationPolicy` is `DoNotTerminate`, KubeDB takes advantage of `ValidationWebhook` feature in Kubernetes 1.9.0 or later clusters to implement `DoNotTerminate` feature. If admission webhook is enabled, `DoNotTerminate` prevents users from deleting the database as long as the `spec.terminationPolicy` is set to `DoNotTerminate`.

Following table show what KubeDB does when you delete MongoDB crd for different termination policies,

| Behavior                            | DoNotTerminate |  Pause   |  Delete  | WipeOut  |
| ----------------------------------- | :------------: | :------: | :------: | :------: |
| 1. Block Delete operation           |    &#10003;    | &#10007; | &#10007; | &#10007; |
| 2. Create Dormant Database          |    &#10007;    | &#10003; | &#10007; | &#10007; |
| 3. Delete StatefulSet               |    &#10007;    | &#10003; | &#10003; | &#10003; |
| 4. Delete Services                  |    &#10007;    | &#10003; | &#10003; | &#10003; |
| 5. Delete PVCs                      |    &#10007;    | &#10007; | &#10003; | &#10003; |
| 6. Delete Secrets                   |    &#10007;    | &#10007; | &#10007; | &#10003; |
| 7. Delete Snapshots                 |    &#10007;    | &#10007; | &#10007; | &#10003; |
| 8. Delete Snapshot data from bucket |    &#10007;    | &#10007; | &#10007; | &#10003; |

If you don't specify `spec.terminationPolicy` KubeDB uses `Pause` termination policy by default.

## Next Steps

- Learn how to use KubeDB to run a MongoDB database [here](/docs/v0.13.0-rc.0/guides/mongodb/README).
- See the list of supported storage providers for snapshots [here](/docs/v0.13.0-rc.0/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).
