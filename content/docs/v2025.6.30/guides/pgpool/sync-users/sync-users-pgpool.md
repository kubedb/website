---
title: Runtime users sync to Pgpool
menu:
  docs_v2025.6.30:
    identifier: pp-sync-users-pgpool
    name: Sync users pgpool
    parent: pp-sync-users
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

# Using Sync Users

KubeDB supports providing a way to add/update users to Pgpool in runtime simply by creating secret with defined keys and labels. This tutorial will show you how to use KubeDB to sync a user to Pgpool on runtime.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2025.6.30/setup/README).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: The yaml files used in this tutorial are stored in [docs/examples/pgpool](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/pgpool) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Overview

KubeDB operator allows us to sync additional Postgres users to Pgpool on runtime by setting `spec.syncUsers` to `true`, if this option is true KubeDB operator searches for secrets in the namespace of the Postgres mentioned with some certain labels. Then if the secret have username and password as key KubeDB operator will sync the username and password to Pgpool. Again not only to add a user but also this feature can also be used for updating a user's password.

At first, we need to create a secret that contains a `user` key and a `password` key which contains the `username` and `password` respectively. Also, we need to add two labels `<Appbinding name mentioned in .spec.postgresRef.name>` and `postgreses.kubedb.com`. The namespace must be `<Namespace mentioned in .spec.postgresRef.namespace>`. Below given a sample structure of the secret.

Example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  labels:
    app.kubernetes.io/instance: ha-postgres
    app.kubernetes.io/name: postgreses.kubedb.com
  name: pg-user
  namespace: demo
stringData:
  password: "12345"
  username: "alice"
```
- `app.kubernetes.io/instance` should be same as`appbinding name mentioned in .spec.postgresRef.name`.
- `app.kubernetes.io/name` should be `postgreses.kubedb.com`.
- `namespace` should be same as `namespace mentioned in .spec.postgresRef.namespace`.

In every `10 seconds` KubeDB operator will sync all the users to Pgpool.

Secrets provided by users are not managed by KubeDB, and therefore, won't be modified or garbage collected by the KubeDB operator (version 0.13.0 and higher).

### Prepare Postgres
For a Pgpool surely we will need a Postgres server so, prepare a KubeDB Postgres cluster using this [tutorial](/docs/v2025.6.30/guides/postgres/clustering/streaming_replication), or you can use any externally managed postgres but in that case you need to create an [appbinding](/docs/v2025.6.30/guides/pgpool/concepts/appbinding) yourself. In this tutorial we will use 3 node Postgres cluster named `ha-postgres`.

### Prepare Pgpool

Now, we are going to deploy a `Pgpool` with version `4.5.0`.

### Deploy Pgpool

Below is the YAML of the `Pgpool` CR that we are going to create,

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Pgpool
metadata:
  name: pgpool-sync
  namespace: demo
spec:
  version: "4.5.0"
  replicas: 1
  syncUsers: true
  postgresRef:
    name: ha-postgres
    namespace: demo
  deletionPolicy: WipeOut
```

Let's create the `Pgpool` CR we have shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/pgpool/sync-users/pgpool-sync.yaml
pgpool.kubedb.com/pgpool-sync created
```

Now, wait until `pgpool-sync` has status `Ready`. i.e,

```bash
$ kubectl get pp -n demo
NAME          TYPE                  VERSION   STATUS   AGE
pgpool-sync   kubedb.com/v1alpha2   4.5.0     Ready    41s
```

### Sync Users

Now, create a secret with structure defined [here](/docs/v2025.6.30/guides/pgpool/concepts/pgpool#specsyncusers). Below is the YAML of the `secret` that we are going to create,

```yaml
apiVersion: v1
kind: Secret
metadata:
  labels:
    app.kubernetes.io/instance: ha-postgres
    app.kubernetes.io/name: postgreses.kubedb.com
  name: sync-secret
  namespace: demo
stringData:
  password: "12345"
  username: "john"
```

Now, create the secret by applying the yaml above.

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/pgpool/sync-users/secret.yaml
secret/sync-secret created
```

Now, after `10 seconds` you can exec into the pgpool pod and find if the new user is there,

```bash
$ kubectl exec -it -n demo pgpool-sync-0 -- bash
pgpool-sync-0:/$ cat opt/pgpool-II/etc/pool_passwd 
postgres:AESOmAkfj+zX8zXLm92d6Vup6a5yASiiGScoHNDTIgBwH8=
john:AEScbLKDSMb+KVrILhh7XEmyQ==
pgpool-sync-0:/$ exit
exit
```
We can see that the user is there in Pgpool. So, now let's create this user and try to use this user through Pgpool.
Now, you can connect to this pgpool through [psql](https://www.postgresql.org/docs/current/app-psql.html). Before that we need to port-forward to the primary service of pgpool.

```bash
$ kubectl port-forward -n demo svc/pgpool-sync 9999
Forwarding from 127.0.0.1:9999 -> 9999
```
We will use the root Postgres user to create the user, so let's get the password for the root user, so that we can use it.
```bash
$ kubectl get secrets -n demo ha-postgres-auth -o jsonpath='{.data.\password}' | base64 -d
qEeuU6cu5aH!O9CI⏎ 
```
We can use this password now,
```bash
$ export PGPASSWORD='qEeuU6cu5aH!O9CI'
$ psql --host=localhost --port=9999 --username=postgres postgres
psql (16.3 (Ubuntu 16.3-1.pgdg22.04+1), server 16.1)
Type "help" for help.

postgres=# CREATE USER john WITH PASSWORD '12345';
CREATE ROLE
postgres=# exit
```
Now, let's use this john user.
```bash
$ export PGPASSWORD='12345'
$ psql --host=localhost --port=9999 --username=john postgres
psql (16.3 (Ubuntu 16.3-1.pgdg22.04+1), server 16.1)
Type "help" for help.

postgres=> exit
```
So, we can successfully verify that the user is registered in Pgpool and also we can use it.

## Cleaning up

To clean up the Kubernetes resources created by this tutorial, run:

```bash
kubectl delete -n demo pp/pgpool-sync
kubectl delete -n demo secret/sync-secret
kubectl delete pg -n demo ha-postgres
kubectl delete ns demo
```

## Next Steps

- Monitor your Pgpool database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.6.30/guides/pgpool/monitoring/using-prometheus-operator).
- Monitor your Pgpool database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.6.30/guides/pgpool/monitoring/using-builtin-prometheus).
- Detail concepts of [Pgpool object](/docs/v2025.6.30/guides/pgpool/concepts/pgpool).
- Detail concepts of [PgpoolVersion object](/docs/v2025.6.30/guides/pgpool/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.6.30/CONTRIBUTING).
