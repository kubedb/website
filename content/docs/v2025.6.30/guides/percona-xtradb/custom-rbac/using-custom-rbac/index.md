---
title: Run PerconaXtraDB with Custom RBAC resources
menu:
  docs_v2025.6.30:
    identifier: guides-perconaxtradb-customrbac-usingcustomrbac
    name: Custom RBAC
    parent: guides-perconaxtradb-customrbac
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

# Using Custom RBAC resources

KubeDB (version 0.13.0 and higher) supports finer user control over role based access permissions provided to a PerconaXtraDB instance. This tutorial will show you how to use KubeDB to run PerconaXtraDB instance with custom RBAC resources.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2025.6.30/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> Note: YAML files used in this tutorial are stored in [here](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/percona-xtradb/custom-rbac/using-custom-rbac/examples) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Overview

KubeDB allows users to provide custom RBAC resources, namely, `ServiceAccount`, `Role`, and `RoleBinding` for PerconaXtraDB. This is provided via the `spec.podTemplate.spec.serviceAccountName` field in PerconaXtraDB crd.   If this field is left empty, the KubeDB operator will create a service account name matching PerconaXtraDB crd name. Role and RoleBinding that provide necessary access permissions will also be generated automatically for this service account.

If a service account name is given, but there's no existing service account by that name, the KubeDB operator will create one, and Role and RoleBinding that provide necessary access permissions will also be generated for this service account.

If a service account name is given, and there's an existing service account by that name, the KubeDB operator will use that existing service account. Since this service account is not managed by KubeDB, users are responsible for providing necessary access permissions manually.

This guide will show you how to create custom `Service Account`, `Role`, and `RoleBinding` for a PerconaXtraDB instance named `quick-postges` to provide the bare minimum access permissions.

## Custom RBAC for PerconaXtraDB

At first, let's create a `Service Acoount` in `demo` namespace.

```bash
$ kubectl create serviceaccount -n demo px-custom-serviceaccount
serviceaccount/px-custom-serviceaccount created
```

It should create a service account.

```bash
$ kubectl get serviceaccount -n demo px-custom-serviceaccount -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: "2021-03-18T04:38:59Z"
  name: px-custom-serviceaccount
  namespace: demo
  resourceVersion: "84669"
  selfLink: /api/v1/namespaces/demo/serviceaccounts/px-custom-serviceaccount
  uid: 788bd6c6-3eae-4797-b6ca-5722ef64c9dc
secrets:
- name: px-custom-serviceaccount-token-jnhvd
```

Now, we need to create a role that has necessary access permissions for the PerconaXtraDB instance named `sample-pxc`.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/percona-xtradb/custom-rbac/using-custom-rbac/examples/px-custom-role.yaml
role.rbac.authorization.k8s.io/px-custom-role created
```

Below is the YAML for the Role we just created.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: px-custom-role
  namespace: demo
rules:
- apiGroups:
  - policy
  resourceNames:
  - perconaxtra-db
  resources:
  - podsecuritypolicies
  verbs:
  - use
```

This permission is required for PerconaXtraDB pods running on PSP enabled clusters.

Now create a `RoleBinding` to bind this `Role` with the already created service account.

```bash
$ kubectl create rolebinding px-custom-rolebinding --role=px-custom-role --serviceaccount=demo:px-custom-serviceaccount --namespace=demo
rolebinding.rbac.authorization.k8s.io/px-custom-rolebinding created
```

It should bind `px-custom-role` and `px-custom-serviceaccount` successfully.

SO, All required resources for RBAC are created.

```bash
$ kubectl get serviceaccount,role,rolebindings -n demo
NAME                                      SECRETS   AGE
serviceaccount/default                    1         38m
serviceaccount/px-custom-serviceaccount   1         36m

NAME                                            CREATED AT
role.rbac.authorization.k8s.io/px-custom-role   2021-03-18T05:13:27Z

NAME                                                          ROLE                  AGE
rolebinding.rbac.authorization.k8s.io/px-custom-rolebinding   Role/px-custom-role   79s
```

Now, create a PerconaXtraDB crd specifying `spec.podTemplate.spec.serviceAccountName` field to `px-custom-serviceaccount`.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/percona-xtradb/custom-rbac/using-custom-rbac/examples/px-custom-db.yaml
perconaxtradb.kubedb.com/sample-pxc created
```

Below is the YAML for the PerconaXtraDB crd we just created.

```yaml
apiVersion: kubedb.com/v1
kind: PerconaXtraDB
metadata:
  name: sample-pxc
  namespace: demo
spec:
  replicas: 3
  version: "8.0.40"
  storageType: Durable
  podTemplate:
    spec:
      serviceAccountName: px-custom-serviceaccount
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  deletionPolicy: WipeOut
```

Now, wait a few minutes. the KubeDB operator will create necessary PVC, PetSet, services, secret etc. If everything goes well, we should see that a pod with the name `sample-pxc-0` has been created.

Check that the petset's pod is running

```bash
$ kubectl get pod -n demo
NAME           READY   STATUS    RESTARTS   AGE
sample-pxc-0   2/2     Running   0          84m
sample-pxc-1   2/2     Running   0          84m
sample-pxc-2   2/2     Running   0          84m

```

Check the PerconaXtraDB custom resource to see if the database cluster is ready:

```bash
~ $ kubectl get perconaxtradb --all-namespaces
NAMESPACE   NAME         VERSION   STATUS   AGE
demo        sample-pxc   8.0.40    Ready    83m
```

## Reusing Service Account

An existing service account can be reused in another PerconaXtraDB instance. No new access permission is required to run the new PerconaXtraDB instance.

Now, create PerconaXtraDB crd `another-perconaxtradb` using the existing service account name `px-custom-serviceaccount` in the `spec.podTemplate.spec.serviceAccountName` field.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/percona-xtradb/custom-rbac/using-custom-rbac/examples/px-custom-db-2.yaml
perconaxtradb.kubedb.com/another-perconaxtradb created
```

Below is the YAML for the PerconaXtraDB crd we just created.

```yaml
apiVersion: kubedb.com/v1
kind: PerconaXtraDB
metadata:
  name: another-perconaxtradb
  namespace: demo
spec:
  replicas: 3
  version: "8.0.40"
  storageType: Durable
  podTemplate:
    spec:
      serviceAccountName: px-custom-serviceaccount
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  deletionPolicy: WipeOut
```

Now, wait a few minutes. the KubeDB operator will create necessary PVC, petset, services, secret etc. If everything goes well, we should see that a pod with the name `another-perconaxtradb` has been created.

Check that the petset's pod is running

```bash
$ kubectl get pod -n demo another-perconaxtradb-0
NAME                READY   STATUS    RESTARTS   AGE
another-perconaxtradb-0   2/2     Running   0          37s
```

Check the PerconaXtraDB custom resource to see if the database cluster is ready:

```bash
~ $ kubectl get perconaxtradb --all-namespaces
NAMESPACE                NAME         VERSION   STATUS   AGE
another-perconaxtradb    sample-pxc   8.0.40    Ready    83m
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl delete perconaxtradb -n demo sample-pxc
perconaxtradb.kubedb.com "sample-pxc" deleted
$ kubectl delete perconaxtradb -n demo another-perconaxtradb
perconaxtradb.kubedb.com "another-perconaxtradb" deleted
$ kubectl delete -n demo role px-custom-role
role.rbac.authorization.k8s.io "px-custom-role" deleted
$ kubectl delete -n demo rolebinding px-custom-rolebinding
rolebinding.rbac.authorization.k8s.io "px-custom-rolebinding" deleted
$ kubectl delete sa -n demo px-custom-serviceaccount
serviceaccount "px-custom-serviceaccount" deleted
$ kubectl delete ns demo
namespace "demo" deleted
```


