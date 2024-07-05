---
title: Initialize Postgres from WAL in Azure
menu:
  docs_v2021.01.15:
    identifier: pg-wal-initialization-azure
    name: From Azure
    parent: pg-wal-initialization
    weight: 30
menu_name: docs_v2021.01.15
section_menu_id: guides
info:
  autoscaler: v0.1.1
  cli: v0.16.1
  community: v0.16.1
  enterprise: v0.3.1
  installer: v0.16.1
  version: v2021.01.15
---

> New to KubeDB? Please start [here](/docs/v2021.01.15/README).

> Don't know how to take continuous backup?  Check this [tutorial](/docs/v2021.01.15/guides/postgres/backup/wal/continuous_archiving) on Continuous Archiving.

# PostgreSQL Initialization from Azure

**WAL-G** is used to handle replay, and restoration mechanism. Please refer to [Initialization from WAL files in KubeDB](/docs/v2021.01.15/guides/postgres/initialization/wal/wal_source) to know more about it.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster.
If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2021.01.15/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

## Prepare WAL Archive

We need a WAL archive to perform initialization. If you don't have a WAL archive ready, create one by following the tutorial [here](/docs/v2021.01.15/guides/postgres/backup/wal/continuous_archiving).

Let's populate the database so that we can verify that the initialized database has the same data. We will `exec` into the database pod and use `psql` command-line tool to create a table.

At first, find out the primary replica using the following command,

```bash
$ kubectl get pods -n demo --selector="app.kubernetes.io/instance=wal-postgres","kubedb.com/role=primary"
NAME             READY     STATUS    RESTARTS   AGE
wal-postgres-0   1/1       Running   0          8m
```

Now, let's `exec` into the pod and create a table,

```bash
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

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Create Postgres with WAL source

User can initialize a new database from this archived WAL files. We have to specify the archive backend in the `spec.init.postgresWAL` field of Postgres object.

The YAML file  in this tutorial creates a Postgres object using WAL files from Azure Storage.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Postgres
metadata:
  name: replay-postgres
  namespace: demo
spec:
  version: "11.1-v3"
  replicas: 2
  authSecret:
    name: wal-postgres-auth
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  init:
    postgresWAL:
      storageSecretName: azure-secret
      azure:
        container: kubedb
        prefix: 'kubedb/demo/wal-postgres/archive'
```

Here,

- `spec.init.postgresWAL` specifies storage information that will be used by`WAL-G`
  - `storageSecretName` points to the Secret containing the credentials for cloud storage destination.
  - `azure` points to Azure storage configuration.
  - `azure.container` points to the container/bucket name where archived WAL data is stored.
  - `azure.prefix` points to the path of archived WAL data.

**wal-g** receives archived WAL data from a directory inside the container called `/kubedb/{namespace}/{postgres-name}/archive/`.

Here, `{namespace}` & `{postgres-name}` indicates Postgres object whose WAL archived data will be replayed.

> Note: Postgres `replay-postgres` must have same superuser credentials as archived Postgres. In our case, it is `wal-postgres`.

Now, let's create the Postgres object that's YAML has shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/postgres/initialization/replay-postgres-azure.yaml
postgres.kubedb.com/replay-postgres created
```

This will create a new database and will initialize the database from the archived WAL files.

## Verify Initialization

Let's verify that the new database has been initialized successfully from the WAL archive. It must contain the table we have created for `wal-postgres` database.

We will `exec` into new database pod and use `psql` command-line tool to list tables of `postgres` database.

```bash
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

```bash
kubectl patch -n demo pg/replay-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/replay-postgres

kubectl delete ns demo
```

Also cleanup the resources created for `wal-postgres` following the guide [here](/docs/v2021.01.15/guides/postgres/backup/wal/continuous_archiving#cleaning-up).

## Next Steps

- Learn about initializing [PostgreSQL with Script](/docs/v2021.01.15/guides/postgres/initialization/script_source).
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/v2021.01.15/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [Prometheus operator](/docs/v2021.01.15/guides/postgres/monitoring/using-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.01.15/CONTRIBUTING).
