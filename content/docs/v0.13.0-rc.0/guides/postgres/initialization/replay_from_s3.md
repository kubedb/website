---
title: Initialize Postgres from S3
menu:
  docs_v0.13.0-rc.0:
    identifier: pg-wal-source-initialization-s3
    name: From WAL(S3)
    parent: pg-initialization-postgres
    weight: 30
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).
> Don't know how to take continuous backup?  Check this [tutorial](/docs/v0.13.0-rc.0/guides/postgres/snapshot/continuous_archiving) on Continuous Archiving.

# PostgreSQL Initialization from S3

**WAL-G** is used to handle replay, and restoration mechanism. Please refer to [Initialization from WAL files in KubeDB](/docs/v0.13.0-rc.0/guides/postgres/initialization/wal_source) to know more about it.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster.
If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace/demo created
```

## Prepare WAL Archive

We need a WAL archive to perform initialization. If you don't have a WAL archive ready, create one by following the tutorial [here](/docs/v0.13.0-rc.0/guides/postgres/snapshot/continuous_archiving).

Let's populate the database so that we can verify that the initialized database has the same data. We will `exec` into the database pod and use `psql` command-line tool to create a table.

At first, find out the primary replica using the following command,

```console
$ kubectl get pods -n demo --selector="kubedb.com/name=wal-postgres","kubedb.com/role=primary"
NAME             READY     STATUS    RESTARTS   AGE
wal-postgres-0   1/1       Running   0          8m
```

Now, let's `exec` into the pod and create a table,

```console
$ kubectl exec -it -n demo wal-postgres-0 sh
# login as "postgres" superuser.
/ # psql -U postgres
psql (11.1)
Type "help" for help.

# list available databases
postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(3 rows)

# connect to "postgres" database
postgres=# \c postgres
You are now connected to database "postgres" as user "postgres".

# create a table
postgres=# CREATE TABLE COMPANY( NAME TEXT NOT NULL, EMPLOYEE INT NOT NULL);
CREATE TABLE

# list tables
postgres=# \d
          List of relations
 Schema |  Name   | Type  |  Owner
--------+---------+-------+----------
 public | company | table | postgres

# quit from the database
postgres=# \q

# exit from the pod
/ # exit
```

Now, we are ready to proceed for rest of the tutorial.

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Create Postgres with WAL source

User can initialize a new database from this archived WAL files. We have to specify the archive backend in the `spec.init.postgresWAL` field of Postgres object.

The YAML file  in this tutorial creates a Postgres object using WAL files from Amazon S3.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: replay-postgres
  namespace: demo
spec:
  version: "11.1-v2"
  replicas: 2
  databaseSecret:
    secretName: wal-postgres-auth
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  init:
    postgresWAL:
      storageSecretName: s3-secret
      s3:
        bucket: kubedb
        prefix: 'kubedb/demo/wal-postgres/archive'
```

Here,

- `spec.init.postgresWAL` specifies storage information that will be used by `WAL-G`
  - `storageSecretName` points to the Secret containing the credentials for cloud storage destination.
  - `s3` points to S3 storage configuration.
  - `s3.bucket` points to the bucket name where archived WAL data is stored.
  - `s3.prefix` points to the path of archived WAL data.

**wal-g** receives archived WAL data from a directory inside the bucket called `/kubedb/{namespace}/{postgres-name}/archive/`.

Here, `{namespace}` & `{postgres-name}` indicates Postgres object whose WAL archived data will be replayed.

> Note: Postgres `replay-postgres` must have same superuser credentials as archived Postgres. In our case, it is `wal-postgres`.

Now, let's create the Postgres object that's YAML has shown above,

```console
$ kubectl create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/postgres/initialization/replay-postgres-s3.yaml
postgres.kubedb.com/replay-postgres created
```

This will create a new database and will initialize the database from the archived WAL files.

## Verify Initialization

Let's verify that the new database has been initialized successfully from the WAL archive. It must contain the table we have created for `wal-postgres` database.

We will `exec` into new database pod and use `psql` command-line tool to list tables of `postgres` database.

```console
$ kubectl exec -it -n demo replay-postgres-0 sh
# login as "postgres" superuser
/ # psql -U postgres
psql (11.1)
Type "help" for help.

# list available databases
postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(3 rows)

# connect to "postgres" database
postgres=# \c postgres
You are now connected to database "postgres" as user "postgres".

# list tables
postgres=# \d
          List of relations
 Schema |  Name   | Type  |  Owner
--------+---------+-------+----------
 public | company | table | postgres
(1 row)

# quit from the database
postgres=# \q

# exit from pod
/ # exit
```

So, we can see that our new database `replay-postgres` has been initialized successfully and contains the data we had inserted into `wal-postgres`.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo pg/replay-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/replay-postgres

kubectl delete ns demo
```

Also cleanup the resources created for `wal-postgres` following the guide [here](/docs/v0.13.0-rc.0/guides/postgres/snapshot/continuous_archiving#cleaning-up).

## Next Steps

- Learn about initializing [PostgreSQL with Script](/docs/v0.13.0-rc.0/guides/postgres/initialization/script_source).
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/v0.13.0-rc.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [CoreOS Prometheus Operator](/docs/v0.13.0-rc.0/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v0.13.0-rc.0/CONTRIBUTING).

