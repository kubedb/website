---
title: Continuous Archiving to GCS
menu:
  docs_v2020.10.24-beta.0:
    identifier: pg-wal-gcs
    name: To GCS
    parent: pg-wal
    weight: 35
menu_name: docs_v2020.10.24-beta.0
section_menu_id: guides
info:
  cli: v0.14.0-beta.4
  community: v0.14.0-beta.4
  enterprise: v0.1.0-beta.4
  installer: v0.14.0-beta.4
  version: v2020.10.24-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.24-beta.0/README).

# Continuous Archiving to GCS

**WAL-G** is used to continuously archive PostgreSQL WAL files. Please refer to [continuous archiving in KubeDB](/docs/v2020.10.24-beta.0/guides/postgres/backup/wal/continuous_archiving) to learn more about it.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2020.10.24-beta.0/setup/README).

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

## Create PostgreSQL with Continuous Archiving

For archiving, we need storage Secret, and storage backend information. Below is a Postgres object created with Continuous Archiving support to backup WAL files to Google Cloud Storage.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Postgres
metadata:
  name: wal-postgres
  namespace: demo
spec:
  version: "11.1-v3"
  replicas: 2
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  archiver:
    storage:
      storageSecretName: gcs-secret
      gcs:
        bucket: kubedb
```

Here,

- `spec.archiver.storage` specifies storage information that will be used by `WAL-G`
  - `storage.storageSecretName` points to the Secret containing the credentials for cloud storage destination.
  - `storage.gcs` points to GCS configuration.
  - `storage.gcs.bucket` points to the bucket name used to store continuous archiving data.

**Archiver Storage Secret**

Storage Secret should contain credentials that will be used to access storage destination.

Storage Secret for **WAL-G** is needed with the following 2 keys:

| Key                               | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `GOOGLE_PROJECT_ID`               | `Required`. Google Cloud project ID               |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key |

```bash
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key GOOGLE_SERVICE_ACCOUNT_JSON_KEY
$ kubectl create secret generic gcs-secret \
    --from-file=./GOOGLE_PROJECT_ID \
    --from-file=./GOOGLE_SERVICE_ACCOUNT_JSON_KEY
secret "gcs-secret" created
```

```yaml
$ kubectl get secret gcs-secret -o yaml
apiVersion: v1
data:
  GOOGLE_PROJECT_ID: PHlvdXItcHJvamVjdC1pZD4=
  GOOGLE_SERVICE_ACCOUNT_JSON_KEY: ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3V...9tIgp9Cg==
kind: Secret
metadata:
  creationTimestamp: 2017-06-28T13:06:51Z
  name: gcs-secret
  namespace: default
  resourceVersion: "5461"
  selfLink: /api/v1/namespaces/default/secrets/gcs-secret
  uid: a6983b00-5c02-11e7-bb52-08002711f4aa
type: Opaque
```

**Archiver Storage Backend**

To configure GCS backend, following parameters are available:

| Parameter                          | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `spec.archiver.storage.gcs.bucket` | `Required`. Name of Bucket                                   |
| `spec.archiver.storage.gcs.prefix` | `Optional`. Path prefix into bucket where snapshot will be stored |

Now create this Postgres object with continuous archiving support.

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/postgres/backup/wal-postgres-gcs.yaml
postgres.kubedb.com/wal-postgres created
```

When database is ready, **WAL-G** takes a base backup and uploads it to the cloud storage defined by storage backend.

Archived data is stored in a folder called `{bucket}/{prefix}/kubedb/{namespace}/{postgres-name}/archive/`.

You can see continuous archiving data stored in GCS bucket.

<p align="center">
  <kbd>
    <img alt="continuous-archiving"  src="/docs/v2020.10.24-beta.0/images/postgres/wal-postgres-gcs.png">
  </kbd>
</p>


From the above image, you can see that the archived data is stored in a folder `kubedb/kubedb/demo/wal-postgres/archive`.

## Termination Policy

If termination policy of this `wal-postgres` is set to `WipeOut` or, If `Spec.WipeOut` of dormant database is set to `true`, then the data in cloud backend will be deleted.

The data will be intact in other scenarios.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo pg/wal-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/wal-postgres

kubectl delete -n demo secret/gcs-secret
kubectl delete ns demo
```

## Next Steps

- Learn about initializing [PostgreSQL from WAL](/docs/v2020.10.24-beta.0/guides/postgres/initialization/wal/wal_source) files stored in cloud.
