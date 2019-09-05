---
title: Continuous Archiving to Azure
menu:
  docs_v0.13.0-rc.0:
    identifier: pg-continuous-archiving-azure
    name: WAL Archiving to Azure
    parent: pg-snapshot-postgres
    weight: 30
menu_name: docs_v0.13.0-rc.0
section_menu_id: guides
---

> New to KubeDB? Please start [here](/docs/v0.13.0-rc.0/concepts/README).

# Continuous Archiving to Azure

**WAL-G** is used to continuously archive PostgreSQL WAL files. Please refer to [continuous archiving in KubeDB](/docs/v0.13.0-rc.0/guides/postgres/snapshot/continuous_archiving) to learn more about it.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v0.13.0-rc.0/setup/install).

> Note: YAML files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/docs/tree/v0.13.0-rc.0/docs/examples/postgres) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace/demo created
```

## Create PostgreSQL with Continuous Archiving

For archiving, we need storage Secret, and storage backend information. Below is a Postgres object created with Continuous Archiving support to backup WAL files to Azure Storage.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: wal-postgres
  namespace: demo
spec:
  version: "11.1-v2"
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
      storageSecretName: azure-secret
      azure:
        container: kubedb
```

Here,

- `spec.archiver.storage` specifies storage information that will be used by `WAL-G`
  - `storage.storageSecretName` points to the Secret containing the credentials for cloud storage destination.
  - `storage.azure` points to Azure storage configuration.
  - `storage.azure.container` points to the bucket name used to store continuous archiving data.

**Archiver Storage Secret**

Storage Secret should contain credentials that will be used to access storage destination.

Storage Secret for **WAL-G** is needed with the following 2 keys:

| Key                  | Description                            |
| -------------------- | -------------------------------------- |
| `AZURE_ACCOUNT_NAME` | `Required`. Azure Storage account name |
| `AZURE_ACCOUNT_KEY`  | `Required`. Azure Storage account key  |

```console
$ echo -n '<your-azure-storage-account-name>' > AZURE_ACCOUNT_NAME
$ echo -n '<your-azure-storage-account-key>' > AZURE_ACCOUNT_KEY
$ kubectl create secret generic azure-secret \
    --from-file=./AZURE_ACCOUNT_NAME \
    --from-file=./AZURE_ACCOUNT_KEY
secret "azure-secret" created
```

```yaml
$ kubectl get secret azure-secret -o yaml
apiVersion: v1
data:
  AZURE_ACCOUNT_KEY: PHlvdXItYXp1cmUtc3RvcmFnZS1hY2NvdW50LWtleT4=
  AZURE_ACCOUNT_NAME: PHlvdXItYXp1cmUtc3RvcmFnZS1hY2NvdW50LW5hbWU+
kind: Secret
metadata:
  creationTimestamp: 2017-06-28T13:27:16Z
  name: azure-secret
  namespace: default
  resourceVersion: "6809"
  selfLink: /api/v1/namespaces/default/secrets/azure-secret
  uid: 80f658d1-5c05-11e7-bb52-08002711f4aa
type: Opaque
```

**Archiver Storage Backend**

To configure Azure backend, following parameters are available:

| Parameter                               | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| `spec.archiver.storage.azure.container` | `Required`. Name of Storage container                        |
| `spec.archiver.storage.azure.prefix`    | `Optional`. Path prefix into bucket where snapshot will be stored |

Now create this Postgres object with continuous archiving support.

```console
$ kubectl create -f https://github.com/kubedb/docs/raw/v0.13.0-rc.0/docs/examples/postgres/snapshot/wal-postgres-azure.yaml
postgres.kubedb.com/wal-postgres created
```

When database is ready, **WAL-G** takes a base backup and uploads it to the cloud storage defined by storage backend.

Archived data is stored in a folder called `{container}/{prefix}/kubedb/{namespace}/{postgres-name}/archive/`.

You can see continuous archiving data stored in azure container.

<p align="center">
  <kbd>
    <img alt="continuous-archiving"  src="/docs/v0.13.0-rc.0/images/postgres/wal-postgres-azure.png">
  </kbd>
</p>

From the above image, you can see that the archived data is stored in a folder `kubedb/kubedb/demo/wal-postgres/archive`.

## Termination Policy

If termination policy of this `wal-postgres` is set to `WipeOut` or, If `Spec.WipeOut` of dormant database is set to `true`, then the data in cloud backend will be deleted.

The data will be intact in other scenarios.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
kubectl patch -n demo pg/wal-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo pg/wal-postgres

kubectl delete -n demo secret/azure-secret
kubectl delete ns demo
```

## Next Steps

- Learn about initializing [PostgreSQL from WAL](/docs/v0.13.0-rc.0/guides/postgres/initialization/script_source) files stored in cloud.
