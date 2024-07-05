---
title: Initialize MongoDB from Snapshot
menu:
  docs_0.8.0:
    identifier: mg-using-snapshot-initialization
    name: From Snapshot
    parent: mg-initialization-mongodb
    weight: 15
menu_name: docs_0.8.0
section_menu_id: guides
info:
  version: 0.8.0
---

> New to KubeDB? Please start [here](/docs/0.8.0/concepts/README).

# Initialize MongoDB with Snapshot

This tutorial will show you how to use KubeDB to initialize a MongoDB database with an existing snapshot.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.8.0/setup/install).

This tutorial assumes that you have created a namespace `demo` and a snapshot `snapshot-infant`. Follow the steps [here](/docs/0.8.0/guides/mongodb/snapshot/backup-and-restore) to create a database and take [instant snapshot](/docs/0.8.0/guides/mongodb/snapshot/backup-and-restore#instant-backups), if you have not done so already. If you have changed the name of either namespace or snapshot object, please modify the YAMLs used in this tutorial accordingly.

Note that the yaml files that are used in this tutorial, stored in [docs/examples](https://github.com/kubedb/cli/tree/0.8.0/docs/examples) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Create MongoDB with Init-Snapshot

Below is the `MongoDB` object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-init-snapshot
  namespace: demo
spec:
  version: "3.4"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  init:
    snapshotSource:
      name: snapshot-infant
      namespace: demo
```

```console
$ kubedb create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0/docs/examples/mongodb/Initialization/demo-2.yaml
mongodb "mgo-init-snapshot" created
```

Here,

- `spec.init.snapshotSource.name` refers to a Snapshot object for a MongoDB database in the same namespaces as this new `mgo-init-snapshot` MongoDB object.

Now, wait several seconds. KubeDB operator will create a new `StatefulSet`. Then KubeDB operator launches a Kubernetes Job to initialize the new database using the data from `snapshot-infant` Snapshot.

```console
$ kubedb get mg -n demo
NAME                STATUS         AGE
mgo-infant          Running        24m
mgo-init-snapshot   Initializing   6s


$ kubedb describe mg -n demo mgo-init-snapshot
Name:		mgo-init-snapshot
Namespace:	demo
StartTimestamp:	Tue, 06 Feb 2018 10:34:30 +0600
Status:		Running
Annotations:	kubedb.com/initialized=
Volume:
  StorageClass:	standard
  Capacity:	50Mi
  Access Modes:	RWO

StatefulSet:
  Name:			mgo-init-snapshot
  Replicas:		1 current / 1 desired
  CreationTimestamp:	Tue, 06 Feb 2018 10:11:54 +0600
  Pods Status:		1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:		mgo-init-snapshot
  Type:		ClusterIP
  IP:		10.100.233.80
  Port:		db	27017/TCP

Database Secret:
  Name:	mgo-init-snapshot-auth
  Type:	Opaque
  Data
  ====
  password:	16 bytes
  user:		4 bytes

No Snapshots.

Events:
  FirstSeen   LastSeen   Count     From               Type       Reason                 Message
  ---------   --------   -----     ----               --------   ------                 -------
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched StatefulSet
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched MongoDB
  1m          1m         1         Job Controller     Normal     SuccessfulInitialize   Successfully completed initialization
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched StatefulSet
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched MongoDB
  1m          1m         1         MongoDB operator   Normal     Initializing           Initializing from Snapshot: "snapshot-infant"
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched StatefulSet
  1m          1m         1         MongoDB operator   Normal     Successful             Successfully patched MongoDB
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubectl patch -n demo mg/mgo-infant mg/mgo-init-snapshot -p '{"spec":{"doNotPause":false}}' --type="merge"
$ kubectl delete -n demo mg/mgo-infant mg/mgo-init-snapshot

$ kubectl patch -n demo drmn/mgo-infant drmn/mgo-init-snapshot -p '{"spec":{"wipeOut":true}}' --type="merge"
$ kubectl delete -n demo drmn/mgo-infant drmn/mgo-init-snapshot

$ kubectl delete ns demo
namespace "demo" deleted
```

## Next Steps

- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.8.0/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.8.0/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.8.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Detail concepts of [MongoDB object](/docs/0.8.0/concepts/databases/mongodb).
- Detail concepts of [Snapshot object](/docs/0.8.0/concepts/snapshot).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0/CONTRIBUTING).
