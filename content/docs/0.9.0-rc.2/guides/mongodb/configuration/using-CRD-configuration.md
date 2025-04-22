---
title: Run MongoDB with Custom Configuration
menu:
  docs_0.9.0-rc.2:
    identifier: mg-crd-configuration
    name: Using CRD Config
    parent: mg-configuration
    weight: 15
menu_name: docs_0.9.0-rc.2
section_menu_id: guides
info:
  version: 0.9.0-rc.2
---

> New to KubeDB? Please start [here](/docs/0.9.0-rc.2/concepts/README).

# Run MongoDB with Custom Configuration

KubeDB supports providing custom configuration for MongoDB via [PodTemplate](/docs/0.9.0-rc.2/concepts/databases/mongodb#specpodtemplate). This tutorial will show you how to use KubeDB to run a MongoDB database with custom configuration using PodTemplate.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.9.0-rc.2/setup/install).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

  ```console
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: Yaml files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/cli/tree/master/docs/examples/mongodb) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Overview

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
  - schedulerName
  - tolerations
  - priorityClassName
  - priority
  - securityContext

Read about the fields in details in [PodTemplate concept](/docs/0.9.0-rc.2/concepts/databases/mongodb#specpodtemplate),

## CRD Configuration

Below is the YAML for the MongoDB created in this example. Here, [`spec.podTemplate.spec.env`](/docs/0.9.0-rc.2/concepts/databases/mongodb#specpodtemplatespecenv) specifies environment variables and [`spec.podTemplate.spec.args`](/docs/0.9.0-rc.2/concepts/databases/mongodb#specpodtemplatespecargs) provides extra arguments for [MongoDB Docker Image](https://hub.docker.com/_/mongodb/). 

In this tutorial, `maxIncomingConnections` is set to `100` (default, 65536) through args `--maxConns=100`.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-misc-config
  namespace: demo
spec:
  version: "3.6-v1"
  storageType: "Durable"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  podTemplate:
    spec:
      args:
      - --maxConns=100
      resources:
        requests:
          memory: "1Gi"
          cpu: "250m"
  terminationPolicy: Pause
  updateStrategy:
    type: RollingUpdate
```

```console
$ kubedb create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/mongodb/configuration/mgo-misc-config.yaml
mongodb.kubedb.com/mgo-misc-config created
```

Now, wait a few minutes. KubeDB operator will create necessary PVC, statefulset, services, secret etc. If everything goes well, we will see that a pod with the name `mgo-misc-config-0` has been created.

Check that the statefulset's pod is running

```console
$ kubectl get pod -n demo
NAME                READY     STATUS    RESTARTS   AGE
mgo-misc-config-0   1/1       Running   0          14m
```

Now, check if the database has started with the custom configuration we have provided.

Now, you can connect to this database through [mongo-shell](https://docs.mongodb.com/v3.4/mongo/). In this tutorial, we are connecting to the MongoDB server from inside the pod.

```console
$ kubectl get secrets -n demo mgo-misc-config-auth -o jsonpath='{.data.\user}' | base64 -d
root

$ kubectl get secrets -n demo mgo-misc-config-auth -o jsonpath='{.data.\password}' | base64 -d
TxDWYECTRXaWWueP

$ kubectl exec -it mgo-misc-config-0 -n demo sh

> mongo admin

> db.auth("root","TxDWYECTRXaWWueP")
1

> db._adminCommand( {getCmdLineOpts: 1})
{
	"argv" : [
		"mongod",
		"--dbpath=/data/db",
		"--auth",
		"--bind_ip=0.0.0.0",
		"--port=27017",
		"--maxConns=100"
	],
	"parsed" : {
		"net" : {
			"bindIp" : "0.0.0.0",
			"maxIncomingConnections" : 100,
			"port" : 27017
		},
		"security" : {
			"authorization" : "enabled"
		},
		"storage" : {
			"dbPath" : "/data/db"
		}
	},
	"ok" : 1
}

> exit
bye
```

You can see the maximum connection is set to `100` in `parsed.net.maxIncomingConnections`.

## Snapshot Configuration

`Snapshot` also has the scope to be configured through `spec.podTemplate`. In this tutorial, an extra argument `--gzip` is passed to snapshot crd so that the output of `mongodump` is saved in `gzip`.

Below is the Snapshot CRD that is deployed in this tutorial. Create a secret `mg-snap-secret` from [here](/docs/0.9.0-rc.2/guides/mongodb/snapshot/backup-and-restore#instant-backups) for snapshot. 

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snap-mgo-config
  namespace: demo
  labels:
    kubedb.com/kind: MongoDB
spec:
  databaseName: mgo-misc-config
  storageSecretName: mg-snap-secret
  gcs:
    bucket: kubedb
  podTemplate:
    spec:
      args:
      - --gzip
```

```console
$ kubedb create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/mongodb/configuration/snapshot-misc-conf.yaml 
snapshot.kubedb.com/snap-mongodb-config created


$ kubedb get snap -n demo
NAME              DATABASENAME      STATUS      AGE
snap-mgo-config   mgo-misc-config   Succeeded   50m
```

## Scheduled Backups

To configure BackupScheduler, add the require changes in PodTemplate just like snapshot object.

```yaml
$ kubedb edit mg mgo-misc-config -n demo
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: mgo-misc-config
  namespace: demo
  ...
spec:
  backupSchedule:
    cronExpression: '@every 1m'
    storageSecretName: mg-snap-secret
    gcs:
      bucket: kubedb
    podTemplate:
      spec:
        args:
        - --gzip
  ...
status:
  observedGeneration: 3$4212299729528774793
  phase: Running
```

```console
$ kubedb get snap -n demo
NAME                              DATABASENAME      STATUS      AGE
mgo-misc-config-20181002-105247   mgo-misc-config   Succeeded   3m
mgo-misc-config-20181002-105349   mgo-misc-config   Succeeded   2m
mgo-misc-config-20181002-105449   mgo-misc-config   Succeeded   1m
mgo-misc-config-20181002-105549   mgo-misc-config   Succeeded   43s
snap-mongodb-config               mgo-misc-config   Succeeded   12m
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo mg/mgo-misc-config -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mg/mgo-misc-config

kubectl patch -n demo drmn/mgo-misc-config -p '{"spec":{"wipeOut":true}}' --type="merge"
kubectl delete -n demo drmn/mgo-misc-config

kubectl delete ns demo
```

If you would like to uninstall KubeDB operator, please follow the steps [here](/docs/0.9.0-rc.2/setup/uninstall).

## Next Steps

- [Quickstart MongoDB](/docs/0.9.0-rc.2/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [Snapshot and Restore](/docs/0.9.0-rc.2/guides/mongodb/snapshot/backup-and-restore) process of MongoDB databases using KubeDB.
- Take [Scheduled Snapshot](/docs/0.9.0-rc.2/guides/mongodb/snapshot/scheduled-backup) of MongoDB databases using KubeDB.
- Initialize [MongoDB with Script](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-script).
- Initialize [MongoDB with Snapshot](/docs/0.9.0-rc.2/guides/mongodb/initialization/using-snapshot).
- Monitor your MongoDB database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/0.9.0-rc.2/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/0.9.0-rc.2/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/0.9.0-rc.2/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/0.9.0-rc.2/concepts/databases/mongodb).
- Detail concepts of [Snapshot object](/docs/0.9.0-rc.2/concepts/snapshot).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0-rc.2/CONTRIBUTING).
