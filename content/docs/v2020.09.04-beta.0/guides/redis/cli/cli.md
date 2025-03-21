---
title: CLI | KubeDB
menu:
  docs_v2020.09.04-beta.0:
    identifier: rd-cli-cli
    name: Quickstart
    parent: rd-cli-redis
    weight: 10
menu_name: docs_v2020.09.04-beta.0
section_menu_id: guides
info:
  version: v2020.09.04-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.09.04-beta.0/concepts/README).

# Manage KubeDB objects using CLIs

## KubeDB CLI

KubeDB comes with its own cli. It is called `kubedb` cli. `kubedb` can be used to manage any KubeDB object. `kubedb` cli also performs various validations to improve ux. To install KubeDB cli on your workstation, follow the steps [here](/docs/v2020.09.04-beta.0/setup/README).

### How to Create objects

`kubectl create` creates a database CRD object in `default` namespace by default. Following command will create a Redis object as specified in `redis.yaml`.

```console
$ kubectl create -f redis-demo.yaml
redis.kubedb.com/redis-demo created
```

You can provide namespace as a flag `--namespace`. Provided namespace should match with namespace specified in input file.

```console
$ kubectl create -f redis-demo.yaml --namespace=kube-system
redis.kubedb.com/redis-demo created
```

`kubectl create` command also considers `stdin` as input.

```console
cat redis-demo.yaml | kubectl create -f -
```

### How to List Objects

`kubectl get` command allows users to list or find any KubeDB object. To list all Redis objects in `default` namespace, run the following command:

```console
$ kubectl get redis
NAME         VERSION   STATUS    AGE
redis-demo   4.0-v1    Running   13s
redis-dev    4.0-v1    Running   13s
redis-prod   4.0-v1    Running   13s
redis-qa     4.0-v1    Running   13s
```

To get YAML of an object, use `--output=yaml` flag.

```yaml
$ kubectl get redis redis-demo --output=yaml
apiVersion: kubedb.com/v1alpha1
kind: Redis
metadata:
  creationTimestamp: 2018-10-01T08:14:27Z
  finalizers:
  - kubedb.com
  generation: 1
  labels:
    kubedb: cli-demo
  name: redis-demo
  namespace: default
  resourceVersion: "18201"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/redises/redis-demo
  uid: 039aeaa1-c552-11e8-9ba7-0800274bef12
spec:
  mode: Standalone
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
        storage: 1Gi
    storageClassName: standard
  storageType: Durable
  terminationPolicy: Pause
  updateStrategy:
    type: RollingUpdate
  version: 4.0-v1
status:
  observedGeneration: 1$7916315637361465932
  phase: Running
```

To get JSON of an object, use `--output=json` flag.

```console
kubectl get redis redis-demo --output=json
```

To list all KubeDB objects, use following command:

```console
$ kubectl get all -o wide
NAME                          VERSION   STATUS    AGE
redis.kubedb.com/redis-demo   4.0-v1    Running   3m
redis.kubedb.com/redis-dev    4.0-v1    Running   3m
redis.kubedb.com/redis-prod   4.0-v1    Running   3m
redis.kubedb.com/redis-qa     4.0-v1    Running   3m
```

Flag `--output=wide` is used to print additional information.

List command supports short names for each object types. You can use it like `kubectl get <short-name>`. Below are the short name for KubeDB objects:

- Redis: `rd`
- DormantDatabase: `drmn`

You can print labels with objects. The following command will list all Redis with their corresponding labels.

```console
$ kubectl get rd --show-labels
NAME         VERSION   STATUS    AGE       LABELS
redis-demo   4.0-v1    Running   4m        kubedb=cli-demo
```

To print only object name, run the following command:

```console
$ kubectl get all -o name
redis/redis-demo
redis/redis-dev
redis/redis-prod
redis/redis-qa
```

### How to Describe Objects

`kubectl dba describe` command allows users to describe any KubeDB object. The following command will describe Redis server `redis-demo` with relevant information.

```console
$ kubectl dba describe rd redis-demo
Name:               redis-demo
Namespace:          default
CreationTimestamp:  Mon, 01 Oct 2018 14:14:27 +0600
Labels:             kubedb=cli-demo
Annotations:        <none>
Replicas:           1  total
Status:             Running
  StorageType:      Durable
Volume:
  StorageClass:  standard
  Capacity:      1Gi
  Access Modes:  RWO

StatefulSet:
  Name:               redis-demo
  CreationTimestamp:  Mon, 01 Oct 2018 14:14:31 +0600
  Labels:               kubedb=cli-demo
                        kubedb.com/kind=Redis
                        kubedb.com/name=redis-demo
  Annotations:        <none>
  Replicas:           824640807604 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:         redis-demo
  Labels:         kubedb.com/kind=Redis
                  kubedb.com/name=redis-demo
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.102.148.196
  Port:         db  6379/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.4:6379

No Snapshots.

Events:
  Type    Reason      Age   From            Message
  ----    ------      ----  ----            -------
  Normal  Successful  5m    Redis operator  Successfully created Service
  Normal  Successful  5m    Redis operator  Successfully created StatefulSet
  Normal  Successful  5m    Redis operator  Successfully created Redis
  Normal  Successful  5m    Redis operator  Successfully patched StatefulSet
  Normal  Successful  5m    Redis operator  Successfully patched Redis
```

`kubectl dba describe` command provides following basic information about a Redis server.

- StatefulSet
- Storage (Persistent Volume)
- Service
- Monitoring system (If available)

To hide events on KubeDB object, use flag `--show-events=false`

To describe all Redis objects in `default` namespace, use following command

```console
kubectl dba describe rd
```

To describe all Redis objects from every namespace, provide `--all-namespaces` flag.

```console
kubectl dba describe rd --all-namespaces
```

To describe all KubeDB objects from every namespace, use the following command:

```console
kubectl dba describe all --all-namespaces
```

You can also describe KubeDB objects with matching labels. The following command will describe all Redis objects with specified labels from every namespace.

```console
kubectl dba describe rd --all-namespaces --selector='group=dev'
```

To learn about various options of `describe` command, please visit [here](/docs/v2020.09.04-beta.0/reference/kubectl-dba_describe).

### How to Edit Objects

`kubectl edit` command allows users to directly edit any KubeDB object. It will open the editor defined by _KUBEDB_EDITOR_, or _EDITOR_ environment variables, or fall back to `nano`.

Lets edit an existing running Redis object to setup [Monitoring](/docs/v2020.09.04-beta.0/guides/redis/monitoring/using-builtin-prometheus). The following command will open Redis `redis-demo` in editor.

```console
$ kubectl edit rd redis-demo
#spec:
#  monitor:
#    agent: prometheus.io/builtin

redis "redis-demo" edited
```

#### Edit Restrictions

Various fields of a KubeDB object can't be edited using `edit` command. The following fields are restricted from updates for all KubeDB objects:

- apiVersion
- kind
- metadata.name
- metadata.namespace

If StatefulSets exists for a Redis server, following fields can't be modified as well.

- spec.storageType
- spec.storage
- spec.podTemplate.spec.nodeSelector
- spec.podTemplate.spec.env

For DormantDatabase, `spec.origin` can't be edited using `kubectl edit`

### How to Delete Objects

`kubectl delete` command will delete an object in `default` namespace by default unless namespace is provided. The following command will delete a Redis `redis-dev` in default namespace

```console
$ kubectl delete redis redis-dev
redis.kubedb.com "redis-dev" deleted
```

You can also use YAML files to delete objects. The following command will delete a redis using the type and name specified in `redis.yaml`.

```console
$ kubectl delete -f redis-demo.yaml
redis.kubedb.com "redis-dev" deleted
```

`kubectl delete` command also takes input from `stdin`.

```console
cat redis-demo.yaml | kubectl delete -f -
```

To delete database with matching labels, use `--selector` flag. The following command will delete redis with label `redis.kubedb.com/name=redis-demo`.

```console
kubectl delete redis -l redis.kubedb.com/name=redis-demo
```

## Using Kubectl

You can use Kubectl with KubeDB objects like any other CRDs. Below are some common examples of using Kubectl with KubeDB objects.

```console
# List objects
$ kubectl get redis
$ kubectl get redis.kubedb.com

# Delete objects
$ kubectl delete redis <name>
```

## Next Steps

- Learn how to use KubeDB to run a Redis server [here](/docs/v2020.09.04-beta.0/guides/redis/README).
- Learn how to use custom configuration in Redis with KubeDB [here](/docs/v2020.09.04-beta.0/guides/redis/custom-config/using-custom-config)
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.09.04-beta.0/CONTRIBUTING).
