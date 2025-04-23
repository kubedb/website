---
title: Vertical Scaling MySQL standalone
menu:
  docs_v2021.01.14:
    identifier: my-vertical-scaling-standalone
    name: Standalone
    parent: my-vertical-scaling
    weight: 20
menu_name: docs_v2021.01.14
section_menu_id: guides
info:
  autoscaler: v0.1.0
  cli: v0.16.0
  community: v0.16.0
  enterprise: v0.3.0
  installer: v0.16.0
  version: v2021.01.14
---

> New to KubeDB? Please start [here](/docs/v2021.01.14/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.01.14/setup/install/enterprise) to try this feature." >}}

# Vertical Scale MySQL Standalone

This guide will show you how to use `KubeDB` enterprise operator to update the resources of a standalone.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the `kubectl` command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Install `KubeDB` community and enterprise operator in your cluster following the steps [here](/docs/v2021.01.14/setup/README).

- You should be familiar with the following `KubeDB` concepts:
  - [MySQL](/docs/v2021.01.14/guides/mysql/concepts/mysql)
  - [MySQLOpsRequest](/docs/v2021.01.14/guides/mysql/concepts/opsrequest)
  - [Vertical Scaling Overview](/docs/v2021.01.14/guides/mysql/scaling/vertical-scaling/overview)

To keep everything isolated, we are going to use a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> **Note:** YAML files used in this tutorial are stored in [docs/examples/mysql](/docs/v2021.01.14/examples/mysql) directory of [kubedb/docs](https://github.com/kubedb/docs) repository.

### Apply Vertical Scaling on Standalone

Here, we are going to deploy a  `MySQL` standalone using a supported version by `KubeDB` operator. Then we are going to apply vertical scaling on it.

#### Prepare Group Replication

At first, we are going to deploy a standalone using supported `MySQL` version. Then, we are going to update the resources of the database server through vertical scaling.

**Find supported MySQL Version:**

When you have installed `KubeDB`, it has created `MySQLVersion` CR for all supported `MySQL` versions. Let's check the supported MySQL versions,

```bash
$ kubectl get mysqlversion
NAME        VERSION   DB_IMAGE                 DEPRECATED   AGE
5           5         kubedb/mysql:5           true         149m
5-v1        5         kubedb/mysql:5-v1        true         149m
5.7         5.7       kubedb/mysql:5.7         true         149m
5.7-v1      5.7       kubedb/mysql:5.7-v1      true         149m
5.7-v2      5.7.25    kubedb/mysql:5.7-v2      true         149m
5.7-v3      5.7.25    kubedb/mysql:5.7.25      true         149m
5.7-v4      5.7.29    kubedb/mysql:5.7.29      true         149m
5.7.25      5.7.25    kubedb/mysql:5.7.25      true         149m
5.7.25-v1   5.7.25    kubedb/mysql:5.7.25-v1                149m
5.7.29      5.7.29    kubedb/mysql:5.7.29                   149m
5.7.31      5.7.31    kubedb/mysql:5.7.31                   149m
8           8         kubedb/mysql:8           true         149m
8-v1        8         kubedb/mysql:8-v1        true         149m
8.0         8.0       kubedb/mysql:8.0         true         149m
8.0-v1      8.0.3     kubedb/mysql:8.0-v1      true         149m
8.0-v2      8.0.14    kubedb/mysql:8.0-v2      true         149m
8.0-v3      8.0.20    kubedb/mysql:8.0.20      true         149m
8.0.14      8.0.14    kubedb/mysql:8.0.14      true         149m
8.0.14-v1   8.0.14    kubedb/mysql:8.0.14-v1                149m
8.0.20      8.0.20    kubedb/mysql:8.0.20                   149m
8.0.21      8.0.21    kubedb/mysql:8.0.21                   149m
8.0.3       8.0.3     kubedb/mysql:8.0.3       true         149m
8.0.3-v1    8.0.3     kubedb/mysql:8.0.3-v1                 149m
```

The version above that does not show `DEPRECATED` `true` is supported by `KubeDB` for `MySQL`. You can use any non-deprecated version. Here, we are going to create a standalone using non-deprecated `MySQL`  version `8.0.20`.

**Deploy MySQL Standalone:**

In this section, we are going to deploy a MySQL standalone. Then, in the next section, we will update the resources of the database server using vertical scaling. Below is the YAML of the `MySQL` cr that we are going to create,

```yaml
apiVersion: kubedb.com/v1alpha2
kind: MySQL
metadata:
  name: my-standalone
  namespace: demo
spec:
  version: "8.0.20"
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  terminationPolicy: WipeOut
```

Let's create the `MySQL` cr we have shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/day-2-operations/verticalscaling/standalone.yaml
mysql.kubedb.com/my-standalone created
```

**Check Standalone Ready to Scale:**

`KubeDB` operator watches for `MySQL` objects using Kubernetes API. When a `MySQL` object is created, `KubeDB` operator will create a new StatefulSet, Services, and Secrets, etc.
Now, watch `MySQL` is going to  `Running` state and also watch `StatefulSet` and its pod is created and going to `Running` state,

```bash
$ watch -n 3 kubectl get my -n demo my-standalone
Every 3.0s: kubectl get my -n demo my-standalone                 suaas-appscode: Wed Jul  1 17:48:14 2020

NAME            VERSION   STATUS    AGE
my-standalone   8.0.20    Running   2m58s

$ watch -n 3 kubectl get sts -n demo my-standalone
Every 3.0s: kubectl get sts -n demo my-standalone                suaas-appscode: Wed Jul  1 17:48:52 2020

NAME            READY   AGE
my-standalone   1/1     3m36s

$ watch -n 3 kubectl get pod -n demo my-standalone-0
Every 3.0s: kubectl get pod -n demo my-standalone-0              suaas-appscode: Wed Jul  1 17:50:18 2020

NAME              READY   STATUS    RESTARTS   AGE
my-standalone-0   1/1     Running   0          5m1s
```

Let's check the above Pod containers resources,

```bash
$ kubectl get pod -n demo my-standalone-0 -o json | jq '.spec.containers[].resources'
{}
```

You can see the Pod has empty resources that mean the scheduler will choose a random node to place the container of the Pod on by default

We are ready to apply a horizontal scale on this standalone database.

#### Vertical Scaling

Here, we are going to update the resources of the standalone to meet up with the desired resources after scaling.

**Create MySQLOpsRequest:**

In order to update the resources of your database, you have to create a `MySQLOpsRequest` cr with your desired resources after scaling. Below is the YAML of the `MySQLOpsRequest` cr that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MySQLOpsRequest
metadata:
  name: my-scale-standalone
  namespace: demo
spec:
  type: VerticalScaling  
  databaseRef:
    name: my-standalone
  verticalScaling:
    mysql:
      requests:
        memory: "200Mi"
        cpu: "0.1"
      limits:
        memory: "300Mi"
        cpu: "0.2"
```

Here,

- `spec.databaseRef.name` specifies that we are performing operation on `my-group` `MySQL` database.
- `spec.type` specifies that we are performing `VerticalScaling` on our database.
- `spec.VerticalScaling.mysql` specifies the expected mysql container resources after scaling.

Let's create the `MySQLOpsRequest` cr we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/day-2operations/vertical_scale_standalone.yaml
mysqlopsrequest.ops.kubedb.com/my-scale-standalone created
```

**Verify MySQL Standalone resources updated successfully:**

If everything goes well, `KubeDB` enterprise operator will update the resources of the StatefulSet's `Pod` containers. After a successful scaling process is done, the `KubeDB` enterprise operator updates the resources of the `MySQL` object.

First, we will wait for `MySQLOpsRequest` to be successful.  Run the following command to watch `MySQlOpsRequest` cr,

```bash
$ watch -n 3 kubectl get myops -n demo my-scale-standalone
Every 3.0s: kubectl get myops -n demo my-sc...  suaas-appscode: Wed Aug 12 17:21:42 2020

NAME                  TYPE              STATUS       AGE
my-scale-standalone   VerticalScaling   Successful   2m15s
```

We can see from the above output that the `MySQLOpsRequest` has succeeded. If we describe the `MySQLOpsRequest`, we shall see that the standalone resources are updated.

```bash
$ kubectl describe myops -n demo my-scale-standalone
Name:         my-scale-standalone
Namespace:    demo
Labels:       <none>
Annotations:  API Version:  ops.kubedb.com/v1alpha1
Kind:         MySQLOpsRequest
Metadata:
  Creation Timestamp:  2020-08-12T11:19:27Z
  Finalizers:
    mysql.ops.kubedb.com
  Generation:  2
  ...
  Resource Version:  2359
  Self Link:         /apis/ops.kubedb.com/v1alpha1/namespaces/demo/mysqlopsrequests/my-scale-standalone
  UID:               b85c9b47-9557-405d-b891-2f7bc1010db3
Spec:
  Database Ref:
    Name:                my-standalone
  Stateful Set Ordinal:  0
  Type:                  VerticalScaling
  Vertical Scaling:
    Mysql:
      Limits:
        Cpu:     0.2
        Memory:  300Mi
      Requests:
        Cpu:     0.1
        Memory:  200Mi
Status:
  Conditions:
    Last Transition Time:  2020-08-12T11:19:27Z
    Message:               Controller has started to Progress the MySQLOpsRequest: demo/my-scale-standalone
    Observed Generation:   1
    Reason:                OpsRequestProgressingStarted
    Status:                True
    Type:                  Progressing
    Last Transition Time:  2020-08-12T11:19:27Z
    Message:               Controller has successfully Halted the MySQL database: demo/my-standalone 
    Observed Generation:   1
    Reason:                SuccessfullyHaltedDatabase
    Status:                True
    Type:                  HaltDatabase
    Last Transition Time:  2020-08-12T11:19:27Z
    Message:               Vertical scaling started in MySQL: demo/my-standalone for MySQLOpsRequest: my-scale-standalone
    Observed Generation:   1
    Reason:                VerticalScalingStarted
    Status:                True
    Type:                  Scaling
    Last Transition Time:  2020-08-12T11:21:27Z
    Message:               Vertical scaling performed successfully in MySQL: demo/my-standalone for MySQLOpsRequest: my-scale-standalone
    Observed Generation:   1
    Reason:                SuccessfullyPerformedVerticalScaling
    Status:                True
    Type:                  VerticalScaling
    Last Transition Time:  2020-08-12T11:21:27Z
    Message:               Controller has successfully Resumed the MySQL database: demo/my-standalone
    Observed Generation:   2
    Reason:                SuccessfullyResumedDatabase
    Status:                True
    Type:                  ResumeDatabase
    Last Transition Time:  2020-08-12T11:21:27Z
    Message:               Controller has successfully scaled/upgraded the MySQL demo/my-scale-standalone
    Observed Generation:   2
    Reason:                OpsRequestProcessedSuccessfully
    Status:                True
    Type:                  Successful
  Observed Generation:     2
  Phase:                   Successful
Events:
  Type    Reason      Age    From                        Message
  ----    ------      ----   ----                        -------
  Normal  Starting    2m44s  KubeDB Enterprise Operator  Start processing for MySQLOpsRequest: demo/my-scale-standalone
  Normal  Starting    2m44s  KubeDB Enterprise Operator  Pausing MySQL databse: demo/my-standalone
  Normal  Successful  2m44s  KubeDB Enterprise Operator  Successfully halted MySQL database: demo/my-standalone for MySQLOpsRequest: my-scale-standalone
  Normal  Starting    2m44s  KubeDB Enterprise Operator  Vertical scaling started in MySQL: demo/my-standalone for MySQLOpsRequest: my-scale-standalone
  Normal  Successful  64s    KubeDB Enterprise Operator  Image successfully upgraded for standalone/master: demo/my-standalone-0
  Normal  Successful  44s    KubeDB Enterprise Operator  Vertical scaling performed successfully in MySQL: demo/my-standalone for MySQLOpsRequest: my-scale-standalone
  Normal  Successful  44s    KubeDB Enterprise Operator  Image successfully upgraded for standalone/master: demo/my-standalone-0
  Normal  Starting    44s    KubeDB Enterprise Operator  Resuming MySQL database: demo/my-standalone
  Normal  Successful  44s    KubeDB Enterprise Operator  Successfully resumed MySQL database: demo/my-standalone
  Normal  Successful  44s    KubeDB Enterprise Operator  Controller has Successfully scaled the MySQL database: demo/my-standalone
```

Now, we are going to verify whether the resources of the standalone has updated to meet up the desired state, Let's check,

```bash
$ kubectl get pod -n demo my-standalone-0 -o json | jq '.spec.containers[].resources'
{
  "limits": {
    "cpu": "200m",
    "memory": "300Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "200Mi"
  }
}

```

The above output verifies that we have successfully scaled up the resources of the standalone.

## Cleaning Up

To clean up the Kubernetes resources created by this tutorial, run:

```bash
kubectl delete my -n demo my-standalone
kubectl delete myops -n demo  my-scale-standalone
```