---
title: FerretDB Quickstart
menu:
  docs_v2025.2.19:
    identifier: fr-quickstart-quickstart
    name: Overview
    parent: fr-quickstart-ferretdb
    weight: 10
menu_name: docs_v2025.2.19
section_menu_id: guides
info:
  autoscaler: v0.37.0
  cli: v0.52.0
  dashboard: v0.28.0
  installer: v2025.2.19
  ops-manager: v0.39.0
  provisioner: v0.52.0
  schema-manager: v0.28.0
  ui-server: v0.28.0
  version: v2025.2.19
  webhook-server: v0.28.0
---

> New to KubeDB? Please start [here](/docs/v2025.2.19/README).

# FerretDB QuickStart

This tutorial will show you how to use KubeDB to run a FerretDB database.

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.2.19/images/ferretdb/quick-start.png">
</p>

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) is required to run KubeDB. Check the available StorageClass in cluster.

  ```bash
  $ kubectl get storageclasses
  NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  2m5s

  ```

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: The yaml files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/mongodb) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Find Available FerretDBVersion

When you have installed KubeDB, it has created `FerretDBVersion` CR for all supported FerretDB versions.

```bash
$ kubectl get ferretdbversions
NAME     VERSION   DB_IMAGE                                  DEPRECATED   AGE
1.18.0   1.18.0    ghcr.io/appscode-images/ferretdb:1.18.0   false        7m10s
```

## Create a FerretDB database

FerretDB use Postgres as it's main backend. Currently, KubeDB supports Postgres backend as database engine for FerretDB. Users can use its own Postgres or let KubeDB create and manage backend engine with KubeDB native Postgres. 
KubeDB implements a `FerretDB` CR to define the specification of a FerretDB database.

### Create a FerretDB database with KubeDB managed Postgres

To use KubeDB managed Postgres as backend engine, user need to specify that in `spec.backend.externallyManaged` section of FerretDB CRO yaml. Below is the `FerretDB` object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: FerretDB
metadata:
  name: ferret
  namespace: demo
spec:
  version: "1.18.0"
  authSecret:
    externallyManaged: false
  sslMode: disabled
  storageType: Durable
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 500Mi
  backend:
    externallyManaged: false
  deletionPolicy: WipeOut
```

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/ferredb/quickstart/ferretdb-internal.yaml
ferretdb.kubedb.com/ferret created
```

Here,

- `spec.version` is name of the FerretDBVersion CR where the docker images are specified. In this tutorial, a FerretDB 1.18.0 database is created.
- `spec.storageType` specifies the type of storage that will be used for FerretDB database. It can be `Durable` or `Ephemeral`. Default value of this field is `Durable`. If `Ephemeral` is used then KubeDB will create FerretDB database using `EmptyDir` volume. In this case, you don't have to specify `spec.storage` field. This is useful for testing purposes.
- `spec.storage` specifies PVC spec that will be dynamically allocated to store data for this database. This storage spec will be passed to the PetSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests.
- `spec.deletionPolicy` gives flexibility whether to `nullify`(reject) the delete operation of `FerretDB` CR or which resources KubeDB should keep or delete when you delete `FerretDB` CR. If admission webhook is enabled, It prevents users from deleting the database as long as the `spec.deletionPolicy` is set to `DoNotTerminate`. Learn details of all `DeletionPolicy` [here](/docs/v2025.2.19/guides/mongodb/concepts/mongodb#specdeletionpolicy)
- `spec.backend` denotes the backend database information for FerretDB instance.
- `spec.replicas` denotes the number of replicas in the replica-set.

> Note: `spec.storage` section is used to create PVC for database pod. It will create PVC with storage size specified instorage.resources.requests field. Don't specify limits here. PVC does not get resized automatically.

KubeDB operator watches for `FerretDB` objects using Kubernetes api. When a `FerretDB` object is created, KubeDB operator will create a new PetSet and a Service with the matching FerretDB object name. KubeDB operator will also create a governing service for PetSets with the name `<ferretdb-name>-pods`.

Here `spec.backend.externallyManaged` section is `false`. So backend Postgres database will be managed by internally through KubeDB. 
KubeDB will create a Postgres database alongside with FerretDB for FerretDB's backend engine.

KubeDB operator sets the `status.phase` to Ready once the database is successfully provisioned and ready to use.

```bash
$ kubectl get ferretdb -n demo
NAME     NAMESPACE   VERSION   STATUS   AGE
ferret   demo        1.18.0    Ready    25m

$ kubectl get postgres -n demo
NAME                VERSION   STATUS   AGE
ferret-pg-backend   13.13     Ready    25m
```

Let’s describe FerretDB object ferret

```bash
$ kubectl describe ferretdb ferret -n demo
Name:         ferret
Namespace:    demo
Labels:       <none>
Annotations:  <none>
API Version:  kubedb.com/v1alpha2
Kind:         FerretDB
Metadata:
  Creation Timestamp:  2024-03-12T05:04:34Z
  Finalizers:
    kubedb.com
  Generation:        4
  Resource Version:  4127
  UID:               73247297-139b-4dfe-8f9d-9baf2b092364
Spec:
  Auth Secret:
    Name:  ferret-auth
  Backend:
    Externally Managed:  false
    Linked DB:           ferretdb
    Postgres Ref:
      Name:       ferret-pg-backend
      Namespace:  demo
    Version:      13.13
  Health Checker:
    Failure Threshold:  1
    Period Seconds:     10
    Timeout Seconds:    10
  Pod Template:
    Controller:
    Metadata:
    Spec:
      Containers:
        Name:  ferretdb
        Resources:
          Limits:
            Memory:  1Gi
          Requests:
            Cpu:     500m
            Memory:  1Gi
        Security Context:
          Allow Privilege Escalation:  false
          Capabilities:
            Drop:
              ALL
          Run As Group:     1000
          Run As Non Root:  true
          Run As User:      1000
          Seccomp Profile:
            Type:  RuntimeDefault
      Security Context:
        Fs Group:  1000
  Replicas:        1
  Ssl Mode:        disabled
  Storage:
    Access Modes:
      ReadWriteOnce
    Resources:
      Requests:
        Storage:       500Mi
  Storage Type:        Durable
  Deletion Policy:     WipeOut
  Version:             1.18.0
Status:
  Conditions:
    Last Transition Time:  2024-03-12T05:04:34Z
    Message:               The KubeDB operator has started the provisioning of FerretDB: demo/ferret
    Observed Generation:   3
    Reason:                DatabaseProvisioningStartedSuccessfully
    Status:                True
    Type:                  ProvisioningStarted
    Last Transition Time:  2024-03-12T05:23:58Z
    Message:               All replicas are ready for FerretDB demo/ferret
    Observed Generation:   4
    Reason:                AllReplicasReady
    Status:                True
    Type:                  ReplicaReady
    Last Transition Time:  2024-03-12T05:06:20Z
    Message:               The FerretDB: demo/ferret is accepting client requests.
    Observed Generation:   4
    Reason:                DatabaseAcceptingConnectionRequest
    Status:                True
    Type:                  AcceptingConnection
    Last Transition Time:  2024-03-12T05:06:20Z
    Message:               The FerretDB: demo/ferret is ready.
    Observed Generation:   4
    Reason:                ReadinessCheckSucceeded
    Status:                True
    Type:                  Ready
    Last Transition Time:  2024-03-12T05:06:20Z
    Message:               The FerretDB: demo/ferret is successfully provisioned.
    Observed Generation:   4
    Reason:                DatabaseSuccessfullyProvisioned
    Status:                True
    Type:                  Provisioned
  Phase:                   Ready
```

```bash
$ kubectl get petset -n demo
NAME                        READY   AGE
ferret                      1/1     29m
ferret-pg-backend           2/2     30m
ferret-pg-backend-arbiter   1/1     29m

$ kubectl get appbindings -n demo
NAME                  TYPE                 VERSION   AGE
ferret                kubedb.com/ferret    1.18.0    29m
ferret-pg-backend     kubedb.com/postgres  13.13     30m

$ kubectl get pvc -n demo
NAME                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
data-ferret-pg-backend-0           Bound    pvc-b887a566-2dbd-4377-8752-f31622efbb34   500Mi      RWO            standard       <unset>                 30m
data-ferret-pg-backend-1           Bound    pvc-43de8679-7004-469d-a8a5-37363f81d839   500Mi      RWO            standard       <unset>                 29m
data-ferret-pg-backend-arbiter-0   Bound    pvc-8ab3e7b5-4ecc-4ddd-9a9a-16b4f59f6538   2Gi        RWO            standard       <unset>                 29m

$ kubectl get pv -n demo
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                   STORAGECLASS   VOLUMEATTRIBUTESCLASS   REASON   AGE
pvc-43de8679-7004-469d-a8a5-37363f81d839   500Mi      RWO            Delete           Bound    demo/data-ferret-pg-backend-1           standard       <unset>                          30m
pvc-8ab3e7b5-4ecc-4ddd-9a9a-16b4f59f6538   2Gi        RWO            Delete           Bound    demo/data-ferret-pg-backend-arbiter-0   standard       <unset>                          29m
pvc-b887a566-2dbd-4377-8752-f31622efbb34   500Mi      RWO            Delete           Bound    demo/data-ferret-pg-backend-0           standard       <unset>                          30m

$ kubectl get service -n demo
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ferret                      ClusterIP   10.96.234.250   <none>        27017/TCP                    30m
ferret-pg-backend           ClusterIP   10.96.130.0     <none>        5432/TCP,2379/TCP            30m
ferret-pg-backend-pods      ClusterIP   None            <none>        5432/TCP,2380/TCP,2379/TCP   30m
ferret-pg-backend-standby   ClusterIP   10.96.250.98    <none>        5432/TCP                     30m
```

Run the following command to see the modified FerretDB object:

```yaml
$ kubectl get ferretdb ferret -n demo -oyaml
apiVersion: kubedb.com/v1alpha2
kind: FerretDB
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"kubedb.com/v1alpha2","kind":"FerretDB","metadata":{"annotations":{},"name":"ferret","namespace":"demo"},"spec":{"authSecret":{"externallyManaged":false},"backend":{"externallyManaged":false},"sslMode":"disabled","storage":{"accessModes":["ReadWriteOnce"],"resources":{"requests":{"storage":"500Mi"}}},"deletionPolicy":"WipeOut","version":"1.18.0"}}
  creationTimestamp: "2024-03-12T05:04:34Z"
  finalizers:
    - kubedb.com
  generation: 4
  name: ferret
  namespace: demo
  resourceVersion: "5030"
  uid: 73247297-139b-4dfe-8f9d-9baf2b092364
spec:
  authSecret:
    name: ferret-auth
  backend:
    externallyManaged: false
    linkedDB: ferretdb
    postgresRef:
        name: ferret-pg-backend
        namespace: demo
    version: "13.13"
  healthChecker:
    failureThreshold: 1
    periodSeconds: 10
    timeoutSeconds: 10
  podTemplate:
    controller: {}
    metadata: {}
    spec:
      containers:
        - name: ferretdb
          resources:
            limits:
              memory: 1Gi
            requests:
              cpu: 500m
              memory: 1Gi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            runAsGroup: 1000
            runAsNonRoot: true
            runAsUser: 1000
            seccompProfile:
              type: RuntimeDefault
      securityContext:
        fsGroup: 1000
  replicas: 1
  sslMode: disabled
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 500Mi
  storageType: Durable
  deletionPolicy: WipeOut
  version: 1.18.0
status:
  conditions:
    - lastTransitionTime: "2024-03-12T05:04:34Z"
      message: 'The KubeDB operator has started the provisioning of FerretDB: demo/ferret'
      observedGeneration: 3
      reason: DatabaseProvisioningStartedSuccessfully
      status: "True"
      type: ProvisioningStarted
    - lastTransitionTime: "2024-03-12T05:33:58Z"
      message: All replicas are ready for FerretDB demo/ferret
      observedGeneration: 4
      reason: AllReplicasReady
      status: "True"
      type: ReplicaReady
    - lastTransitionTime: "2024-03-12T05:06:20Z"
      message: 'The FerretDB: demo/ferret is accepting client requests.'
      observedGeneration: 4
      reason: DatabaseAcceptingConnectionRequest
      status: "True"
      type: AcceptingConnection
    - lastTransitionTime: "2024-03-12T05:06:20Z"
      message: 'The FerretDB: demo/ferret is ready.'
      observedGeneration: 4
      reason: ReadinessCheckSucceeded
      status: "True"
      type: Ready
    - lastTransitionTime: "2024-03-12T05:06:20Z"
      message: 'The FerretDB: demo/ferret is successfully provisioned.'
      observedGeneration: 4
      reason: DatabaseSuccessfullyProvisioned
      status: "True"
      type: Provisioned
  phase: Ready
```

Please note that KubeDB operator has created a new Secret called `ferret-auth` *(format: {ferretdb-object-name}-auth)* for storing the password for `postgres` superuser. This secret contains a `username` key which contains the *username* for FerretDB superuser and a `password` key which contains the *password* for FerretDB superuser.

If you want to use custom or existing secret please specify that when creating the FerretDB object using `spec.authSecret.name`. While creating this secret manually, make sure the secret contains these two keys containing data `username` and `password`. For more details, please see [here](/docs/v2025.2.19/guides/mongodb/concepts/mongodb#specauthsecret).

Now, you can connect to this database by port-forwarding primary service `ferret` and connecting with [mongo-shell](https://www.mongodb.com/try/download/shell) locally

```bash
$ kubectl get secrets -n demo ferret-auth -o jsonpath='{.data.\username}' | base64 -d
postgres
$ kubectl get secrets -n demo ferret-auth -o jsonpath='{.data.\\password}' | base64 -d
UxV5a35kURSFE(;5

$ kubectl port-forward svc/ferret -n demo 27017
Forwarding from 127.0.0.1:27017 -> 27017
Forwarding from [::1]:27017 -> 27017
Handling connection for 27017
Handling connection for 27017
```

Now in another terminal

```bash
$ mongosh 'mongodb://postgres:UxV5a35kURSFE(;5@localhost:27017/ferretdb?authMechanism=PLAIN'
Current Mongosh Log ID:	65efeea2a3347fff66d04c70
Connecting to:		mongodb://<credentials>@localhost:27017/ferretdb?authMechanism=PLAIN&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5
Using MongoDB:		7.0.42
Using Mongosh:		2.1.5

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-03-12T05:56:50.979Z: Powered by FerretDB v1.18.0 and PostgreSQL 13.13 on x86_64-pc-linux-musl, compiled by gcc.
   2024-03-12T05:56:50.979Z: Please star us on GitHub: https://github.com/FerretDB/FerretDB.
   2024-03-12T05:56:50.979Z: The telemetry state is undecided.
   2024-03-12T05:56:50.979Z: Read more about FerretDB telemetry and how to opt out at https://beacon.ferretdb.io.
------

ferretdb>


ferretdb> show dbs
kubedb_system  80.00 KiB

ferretdb> use mydb
switched to db mydb

mydb> db.movies.insertOne({"top gun": "maverick"})
{
  acknowledged: true,
  insertedId: ObjectId('65efeee6a3347fff66d04c71')
}

mydb> db.movies.find()
[
  { _id: ObjectId('65efeee6a3347fff66d04c71'), 'top gun': 'maverick' }
]

mydb> show dbs
kubedb_system  80.00 KiB
mydb           80.00 KiB

mydb> exit
```
All these data inside FerretDB is also storing inside `ferret-pg-backend` Postgres.

### Create a FerretDB database with externally managed Postgres

If user wants to use its own Postgres database as backend engine, he needs to create an [AppBinding](https://kubedb.com/docs/latest/guides/mongodb/concepts/appbinding/) for his Postgres and specify it in `spec.backend.postgresRef` section. Below is the FerretDB object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: FerretDB
metadata:
  name: ferretdb-external
  namespace: demo
spec:
  version: "1.18.0"
  sslMode: disabled
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 500Mi  
  backend:
    externallyManaged: true
    postgresRef:
        name: ha-postgres
        namespace: demo
  deletionPolicy: WipeOut
```

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/ferredb/quickstart/ferretdb-external.yaml
ferretdb.kubedb.com/ferretdb-external created
```
Here,

- `spec.backend.postgresRef` is AppBinding information of users external postgres exist in the cluster.

KubeDB will deploy a FerretDB database and connect with the users given external postgres through service.

Run the following command to see the modified FerretDB object:

```yaml
$ kubectl get ferretdb ferretdb-external -n demo -oyaml
apiVersion: kubedb.com/v1alpha2
kind: FerretDB
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"kubedb.com/v1alpha2","kind":"FerretDB","metadata":{"annotations":{},"name":"ferretdb-external","namespace":"demo"},"spec":{"authSecret":{"externallyManaged":true,"name":"ha-postgres-auth"},"backend":{"externallyManaged":true,"postgres":{"service":{"name":"ha-postgres","namespace":"demo","pgPort":5432}}},"sslMode":"disabled","storage":{"accessModes":["ReadWriteOnce"],"resources":{"requests":{"storage":"100Mi"}},"storageClassName":"standard"},"storageType":"Durable","deletionPolicy":"WipeOut","version":"1.18.0"}}
  creationTimestamp: "2024-03-12T06:30:22Z"
  finalizers:
    - kubedb.com
  generation: 3
  name: ferretdb-external
  namespace: demo
  resourceVersion: "10959"
  uid: 8380f0a1-c8e9-42e2-8fa9-6ce5870d02f4
spec:
  authSecret:
    name: ha-postgres-auth
  backend:
    externallyManaged: true
    linkedDB: postgres
    postgresRef:
        name: ha-postgres
        namespace: demo
  healthChecker:
    failureThreshold: 1
    periodSeconds: 10
    timeoutSeconds: 10
  podTemplate:
    controller: {}
    metadata: {}
    spec:
      containers:
        - name: ferretdb
          resources:
            limits:
              memory: 1Gi
            requests:
              cpu: 500m
              memory: 1Gi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            runAsGroup: 1000
            runAsNonRoot: true
            runAsUser: 1000
            seccompProfile:
              type: RuntimeDefault
      securityContext:
        fsGroup: 1000
  replicas: 1
  sslMode: disabled
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 500Mi
    storageClassName: standard
  storageType: Durable
  deletionPolicy: WipeOut
  version: 1.18.0
status:
  conditions:
    - lastTransitionTime: "2024-03-12T06:30:22Z"
      message: 'The KubeDB operator has started the provisioning of FerretDB: demo/ferretdb-external'
      observedGeneration: 2
      reason: DatabaseProvisioningStartedSuccessfully
      status: "True"
      type: ProvisioningStarted
    - lastTransitionTime: "2024-03-12T06:33:58Z"
      message: All replicas are ready for FerretDB demo/ferretdb-external
      observedGeneration: 3
      reason: AllReplicasReady
      status: "True"
      type: ReplicaReady
    - lastTransitionTime: "2024-03-12T06:30:34Z"
      message: 'The FerretDB: demo/ferretdb-external is accepting client requests.'
      observedGeneration: 3
      reason: DatabaseAcceptingConnectionRequest
      status: "True"
      type: AcceptingConnection
    - lastTransitionTime: "2024-03-12T06:30:34Z"
      message: 'The FerretDB: demo/ferretdb-external is ready.'
      observedGeneration: 3
      reason: ReadinessCheckSucceeded
      status: "True"
      type: Ready
    - lastTransitionTime: "2024-03-12T06:30:34Z"
      message: 'The FerretDB: demo/ferretdb-external is successfully provisioned.'
      observedGeneration: 3
      reason: DatabaseSuccessfullyProvisioned
      status: "True"
      type: Provisioned
  phase: Ready
```

## Cleaning up

If you don't set the deletionPolicy, then the kubeDB set the DeletionPolicy to `WipeOut` by-default for `FerretDB`.

### WipeOut
If you want to cleanup each of the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl delete -n demo fr/ferret

$ kubectl delete ns demo
```

## Tips for Testing

If you are just testing some basic functionalities, you might want to avoid additional hassles due to some safety features that are great for production environment. You can follow these tips to avoid them.

1. **Use `storageType: Ephemeral`**. Databases are precious. You might not want to lose your data in your production environment if database pod fail. So, we recommend using `spec.storageType: Durable` and provide storage spec in `spec.storage` section. For testing purpose, you can just use `spec.storageType: Ephemeral`. KubeDB will use [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) for storage. You will not require to provide `spec.storage` section.

