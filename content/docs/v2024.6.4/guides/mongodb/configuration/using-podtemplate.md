---
title: Run MongoDB with Custom Configuration
menu:
  docs_v2024.6.4:
    identifier: using-podtemplate-configuration
    name: Customize PodTemplate
    parent: mg-configuration
    weight: 15
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Run MongoDB with Custom PodTemplate

KubeDB supports providing custom configuration for MongoDB via [PodTemplate](/docs/v2024.6.4/guides/mongodb/concepts/mongodb#specpodtemplate). This tutorial will show you how to use KubeDB to run a MongoDB database with custom configuration using PodTemplate.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2024.6.4/setup/README).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: YAML files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/mongodb) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Overview

KubeDB allows providing a template for database pod through `spec.podTemplate`. KubeDB operator will pass the information provided in `spec.podTemplate` to the StatefulSet created for MongoDB database.

KubeDB accept following fields to set in `spec.podTemplate:`

- metadata:
  - annotations (pod's annotation)
  - labels (pod's labels)
- controller:
  - annotations (statefulset's annotation)
  - labels (statefulset's labels)
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

Read about the fields in details in [PodTemplate concept](/docs/v2024.6.4/guides/mongodb/concepts/mongodb#specpodtemplate),

## CRD Configuration

Below is the YAML for the MongoDB created in this example. Here, [`spec.podTemplate.spec.env`](/docs/v2024.6.4/guides/mongodb/concepts/mongodb#specpodtemplatespecenv) specifies environment variables and [`spec.podTemplate.spec.args`](/docs/v2024.6.4/guides/mongodb/concepts/mongodb#specpodtemplatespecargs) provides extra arguments for [MongoDB Docker Image](https://hub.docker.com/_/mongodb/).

In this tutorial, `maxIncomingConnections` is set to `100` (default, 65536) through args `--maxConns=100`.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: MongoDB
metadata:
  name: mgo-misc-config
  namespace: demo
spec:
  version: "4.4.26"
  storageType: "Durable"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  podTemplate:
    spec:
      args:
      - --maxConns=100
      resources:
        requests:
          memory: "1Gi"
          cpu: "250m"
  terminationPolicy: Halt
```

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/mongodb/configuration/mgo-misc-config.yaml
mongodb.kubedb.com/mgo-misc-config created
```

Now, wait a few minutes. KubeDB operator will create necessary PVC, statefulset, services, secret etc. If everything goes well, we will see that a pod with the name `mgo-misc-config-0` has been created.

Check that the statefulset's pod is running

```bash
$ kubectl get pod -n demo
NAME                READY     STATUS    RESTARTS   AGE
mgo-misc-config-0   1/1       Running   0          14m
```

Now, check if the database has started with the custom configuration we have provided.

Now, you can connect to this database through [mongo-shell](https://docs.mongodb.com/v3.4/mongo/). In this tutorial, we are connecting to the MongoDB server from inside the pod.

```bash
$ kubectl get secrets -n demo mgo-misc-config-auth -o jsonpath='{.data.\username}' | base64 -d
root

$ kubectl get secrets -n demo mgo-misc-config-auth -o jsonpath='{.data.\password}' | base64 -d
zyp5hDfRlVOWOyk9

$ kubectl exec -it mgo-misc-config-0 -n demo sh

> mongo admin

> db.auth("root","zyp5hDfRlVOWOyk9")
1

> db._adminCommand( {getCmdLineOpts: 1})
{
	"argv" : [
		"mongod",
		"--dbpath=/data/db",
		"--auth",
		"--ipv6",
		"--bind_ip_all",
		"--port=27017",
		"--tlsMode=disabled",
		"--config=/data/configdb/mongod.conf"
	],
	"parsed" : {
		"config" : "/data/configdb/mongod.conf",
		"net" : {
			"bindIp" : "*",
			"ipv6" : true,
			"maxIncomingConnections" : 100,
			"port" : 27017,
			"tls" : {
				"mode" : "disabled"
			}
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

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo mg/mgo-misc-config -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo mg/mgo-misc-config

kubectl delete ns demo
```

If you would like to uninstall KubeDB operator, please follow the steps [here](/docs/v2024.6.4/setup/README).

## Next Steps

- [Quickstart MongoDB](/docs/v2024.6.4/guides/mongodb/quickstart/quickstart) with KubeDB Operator.
- [Backup and Restore](/docs/v2024.6.4/guides/mongodb/backup/overview/) MongoDB databases using Stash.
- Initialize [MongoDB with Script](/docs/v2024.6.4/guides/mongodb/initialization/using-script).
- Monitor your MongoDB database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2024.6.4/guides/mongodb/monitoring/using-prometheus-operator).
- Monitor your MongoDB database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2024.6.4/guides/mongodb/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2024.6.4/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Use [kubedb cli](/docs/v2024.6.4/guides/mongodb/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MongoDB object](/docs/v2024.6.4/guides/mongodb/concepts/mongodb).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.6.4/CONTRIBUTING).
