---
title: Run Memcached with Custom RBAC resources
menu:
  docs_v2025.5.30:
    identifier: mc-custom-rbac-quickstart
    name: Custom RBAC
    parent: mc-custom-rbac
    weight: 10
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# Using Custom RBAC resources

KubeDB (version 0.13.0 and higher) supports finer user control over role based access permissions provided to a Memcached instance. This tutorial will show you how to use KubeDB to run Memcached database with custom RBAC resources.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2025.5.30/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> Note: YAML files used in this tutorial are stored in [docs/examples/memcached](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/memcached) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Overview

KubeDB allows users to provide custom RBAC resources, namely, `ServiceAccount`, `Role`, and `RoleBinding` for Memcached. This is provided via the `spec.podTemplate.spec.serviceAccountName` field in Memcached crd. If this field is left empty, the KubeDB operator will create a service account name matching Memcached crd name. Role and RoleBinding that provide necessary access permissions will also be generated automatically for this service account.

If a service account name is given, but there's no existing service account by that name, the KubeDB operator will create one, and Role and RoleBinding that provide necessary access permissions will also be generated for this service account.

If a service account name is given, and there's an existing service account by that name, the KubeDB operator will use that existing service account. Since this service account is not managed by KubeDB, users are responsible for providing necessary access permissions manually.

This guide will show you how to create custom `Service Account`, `Role`, and `RoleBinding` for a Memcached instance named `quick-memcached` to provide the bare minimum access permissions.

## Custom RBAC for Memcached

At first, let's create a `Service Acoount` in `demo` namespace.

```bash
$ kubectl create serviceaccount -n demo my-custom-serviceaccount
serviceaccount/my-custom-serviceaccount created
```

It should create a service account.

```yaml
$ kubectl get serviceaccount -n demo my-custom-serviceaccount -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: "2019-05-30T04:23:39Z"
  name: my-custom-serviceaccount
  namespace: demo
  resourceVersion: "21657"
  selfLink: /api/v1/namespaces/demo/serviceaccounts/myserviceaccount
  uid: b2ec2b05-8292-11e9-8d10-080027a8b217
secrets:
- name: myserviceaccount-token-t8zxd
```

Now, we need to create a role that has necessary access permissions for the Memcached instance named `quick-memcached`.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/memcached/custom-rbac/mc-custom-role.yaml
role.rbac.authorization.k8s.io/my-custom-role created
```

Below is the YAML for the Role we just created.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: my-custom-role
  namespace: demo
rules:
- apiGroups:
  - policy
  resourceNames:
  - memcached-db
  resources:
  - podsecuritypolicies
  verbs:
  - use
```

This permission is required for Memcached pods running on PSP enabled clusters.

Now create a `RoleBinding` to bind this `Role` with the already created service account.

```bash
$ kubectl create rolebinding my-custom-rolebinding --role=my-custom-role --serviceaccount=demo:my-custom-serviceaccount --namespace=demo
rolebinding.rbac.authorization.k8s.io/my-custom-rolebinding created

```

It should bind `my-custom-role` and `my-custom-serviceaccount` successfully.

```yaml
$ kubectl get rolebinding -n demo my-custom-rolebinding -o yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: "kubectl get rolebinding -n demo my-custom-rolebinding -o yaml"
  name: my-custom-rolebinding
  namespace: demo
  resourceVersion: "1405"
  selfLink: /apis/rbac.authorization.k8s.io/v1/namespaces/demo/rolebindings/my-custom-rolebinding
  uid: 123afc02-8297-11e9-8d10-080027a8b217
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: my-custom-role
subjects:
- kind: ServiceAccount
  name: my-custom-serviceaccount
  namespace: demo

```

Now, create a Memcached crd specifying `spec.podTemplate.spec.serviceAccountName` field to `my-custom-serviceaccount`.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/memcached/custom-rbac/mc-custom-db.yaml
memcached.kubedb.com/quick-memcached created
```

Below is the YAML for the Memcached crd we just created.

```yaml
apiVersion: kubedb.com/v1
kind: Memcached
metadata:
  name: quick-memcached
  namespace: demo
spec:
  replicas: 1
  version: "1.6.22"
  podTemplate:
    spec:
      serviceAccountName: my-custom-serviceaccount
      containers:
        - name: memcached
          resources:
            limits:
              cpu: 500m
              memory: 128Mi
            requests:
              cpu: 250m
              memory: 64Mi
  deletionPolicy: DoNotTerminate

```

Now, wait a few minutes. the KubeDB operator will create necessary petset, services, secret etc. If everything goes well, we should see that a pod with the name `quick-memcached-0` has been created.

Check that the pod is running:

```bash
$ kubectl get pods -n demo
NAME                READY   STATUS    RESTARTS   AGE
quick-memcached-0   1/1     Running   0          5m52s
```

## Reusing Service Account

An existing service account can be reused in another Memcached instance. No new access permission is required to run the new Memcached instance.

Now, create Memcached crd `minute-memcached` using the existing service account name `my-custom-serviceaccount` in the `spec.podTemplate.spec.serviceAccountName` field.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/memcached/custom-rbac/mc-custom-db-two.yaml
memcached.kubedb.com/quick-memcached created
```

Below is the YAML for the Memcached crd we just created.

```yaml
apiVersion: kubedb.com/v1
kind: Memcached
metadata:
  name: minute-memcached
  namespace: demo
spec:
  replicas: 1
  version: "1.6.22"
  podTemplate:
    spec:
      serviceAccountName: my-custom-serviceaccount
      containers:
        - name: memcached
          resources:
            limits:
              cpu: 500m
              memory: 128Mi
            requests:
              cpu: 250m
              memory: 64Mi
  deletionPolicy: DoNotTerminate

```

Now, wait a few minutes. the KubeDB operator will create necessary PVC, petset, services, secret etc. If everything goes well, we should see that a pod with the name `minute-memcached-0` has been created.

Check that the pod is running:

```bash
$ kubectl get pods -n demo
NAME                READY   STATUS    RESTARTS   AGE
minute-memcached-0  1/1     Running   0          5m52s
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl patch -n demo mc/quick-memcached -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
memcached.kubedb.com/quick-memcached patched

$ kubectl delete -n demo mc/quick-memcached
memcached.kubedb.com "quick-memcached" deleted

$ kubectl patch -n demo mc/minute-memcached -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
memcached.kubedb.com/minute-memcached patched

$ kubectl delete -n demo mc/minute-memcached
memcached.kubedb.com "minute-memcached" deleted

$ kubectl delete -n demo role my-custom-role
role.rbac.authorization.k8s.io "my-custom-role" deleted

$ kubectl delete -n demo rolebinding my-custom-rolebinding
rolebinding.rbac.authorization.k8s.io "my-custom-rolebinding" deleted

$ kubectl delete sa -n demo my-custom-serviceaccount
serviceaccount "my-custom-serviceaccount" deleted

$ kubectl delete ns demo
namespace "demo" deleted
```

If you would like to uninstall the KubeDB operator, please follow the steps [here](/docs/v2025.5.30/setup/README).

## Next Steps

- [Quickstart Memcached](/docs/v2025.5.30/guides/memcached/quickstart/quickstart) with KubeDB Operator.
- Monitor your Memcached database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.5.30/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.5.30/guides/memcached/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.5.30/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Use [kubedb cli](/docs/v2025.5.30/guides/memcached/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Memcached object](/docs/v2025.5.30/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.5.30/CONTRIBUTING).

