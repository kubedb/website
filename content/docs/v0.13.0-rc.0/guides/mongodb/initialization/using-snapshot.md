---
title: Initialize MongoDB from Snapshot
menu:
  docs_v0.13.0-rc.0:
    identifier: mg-using-snapshot-initialization
    name: From Snapshot
    parent: mg-initialization-mongodb
    weight: 15
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
info:
  version: v0.13.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).

# Initialize MongoDB with Snapshot

This tutorial will show you how to use KubeDB to initialize a MongoDB database with an existing snapshot.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

- This tutorial assumes that you have created a namespace `demo` and a snapshot `snapshot-instant`. Follow the steps [here](/docs/v0.13.0-rc.0/guides/mongodb/snapshot/backup-and-restore) to create a database and take [instant snapshot](/docs/v0.13.0-rc.0/guides/mongodb/snapshot/backup-and-restore#instant-backups), if you have not done so already. If you have changed the name of either namespace or snapshot object, please modify the YAMLs used in this tutorial accordingly.

> Note: The yaml files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/mongodb) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Create MongoDB with Init-Snapshot

Below is the `MongoDB` object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-init-snapshot
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
  init:
    snapshotSource:
      name: snapshot-instant
      namespace: demo
```

```console
$ kubedb create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/mongodb/Initialization/demo-2.yaml
mongodb.kubedb.com/mgo-init-snapshot created
```

Here,

- `spec.init.snapshotSource.name` refers to a Snapshot object for a MongoDB database in the same namespaces as this new `mgo-init-snapshot` MongoDB object.

Now, wait several seconds. KubeDB operator will create a new `StatefulSet`. Then KubeDB operator launches a Kubernetes Job to initialize the new database using the data from `snapshot-instant` Snapshot.

```console
$ kubedb get mg -n demo
NAME                VERSION   STATUS         AGE
mgo-instant          3.4-v3    Running        4m
mgo-init-snapshot   3.4-v3    Initializing   53s

$ kubedb describe mg -n demo mgo-init-snapshot
Name:               mgo-init-snapshot
Namespace:          demo
CreationTimestamp:  Wed, 06 Feb 2019 15:51:44 +0600
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
  Name:               mgo-init-snapshot
  CreationTimestamp:  Wed, 06 Feb 2019 15:51:44 +0600
  Labels:               kubedb.com/kind=MongoDB
                        kubedb.com/name=mgo-init-snapshot
  Annotations:        <none>
  Replicas:           824637966784 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:         mgo-init-snapshot
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-snapshot
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.100.3.243
  Port:         db  27017/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.8:27017

Service:
  Name:         mgo-init-snapshot-gvr
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-snapshot
  Annotations:    service.alpha.kubernetes.io/tolerate-unready-endpoints=true
  Type:         ClusterIP
  IP:           None
  Port:         db  27017/TCP
  TargetPort:   27017/TCP
  Endpoints:    172.17.0.8:27017

Database Secret:
  Name:         mgo-init-snapshot-auth
  Labels:         kubedb.com/kind=MongoDB
                  kubedb.com/name=mgo-init-snapshot
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
  Normal  Successful            20s   KubeDB operator  Successfully created Service
  Normal  Successful            12s   KubeDB operator  Successfully created StatefulSet
  Normal  Successful            12s   KubeDB operator  Successfully created MongoDB
  Normal  Initializing          12s   KubeDB operator  Initializing from Snapshot: "snapshot-instant"
  Normal  Successful            12s   KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            12s   KubeDB operator  Successfully patched MongoDB
  Normal  Successful            4s    KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            4s    KubeDB operator  Successfully patched MongoDB
  Normal  SuccessfulInitialize  4s    KubeDB operator  Successfully completed initialization
  Normal  Successful            4s    KubeDB operator  Successfully created appbinding
  Normal  Successful            4s    KubeDB operator  Successfully patched StatefulSet
  Normal  Successful            4s    KubeDB operator  Successfully patched MongoDB
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo mg/mgo-instant mg/mgo-init-snapshot -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mg/mgo-instant mg/mgo-init-snapshot

kubectl patch -n demo drmn/mgo-instant drmn/mgo-init-snapshot -p '{"spec":{"wipeOut":true}}' --type="merge"
kubectl delete -n demo drmn/mgo-instant drmn/mgo-init-snapshot

kubectl delete ns demo
```

## Next Steps

- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v0.13.0-rc.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v0.13.0-rc.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Detail concepts of [MongoDB object](/docs/v0.13.0-rc.0/concepts/databases/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v0.13.0-rc.0/concepts/catalog/mongodb).
- Detail concepts of [Snapshot object](/docs/v0.13.0-rc.0/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).
