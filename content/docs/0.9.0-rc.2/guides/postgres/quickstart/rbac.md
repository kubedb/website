---
title: RBAC for PostgreSQL
menu:
  docs_0.9.0-rc.2:
    identifier: pg-rbac-quickstart
    name: RBAC
    parent: pg-quickstart-postgres
    weight: 15
menu_name: docs_0.9.0-rc.2
section_menu_id: guides
info:
  version: 0.9.0-rc.2
---

> New to KubeDB? Please start [here](/docs/0.9.0-rc.2/concepts/README).

# RBAC Permissions for Postgres

If RBAC is enabled in clusters, some PostgreSQL specific RBAC permissions are required. These permissions are required for Leader Election process of PostgreSQL clustering.

Here is the list of additional permissions required by StatefulSet of Postgres:

| Kubernetes Resource | Resource Names                 | Permission required |
|---------------------|--------------------------------|---------------------|
| statefulsets        | `{postgres-name}`              | get                 |
| pods                |                                | list, patch         |
| configmaps          |                                | create              |
| configmaps          | `{postgres-name}-leader-lock`  | get, update         |

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.9.0-rc.2/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace "demo" created

$ kubectl get ns demo
NAME    STATUS  AGE
demo    Active  5s
```

> Note: Yaml files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/cli/tree/master/docs/examples/postgres) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Create a PostgreSQL database

Below is the Postgres object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: quick-postgres
  namespace: demo
spec:
  version: "10.2"
  doNotPause: true
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
```

Create above Postgres object with following command

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/postgres/quickstart/quick-postgres.yaml
postgres "quick-postgres" created
```

When this Postgres object is created, KubeDB operator creates Role, ServiceAccount and RoleBinding with the matching PostgreSQL name and uses that ServiceAccount name in the corresponding StatefulSet.

Let's see what KubeDB operator has created for additional RBAC permission

#### Role

KubeDB operator create a Role object `quick-postgres` in same namespace as Postgres object.

```console
$ kubectl get role -n demo quick-postgres -o yaml
```

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  creationTimestamp: 2018-09-03T13:38:57Z
  name: quick-postgres
  namespace: demo
  ...
rules:
- apiGroups:
  - apps
  resourceNames:
  - quick-postgres
  resources:
  - statefulsets
  verbs:
  - get
- apiGroups:
  - ""
  resources:
  - pods
  verbs:
  - list
  - patch
- apiGroups:
  - ""
  resources:
  - configmaps
  verbs:
  - create
- apiGroups:
  - ""
  resourceNames:
  - quick-postgres-leader-lock
  resources:
  - configmaps
  verbs:
  - get
  - update
```

#### ServiceAccount

KubeDB operator create a ServiceAccount object `quick-postgres` in same namespace as Postgres object.

```console
$ kubectl get serviceaccount -n demo quick-postgres -o yaml
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2018-09-03T13:38:57Z
  name: quick-postgres
  namespace: demo
  ...
secrets:
- name: quick-postgres-token-hf8zn
```

This ServiceAccount is used in StatefulSet created for Postgres object.

#### RoleBinding

KubeDB operator create a RoleBinding object `quick-postgres` in same namespace as Postgres object.

```console
$ kubectl get rolebinding -n demo quick-postgres -o yaml
```

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: 2018-09-03T13:38:58Z
  name: quick-postgres
  namespace: demo
  ...
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: quick-postgres
subjects:
- kind: ServiceAccount
  name: quick-postgres
  namespace: demo
```

This  object binds Role `quick-postgres` with ServiceAccount `quick-postgres`.

Leader Election process get access to Kubernetes API using these RBAC permissions.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubectl patch -n demo pg/quick-postgres -p '{"spec":{"doNotPause":false}}' --type="merge"
$ kubectl delete -n demo pg/quick-postgres

$ kubectl patch -n demo drmn/quick-postgres -p '{"spec":{"wipeOut":true}}' --type="merge"
$ kubectl delete -n demo drmn/quick-postgres

$ kubectl delete ns demo
```
