---
title: Initialize MongoDB using Script
menu:
  docs_0.9.0-rc.2:
    identifier: mg-using-script-initialization
    name: Using Script
    parent: mg-initialization-mongodb
    weight: 10
menu_name: docs_0.9.0-rc.2
section_menu_id: guides
info:
  version: 0.9.0-rc.2
---

> New to KubeDB? Please start [here](/docs/0.9.0-rc.2/concepts/README).

# Initialize MongoDB using Script

This tutorial will show you how to use KubeDB to initialize a MongoDB database with .js and/or .sh script.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.9.0-rc.2/setup/install).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

  ```console
  $ kubectl create ns demo
  namespace "demo" created

  $ kubectl get ns
  NAME          STATUS    AGE
  demo          Active    10s
  ```

  In this tutorial we will use .js script stored in GitHub repository [kubedb/mongodb-init-scripts](https://github.com/kubedb/mongodb-init-scripts).

> Note: The yaml files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/cli/tree/master/docs/examples/mongodb) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Prepare Initialization Scripts

MongoDB supports initialization with `.sh` and `.js` files. In this tutorial, we will use `init.js` script from [mongodb-init-scripts](https://github.com/kubedb/mongodb-init-scripts) git repository to insert data inside `kubedb` DB.

As [gitRepo](https://kubernetes.io/docs/concepts/storage/volumes/#gitrepo) volume has been deprecated, we will use a ConfigMap as script source. You can use any Kubernetes supported [volume](https://kubernetes.io/docs/concepts/storage/volumes) as script source.

At first, we will create a ConfigMap from `init.js` file. Then, we will provide this ConfigMap as script source in `init.scriptSource` of MongoDB crd spec.

Let's create a ConfigMap with initialization script,

```console
$ kubectl create configmap -n demo mg-init-script \
--from-literal=init.js="$(curl -fsSL https://raw.githubusercontent.com/kubedb/mongodb-init-scripts/master/init.js)"
configmap/mg-init-script created
```

## Create a MongoDB database with Init-Script

Below is the `MongoDB` object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-init-script
  namespace: demo
spec:
  version: "3.4-v1"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  init:
    scriptSource:
      configMap:
        name: mg-init-script
```

```console
$ kubedb create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/mongodb/Initialization/demo-1.yaml
mongodb.kubedb.com/mgo-init-script created
```

Here,

- `spec.init.scriptSource` specifies a script source used to initialize the database before database server starts. The scripts will be executed alphabatically. In this tutorial, a sample .js script from the git repository `https://github.com/kubedb/mongodb-init-scripts.git` is used to create a test database. You can use other [volume sources](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes).  The \*.js and/or \*.sh sripts that are stored inside the root folder will be executed alphabatically. The scripts inside child folders will be skipped.

KubeDB operator watches for `MongoDB` objects using Kubernetes api. When a `MongoDB` object is created, KubeDB operator will create a new StatefulSet and a ClusterIP Service with the matching MongoDB object name. KubeDB operator will also create a governing service for StatefulSets with the name `<mongodb-crd-name>-gvr`, if one is not already present. No MongoDB specific RBAC roles are required for [RBAC enabled clusters](/docs/0.9.0-rc.2/setup/install#using-yaml).

```console
$ kubedb describe mg -n demo mgo-init-script
Name:               mgo-init-script
Namespace:          demo
CreationTimestamp:  Tue, 25 Sep 2018 12:40:16 +0600
Labels:             <none>
Annotations:        <none>
Replicas:           1  total
Status:             Running
  StorageType:      Durable
Volume:
  StorageClass:  standard
  Capacity:      50Mi
  Access Modes:  RWO

StatefulSet:
  Name:               mgo-init-script
  CreationTimestamp:  Tue, 25 Sep 2018 12:40:19 +0600
  Labels:               kubedb.com/kind=MongoDB
                        kubedb.com/name=mgo-init-script
  Annotations:        <none>
  Replicas:           824639914624 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:         mgo-init-script
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-script
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.98.251.80
  Port:         db  27017/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.5:27017

Service:
  Name:         mgo-init-script-gvr
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-script
  Annotations:    service.alpha.kubernetes.io/tolerate-unready-endpoints=true
  Type:         ClusterIP
  IP:           None
  Port:         db  27017/TCP
  TargetPort:   27017/TCP
  Endpoints:    172.17.0.5:27017

Database Secret:
  Name:         mgo-init-script-auth
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-script
  Annotations:  <none>
  
Type:  Opaque
  
Data
====
  user:      4 bytes
  password:  16 bytes

No Snapshots.

Events:
  Type    Reason      Age   From              Message
  ----    ------      ----  ----              -------
  Normal  Successful  2m    MongoDB operator  Successfully created Service
  Normal  Successful  1m    MongoDB operator  Successfully created StatefulSet
  Normal  Successful  1m    MongoDB operator  Successfully created MongoDB
  Normal  Successful  1m    MongoDB operator  Successfully patched StatefulSet
  Normal  Successful  1m    MongoDB operator  Successfully patched MongoDB


$ kubectl get statefulset -n demo
NAME              DESIRED   CURRENT   AGE
mgo-init-script   1         1         2m


$ kubectl get pvc -n demo
NAME                        STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
datadir-mgo-init-script-0   Bound     pvc-a10d636b-c08c-11e8-b4a9-0800272618ed   50Mi       RWO            standard       11m

$ kubectl get pv -n demo
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS    CLAIM                            STORAGECLASS   REASON    AGE
pvc-a10d636b-c08c-11e8-b4a9-0800272618ed   50Mi       RWO            Delete           Bound     demo/datadir-mgo-init-script-0   standard                 12m

$ kubectl get service -n demo
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
mgo-init-script       ClusterIP   10.98.251.80   <none>        27017/TCP   3m
mgo-init-script-gvr   ClusterIP   None           <none>        27017/TCP   3m
```

KubeDB operator sets the `status.phase` to `Running` once the database is successfully created. Run the following command to see the modified MongoDB object:

```yaml
$ kubedb get mg -n demo mgo-init-script -o yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  creationTimestamp: 2018-09-25T06:40:16Z
  finalizers:
  - kubedb.com
  generation: 1
  name: mgo-init-script
  namespace: demo
  resourceVersion: "12500"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/demo/mongodbs/mgo-init-script
  uid: dccef5e6-c08d-11e8-b4a9-0800272618ed
spec:
  databaseSecret:
    secretName: mgo-init-script-auth
  init:
    scriptSource:
      configMap:
        name: mg-init-script
  podTemplate:
    controller: {}
    metadata: {}
    spec:
      resources: {}
  replicas: 1
  serviceTemplate:
    metadata: {}
    spec: {}
  storage:
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
    storageClassName: standard
  storageType: Durable
  terminationPolicy: Pause
  updateStrategy:
    type: RollingUpdate
  version: 3.4-v1
status:
  observedGeneration: 1$4210395375389091791
  phase: Running
```

Please note that KubeDB operator has created a new Secret called `mgo-init-script-auth` *(format: {mongodb-object-name}-auth)* for storing the password for MongoDB superuser. This secret contains a `user` key which contains the *username* for MongoDB superuser and a `password` key which contains the *password* for MongoDB superuser.
If you want to use an existing secret please specify that when creating the MongoDB object using `spec.databaseSecret.secretName`. While creating this secret manually, make sure the secret contains these two keys containing data `user` and `password`.

```console
$ kubectl get secrets -n demo mgo-init-script-auth -o yaml
apiVersion: v1
data:
  password: eGtBaTRmRVpmSVFrNmczVw==
  user: cm9vdA==
kind: Secret
metadata:
  creationTimestamp: 2018-09-25T06:31:17Z
  labels:
    kubedb.com/kind: MongoDB
    kubedb.com/name: mgo-init-script
  name: mgo-init-script-auth
  namespace: demo
  resourceVersion: "11674"
  selfLink: /api/v1/namespaces/demo/secrets/mgo-init-script-auth
  uid: 9b8f4031-c08c-11e8-b4a9-0800272618ed
type: Opaque
```

Now, you can connect to this database through [mongo-shell](https://docs.mongodb.com/v3.4/mongo/). In this tutorial, we are connecting to the MongoDB server from inside the pod.

```console
$ kubectl get secrets -n demo mgo-init-script-auth -o jsonpath='{.data.\user}' | base64 -d
root

$ kubectl get secrets -n demo mgo-init-script-auth -o jsonpath='{.data.\password}' | base64 -d
I2ubsbSpT71NeHWH

$ kubectl exec -it mgo-init-script-0 -n demo sh

> mongo admin
MongoDB shell version v3.4.10
connecting to: mongodb://127.0.0.1:27017/admin
MongoDB server version: 3.4.10
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
	http://docs.mongodb.org/
Questions? Try the support group
	http://groups.google.com/group/mongodb-user

> db.auth("root","I2ubsbSpT71NeHWH")
1

> show dbs
admin   0.000GB
kubedb  0.000GB
local   0.000GB

> use mydb
switched to db mydb

> db.people.find()
{ "_id" : ObjectId("5ba9d667981f02e927b6788e"), "firstname" : "kubernetes", "lastname" : "database" }

> exit
bye
```

As you can see here, the initial script has successfully created a database named `mydb` and inserted data into that database successfully.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo mg/mgo-init-script -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mg/mgo-init-script

kubectl patch -n demo drmn/mgo-init-script -p '{"spec":{"wipeOut":true}}' --type="merge"
kubectl delete -n demo drmn/mgo-init-script

kubectl delete ns demo
```

## Next Steps

- Initialize [MongoDB with Snapshot](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-snapshot).
- [Snapshot and Restore](/docs/0.9.0-rc.2/guides/mongodb/snapshot/backup-and-restore) process of MongoDB databases using KubeDB.
- Take [Scheduled Snapshot](/docs/0.9.0-rc.2/guides/mongodb/snapshot/scheduled-backup) of MongoDB databases using KubeDB.
- Initialize [MongoDB with Script](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-script).
- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.9.0-rc.2/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Detail concepts of [MongoDB object](/docs/0.9.0-rc.2/concepts/databases/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/0.9.0-rc.2/concepts/catalog/mongodb).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0-rc.2/CONTRIBUTING).
