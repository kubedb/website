---
title: CLI | KubeDB
menu:
  docs_v2025.6.30:
    identifier: mc-cli-cli
    name: Quickstart
    parent: mc-cli-memcached
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Manage KubeDB objects using CLIs

## KubeDB CLI

KubeDB comes with its own cli. It is called `kubedb` cli. `kubedb` can be used to manage any KubeDB object. `kubedb` cli also performs various validations to improve ux. To install KubeDB cli on your workstation, follow the steps [here](/docs/v2025.6.30/setup/README).

### How to Create objects

`kubectl create` creates a database CRD object in `default` namespace by default. Following command will create a Memcached object as specified in `memcached.yaml`.

```bash
$ kubectl create -f memcached-demo.yaml
memcached.kubedb.com/memcached-demo created
```

You can provide namespace as a flag `--namespace`. Provided namespace should match with namespace specified in input file.

```bash
$ kubectl create -f memcached-demo.yaml --namespace=kube-system
memcached.kubedb.com/memcached-demo created
```

`kubectl create` command also considers `stdin` as input.

```bash
cat memcached-demo.yaml | kubectl create -f -
```

### How to List Objects

`kubectl get` command allows users to list or find any KubeDB object. To list all Memcached objects in `default` namespace, run the following command:

```bash
$ kubectl get memcached
NAME             VERSION    STATUS    AGE
memcached-demo   1.6.22     Running   40s
memcached-dev    1.6.22     Running   40s
memcached-prod   1.6.22     Running   40s
memcached-qa     1.6.22     Running   40s
```

To get YAML of an object, use `--output=yaml` flag.

```yaml
$ kubectl get memcached memcached-demo --output=yaml
apiVersion: kubedb.com/v1
kind: Memcached
metadata:
  creationTimestamp: 2018-10-04T05:58:57Z
  finalizers:
  - kubedb.com
  generation: 1
  labels:
    kubedb: cli-demo
  name: memcached-demo
  namespace: demo
  resourceVersion: "6883"
  selfLink: /apis/kubedb.com/v1/namespaces/default/memcacheds/memcached-demo
  uid: 953df4d1-c79a-11e8-bb11-0800272ad446
spec:
  podTemplate:
    controller: {}
    metadata: {}
    spec:
      containers:
      - name: memcached
        resources:
        limits:
          cpu: 500m
          memory: 128Mi
        requests:
          cpu: 250m
          memory: 64Mi
  replicas: 1
  deletionPolicy: WipeOut
  version: 1.6.22
status:
  observedGeneration: 1$7916315637361465932
  phase: Running
```

To get JSON of an object, use `--output=json` flag.

```bash
kubectl get memcached memcached-demo --output=json
```

To list all KubeDB objects, use following command:

```bash
$ kubectl get all -o wide
NAME                    VERSION     STATUS    AGE
mc/memcached-demo       1.6.22      Running   3h
mc/memcached-dev        1.6.22      Running   3h
mc/memcached-prod       1.6.22      Running   3h
mc/memcached-qa         1.6.22      Running   3h
```

Flag `--output=wide` is used to print additional information.

List command supports short names for each object types. You can use it like `kubectl get <short-name>`. Below are the short name for KubeDB objects:

- Memcached: `mc`

You can print labels with objects. The following command will list all Memcached with their corresponding labels.

```bash
$ kubectl get mc --show-labels
NAME             VERSION    STATUS    AGE       LABELS
memcached-demo   1.6.22     Running   2m        kubedb=cli-demo
```

To print only object name, run the following command:

```bash
$ kubectl get all -o name
memcached/memcached-demo
memcached/memcached-dev
memcached/memcached-prod
memcached/memcached-qa
```

### How to Describe Objects

`kubectl dba describe` command allows users to describe any KubeDB object. The following command will describe Memcached server `memcached-demo` with relevant information.

```bash
$ kubectl dba describe mc memcached-demo
Name:               memcached-demo
Namespace:          default
CreationTimestamp:  Thu, 04 Oct 2018 11:58:57 +0600
Labels:             kubedb=cli-demo
Annotations:        <none>
Replicas:           1  total
Status:             Running

Deployment:
  Name:               memcached-demo
  CreationTimestamp:  Thu, 04 Oct 2018 11:58:59 +0600
  Labels:               kubedb=cli-demo
                        app.kubernetes.io/name=memcacheds.kubedb.com
                        app.kubernetes.io/instance=memcached-demo
  Annotations:          deployment.kubernetes.io/revision=1
  Replicas:           1 desired | 1 updated | 1 total | 1 available | 0 unavailable
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:         memcached-demo
  Labels:         kubedb=cli-demo
                  app.kubernetes.io/name=memcacheds.kubedb.com
                  app.kubernetes.io/instance=memcached-demo
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.102.208.191
  Port:         db  11211/TCP
  TargetPort:   db/TCP
  Endpoints:    172.17.0.4:11211,172.17.0.14:11211,172.17.0.6:11211

No Snapshots.

Events:
  Type    Reason      Age   From                Message
  ----    ------      ----  ----                -------
  Normal  Successful  2m    Memcached operator  Successfully created Service
  Normal  Successful  2m    Memcached operator  Successfully created PetSet
  Normal  Successful  2m    Memcached operator  Successfully created Memcached
  Normal  Successful  2m    Memcached operator  Successfully patched PetSet
  Normal  Successful  2m    Memcached operator  Successfully patched Memcached
```

`kubectl dba describe` command provides following basic information about a Memcached server.

- Petset
- Service
- Monitoring system (If available)

To hide events on KubeDB object, use flag `--show-events=false`

To describe all Memcached objects in `default` namespace, use following command

```bash
kubectl dba describe mc
```

To describe all Memcached objects from every namespace, provide `--all-namespaces` flag.

```bash
kubectl dba describe mc --all-namespaces
```

To describe all KubeDB objects from every namespace, use the following command:

```bash
kubectl dba describe all --all-namespaces
```

You can also describe KubeDB objects with matching labels. The following command will describe all Memcached objects with specified labels from every namespace.

```bash
kubectl dba describe mc --all-namespaces --selector='group=dev'
```

To learn about various options of `describe` command, please visit [here](/docs/v2025.6.30/reference/cli/kubectl-dba_describe).

### How to Edit Objects

`kubectl edit` command allows users to directly edit any KubeDB object. It will open the editor defined by _KUBEDB_EDITOR_, or _EDITOR_ environment variables, or fall back to `nano`.

Let's edit an existing running Memcached object to setup [Monitoring](/docs/v2025.6.30/guides/memcached/monitoring/using-builtin-prometheus). The following command will open Memcached `memcached-demo` in editor.

```bash
$ kubectl edit mc memcached-demo

#spec:
#  monitor:
#    agent: prometheus.io/builtin

memcached "memcached-demo" edited
```

#### Edit Restrictions

Various fields of a KubeDB object can't be edited using `edit` command. The following fields are restricted from updates for all KubeDB objects:

- apiVersion
- kind
- metadata.name 
- metadata.namespace
- status

If Deployment exists for a Memcached server, following fields can't be modified as well.

- spec.nodeSelector
- spec.podTemplate.spec.nodeSelector
- spec.podTemplate.spec.env

### How to Delete Objects

`kubectl delete` command will delete an object in `default` namespace by default unless namespace is provided. The following command will delete a Memcached `memcached-dev` in default namespace

```bash
$ kubectl delete memcached memcached-dev
memcached.kubedb.com "memcached-dev" deleted
```

You can also use YAML files to delete objects. The following command will delete a memcached using the type and name specified in `memcached.yaml`.

```bash
$ kubectl delete -f memcached-demo.yaml
memcached.kubedb.com "memcached-dev" deleted
```

`kubectl delete` command also takes input from `stdin`.

```bash
cat memcached-demo.yaml | kubectl delete -f -
```

To delete database with matching labels, use `--selector` flag. The following command will delete memcached with label `memcached.app.kubernetes.io/instance=memcached-demo`.

```bash
kubectl delete memcached -l memcached.app.kubernetes.io/instance=memcached-demo
```

## Using Kubectl

You can use Kubectl with KubeDB objects like any other CRDs. Below are some common examples of using Kubectl with KubeDB objects.

```bash
# List objects
$ kubectl get memcached
$ kubectl get memcached.kubedb.com

# Delete objects
$ kubectl delete memcached <name>
```

## Next Steps

- Learn how to use KubeDB to run a Memcached server [here](/docs/v2025.6.30/guides/memcached/README).
- Learn how to use custom configuration in Memcached with KubeDB [here](/docs/v2025.6.30/guides/memcached/custom-configuration/using-config-file)
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.6.30/CONTRIBUTING).
