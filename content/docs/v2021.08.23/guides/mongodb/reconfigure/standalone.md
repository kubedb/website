---
title: Reconfigure Standalone MongoDB Database
menu:
  docs_v2021.08.23:
    identifier: mg-reconfigure-standalone
    name: Standalone
    parent: mg-reconfigure
    weight: 20
menu_name: docs_v2021.08.23
section_menu_id: guides
info:
  autoscaler: v0.5.0
  cli: v0.20.0
  community: v0.20.0
  enterprise: v0.7.0
  installer: v2021.08.23
  version: v2021.08.23
---

> New to KubeDB? Please start [here](/docs/v2021.08.23/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.08.23/setup/install/enterprise) to try this feature." >}}

# Reconfigure MongoDB Standalone Database

This guide will show you how to use `KubeDB` Enterprise operator to reconfigure a MongoDB standalone database.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the `kubectl` command-line tool must be configured to communicate with your cluster.

- Install `KubeDB` Community and Enterprise operator in your cluster following the steps [here](/docs/v2021.08.23/setup/README).

- You should be familiar with the following `KubeDB` concepts:
  - [MongoDB](/docs/v2021.08.23/guides/mongodb/concepts/mongodb)
  - [MongoDBOpsRequest](/docs/v2021.08.23/guides/mongodb/concepts/opsrequest)
  - [Reconfigure Overview](/docs/v2021.08.23/guides/mongodb/reconfigure/overview)

To keep everything isolated, we are going to use a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> **Note:** YAML files used in this tutorial are stored in [docs/examples/mongodb](/docs/v2021.08.23/examples/mongodb) directory of [kubedb/docs](https://github.com/kubedb/docs) repository.

Now, we are going to deploy a  `MongoDB` standalone using a supported version by `KubeDB` operator. Then we are going to apply `MongoDBOpsRequest` to reconfigure its configuration.

### Prepare MongoDB Standalone Database

Now, we are going to deploy a `MongoDB` standalone database with version `4.2.3`.

### Deploy MongoDB standalone 

At first, we will create `mongod.conf` file containing required configuration settings.

```ini
$ cat mongod.conf
net:
   maxIncomingConnections: 10000
```
Here, `maxIncomingConnections` is set to `10000`, whereas the default value is `65536`.

Now, we will create a secret with this configuration file.

```bash
$ kubectl create secret generic -n demo mg-custom-config --from-file=./mongod.conf
secret/mg-custom-config created
```

In this section, we are going to create a MongoDB object specifying `spec.configSecret` field to apply this custom configuration. Below is the YAML of the `MongoDB` CR that we are going to create,

```yaml
apiVersion: kubedb.com/v1alpha2
kind: MongoDB
metadata:
  name: mg-standalone
  namespace: demo
spec:
  version: "4.2.3"
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  configSecret:
    name: mg-custom-config
```

Let's create the `MongoDB` CR we have shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/mongodb/reconfigure/mg-standalone-config.yaml
mongodb.kubedb.com/mg-standalone created
```

Now, wait until `mg-standalone` has status `Ready`. i.e,

```bash
$ kubectl get mg -n demo
NAME            VERSION    STATUS    AGE
mg-standalone   4.2.3      Ready     23s
```

Now, we will check if the database has started with the custom configuration we have provided.

First we need to get the username and password to connect to a mongodb instance,
```bash
$ kubectl get secrets -n demo mg-standalone-auth -o jsonpath='{.data.\username}' | base64 -d
root

$ kubectl get secrets -n demo mg-standalone-auth -o jsonpath='{.data.\password}' | base64 -d
m6lXjZugrC4VEpB8
```

Now let's connect to a mongodb instance and run a mongodb internal command to check the configuration we have provided.

```bash
$ kubectl exec -n demo  mg-standalone-0  -- mongo admin -u root -p m6lXjZugrC4VEpB8 --eval "db._adminCommand( {getCmdLineOpts: 1})" --quiet
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
			"maxIncomingConnections" : 10000,
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
```

As we can see from the configuration of running mongodb, the value of `maxIncomingConnections` has been set to `10000`.

### Reconfigure using new secret

Now we will reconfigure this database to set `maxIncomingConnections` to `20000`. 

Now, we will edit the `mongod.conf` file containing required configuration settings.

```ini
$ cat mongod.conf
net:
   maxIncomingConnections: 20000
```

Then, we will create a new secret with this configuration file.

```bash
$ kubectl create secret generic -n demo new-custom-config --from-file=./mongod.conf
secret/new-custom-config created
```

#### Create MongoDBOpsRequest

Now, we will use this secret to replace the previous secret using a `MongoDBOpsRequest` CR. The `MongoDBOpsRequest` yaml is given below,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MongoDBOpsRequest
metadata:
  name: mops-reconfigure-standalone
  namespace: demo
spec:
  type: Reconfigure
  databaseRef:
    name: mg-standalone
  configuration:
    standalone:
      configSecret:
        name: new-custom-config
```

Here,

- `spec.databaseRef.name` specifies that we are reconfiguring `mops-reconfigure-standalone` database.
- `spec.type` specifies that we are performing `Reconfigure` on our database.
- `spec.configuration.standalone.configSecret.name` specifies the name of the new secret.

Let's create the `MongoDBOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/mongodb/reconfigure/mops-reconfigure-standalone.yaml
mongodbopsrequest.ops.kubedb.com/mops-reconfigure-standalone created
```

#### Verify the new configuration is working 

If everything goes well, `KubeDB` Enterprise operator will update the `configSecret` of `MongoDB` object.

Let's wait for `MongoDBOpsRequest` to be `Successful`.  Run the following command to watch `MongoDBOpsRequest` CR,

```bash
$ watch kubectl get mongodbopsrequest -n demo
Every 2.0s: kubectl get mongodbopsrequest -n demo
NAME                          TYPE          STATUS       AGE
mops-reconfigure-standalone   Reconfigure   Successful   10m
```

We can see from the above output that the `MongoDBOpsRequest` has succeeded. If we describe the `MongoDBOpsRequest` we will get an overview of the steps that were followed to reconfigure the database.

```bash
$ kubectl describe mongodbopsrequest -n demo mops-reconfigure-standalone
Name:         mops-reconfigure-standalone
Namespace:    demo
Labels:       <none>
Annotations:  <none>
API Version:  ops.kubedb.com/v1alpha1
Kind:         MongoDBOpsRequest
Metadata:
  Creation Timestamp:  2021-03-02T15:04:45Z
  Generation:          1
  Managed Fields:
    API Version:  ops.kubedb.com/v1alpha1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:annotations:
          .:
          f:kubectl.kubernetes.io/last-applied-configuration:
      f:spec:
        .:
        f:configuration:
          .:
          f:standalone:
            .:
            f:configSecret:
              .:
              f:name:
        f:databaseRef:
          .:
          f:name:
        f:type:
    Manager:      kubectl-client-side-apply
    Operation:    Update
    Time:         2021-03-02T15:04:45Z
    API Version:  ops.kubedb.com/v1alpha1
    Fields Type:  FieldsV1
    fieldsV1:
      f:spec:
        f:configuration:
          f:standalone:
            f:podTemplate:
              .:
              f:controller:
              f:metadata:
              f:spec:
                .:
                f:resources:
      f:status:
        .:
        f:conditions:
        f:observedGeneration:
        f:phase:
    Manager:         kubedb-enterprise
    Operation:       Update
    Time:            2021-03-02T15:04:45Z
  Resource Version:  125826
  Self Link:         /apis/ops.kubedb.com/v1alpha1/namespaces/demo/mongodbopsrequests/mops-reconfigure-standalone
  UID:               f63bb606-9df5-4516-9901-97dfe5b46b15
Spec:
  Configuration:
    Standalone:
      Config Secret:
        Name:  new-custom-config
  Database Ref:
    Name:  mg-standalone
  Type:    Reconfigure
Status:
  Conditions:
    Last Transition Time:  2021-03-02T15:04:45Z
    Message:               MongoDB ops request is reconfiguring database
    Observed Generation:   1
    Reason:                Reconfigure
    Status:                True
    Type:                  Reconfigure
    Last Transition Time:  2021-03-02T15:05:10Z
    Message:               Successfully Reconfigured MongoDB
    Observed Generation:   1
    Reason:                ReconfigureStandalone
    Status:                True
    Type:                  ReconfigureStandalone
    Last Transition Time:  2021-03-02T15:05:10Z
    Message:               Successfully completed the modification process.
    Observed Generation:   1
    Reason:                Successful
    Status:                True
    Type:                  Successful
  Observed Generation:     1
  Phase:                   Successful
Events:
  Type    Reason                 Age   From                        Message
  ----    ------                 ----  ----                        -------
  Normal  PauseDatabase          60s   KubeDB Enterprise Operator  Pausing MongoDB demo/mg-standalone
  Normal  PauseDatabase          60s   KubeDB Enterprise Operator  Successfully paused MongoDB demo/mg-standalone
  Normal  ReconfigureStandalone  35s   KubeDB Enterprise Operator  Successfully Reconfigured MongoDB
  Normal  ResumeDatabase         35s   KubeDB Enterprise Operator  Resuming MongoDB demo/mg-standalone
  Normal  ResumeDatabase         35s   KubeDB Enterprise Operator  Successfully resumed MongoDB demo/mg-standalone
  Normal  Successful             35s   KubeDB Enterprise Operator  Successfully Reconfigured Database
```

Now let's connect to a mongodb instance and run a mongodb internal command to check the new configuration we have provided.

```bash
$ kubectl exec -n demo  mg-standalone-0  -- mongo admin -u root -p m6lXjZugrC4VEpB8 --eval "db._adminCommand( {getCmdLineOpts: 1})" --quiet
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
			"maxIncomingConnections" : 20000,
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
```

As we can see from the configuration of running mongodb, the value of `maxIncomingConnections` has been changed from `10000` to `20000`. So the reconfiguration of the database is successful.


### Reconfigure using inline config

Now we will reconfigure this database again to set `maxIncomingConnections` to `30000`. This time we won't use a new secret. We will use the `inlineConfig` field of the `MongoDBOpsRequest`. This will merge the new config in the existing secret.

#### Create MongoDBOpsRequest

Now, we will use the new configuration in the `data` field in the `MongoDBOpsRequest` CR. The `MongoDBOpsRequest` yaml is given below,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MongoDBOpsRequest
metadata:
  name: mops-reconfigure-inline-standalone
  namespace: demo
spec:
  type: Reconfigure
  databaseRef:
    name: mg-standalone
  configuration:
    standalone:
      inlineConfig: |
        net:
          maxIncomingConnections: 30000
```

Here,

- `spec.databaseRef.name` specifies that we are reconfiguring `mops-reconfigure-inline-standalone` database.
- `spec.type` specifies that we are performing `Reconfigure` on our database.
- `spec.configuration.standalone.inlineConfig` specifies the new configuration that will be merged in the existing secret.

Let's create the `MongoDBOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/mongodb/reconfigure/mops-reconfigure-inline-standalone.yaml
mongodbopsrequest.ops.kubedb.com/mops-reconfigure-inline-standalone created
```

#### Verify the new configuration is working 

If everything goes well, `KubeDB` Enterprise operator will merge this new config with the existing configuration.

Let's wait for `MongoDBOpsRequest` to be `Successful`.  Run the following command to watch `MongoDBOpsRequest` CR,

```bash
$ watch kubectl get mongodbopsrequest -n demo
Every 2.0s: kubectl get mongodbopsrequest -n demo
NAME                               TYPE          STATUS       AGE
mops-reconfigure-inline-standalone   Reconfigure   Successful   38s
```

We can see from the above output that the `MongoDBOpsRequest` has succeeded. If we describe the `MongoDBOpsRequest` we will get an overview of the steps that were followed to reconfigure the database.

```bash
$ kubectl describe mongodbopsrequest -n demo mops-reconfigure-inline-standalone
Name:         mops-reconfigure-inline-standalone
Namespace:    demo
Labels:       <none>
Annotations:  <none>
API Version:  ops.kubedb.com/v1alpha1
Kind:         MongoDBOpsRequest
Metadata:
  Creation Timestamp:  2021-03-02T15:09:12Z
  Generation:          1
  Managed Fields:
    API Version:  ops.kubedb.com/v1alpha1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:annotations:
          .:
          f:kubectl.kubernetes.io/last-applied-configuration:
      f:spec:
        .:
        f:configuration:
          .:
          f:standalone:
            .:
            f:inlineConfig:
        f:databaseRef:
          .:
          f:name:
        f:type:
    Manager:      kubectl-client-side-apply
    Operation:    Update
    Time:         2021-03-02T15:09:12Z
    API Version:  ops.kubedb.com/v1alpha1
    Fields Type:  FieldsV1
    fieldsV1:
      f:spec:
        f:configuration:
          f:standalone:
            f:podTemplate:
              .:
              f:controller:
              f:metadata:
              f:spec:
                .:
                f:resources:
      f:status:
        .:
        f:conditions:
        f:observedGeneration:
        f:phase:
    Manager:         kubedb-enterprise
    Operation:       Update
    Time:            2021-03-02T15:09:13Z
  Resource Version:  126782
  Self Link:         /apis/ops.kubedb.com/v1alpha1/namespaces/demo/mongodbopsrequests/mops-reconfigure-inline-standalone
  UID:               33eea32f-e2af-4e36-b612-c528549e3d65
Spec:
  Configuration:
    Standalone:
      Inline Config:  net:
  maxIncomingConnections: 30000

  Database Ref:
    Name:  mg-standalone
  Type:    Reconfigure
Status:
  Conditions:
    Last Transition Time:  2021-03-02T15:09:13Z
    Message:               MongoDB ops request is reconfiguring database
    Observed Generation:   1
    Reason:                Reconfigure
    Status:                True
    Type:                  Reconfigure
    Last Transition Time:  2021-03-02T15:09:38Z
    Message:               Successfully Reconfigured MongoDB
    Observed Generation:   1
    Reason:                ReconfigureStandalone
    Status:                True
    Type:                  ReconfigureStandalone
    Last Transition Time:  2021-03-02T15:09:38Z
    Message:               Successfully completed the modification process.
    Observed Generation:   1
    Reason:                Successful
    Status:                True
    Type:                  Successful
  Observed Generation:     1
  Phase:                   Successful
Events:
  Type    Reason                 Age   From                        Message
  ----    ------                 ----  ----                        -------
  Normal  PauseDatabase          118s  KubeDB Enterprise Operator  Pausing MongoDB demo/mg-standalone
  Normal  PauseDatabase          118s  KubeDB Enterprise Operator  Successfully paused MongoDB demo/mg-standalone
  Normal  ReconfigureStandalone  93s   KubeDB Enterprise Operator  Successfully Reconfigured MongoDB
  Normal  ResumeDatabase         93s   KubeDB Enterprise Operator  Resuming MongoDB demo/mg-standalone
  Normal  ResumeDatabase         93s   KubeDB Enterprise Operator  Successfully resumed MongoDB demo/mg-standalone
  Normal  Successful             93s   KubeDB Enterprise Operator  Successfully Reconfigured Database
```

Now let's connect to a mongodb instance and run a mongodb internal command to check the new configuration we have provided.

```bash
$ kubectl exec -n demo  mg-standalone-0  -- mongo admin -u root -p m6lXjZugrC4VEpB8 --eval "db._adminCommand( {getCmdLineOpts: 1})" --quiet
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
			"maxIncomingConnections" : 30000,
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
```

As we can see from the configuration of running mongodb, the value of `maxIncomingConnections` has been changed from `20000` to `30000`. So the reconfiguration of the database using the `inlineConfig` field is successful.


## Cleaning Up

To clean up the Kubernetes resources created by this tutorial, run:

```bash
kubectl delete mg -n demo mg-standalone
kubectl delete mongodbopsrequest -n demo mops-reconfigure-standalone mops-reconfigure-inline-standalone
```