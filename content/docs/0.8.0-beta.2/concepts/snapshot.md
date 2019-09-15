---
title: Snapshot
menu:
  docs_0.8.0-beta.2:
    identifier: snapshot-concepts
    name: Snapshot
    parent: concepts
    weight: 35
menu_name: docs_0.8.0-beta.2
section_menu_id: concepts
info:
  version: 0.8.0-beta.2
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.2/concepts/README).

# Snapshot

## What is Snapshot

A `Snapshot` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for database snapshots in a Kubernetes native way.
You only need to describe the desired backup behavior in a Snapshot object. KubeDB operator will launch a Job to perform backup operation. Once the snapshot process is complete, it uploads the snapshot data to various cloud providers S3, GCS, Azure, OpenStack Swift and/or locally mounted volumes using [osm](https://github.com/appscode/osm).

## Snapshot Spec

As with all other Kubernetes objects, a Snapshot needs `apiVersion`, `kind`, and `metadata` fields.
The metadata field must contain a label with `kubedb.com/kind` key.
The valid values for this label are `Postgres` or `Elasticsearch`. It also needs a `.spec` section. Below is an example Snapshot object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  name: snapshot-xyz
  labels:
    kubedb.com/kind: Postgres|Elasticsearch
spec:
  databaseName: database-name
  storageSecretName: s3-secret
  s3:
    endpoint: 's3.amazonaws.com'
    bucket: kubedb-qa
    prefix: demo
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

The `.spec` section supports the following different storage providers for storing snapshot data:

### Local

`Local` backend refers to a local path inside snapshot job container. Any Kubernetes supported [persistent volume](https://kubernetes.io/docs/concepts/storage/volumes/) can be used here. Some examples are: `emptyDir` for testing, NFS, Ceph, GlusterFS, etc.
To configure this backend, no secret is needed. Following parameters are available for `Local` backend.

| Parameter                 | Description                                                                             |
|---------------------------|-----------------------------------------------------------------------------------------|
| `spec.databaseName`       | `Required`. Name of database                                                            |
| `spec.local.path`         | `Required`. Path where this volume will be mounted in the job container. Example: /repo |
| `spec.local.volumeSource` | `Required`. Any Kubernetes [volume](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes) |
| `spec.resources`          | `Optional`. Compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/). |

```console
$ kubectl create -f ./docs/examples/snapshot/local/local-snapshot.yaml
snapshot "local-snapshot" created
```

```yaml
$ kubectl get snapshot local-snapshot -o yaml
apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: 2017-06-28T12:14:48Z
  name: local-snapshot
  namespace: default
  resourceVersion: "2000"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/snapshots/local-snapshot
  uid: 617e3487-5bfb-11e7-bb52-08002711f4aa
  labels:
    kubedb.com/kind: Postgres
spec:
  databaseName: postgres-db
  local:
    path: /repo
    volumeSource:
      emptyDir: {}
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### AWS S3

KubeDB supports AWS S3 service or [Minio](https://minio.io/) servers as snapshot storage backend. To configure this backend, following secret keys are needed:

| Key                     | Description                                                |
|-------------------------|------------------------------------------------------------|
| `AWS_ACCESS_KEY_ID`     | `Required`. AWS / Minio access key ID                      |
| `AWS_SECRET_ACCESS_KEY` | `Required`. AWS / Minio secret access key                  |

```console
$ echo -n '<your-aws-access-key-id-here>' > AWS_ACCESS_KEY_ID
$ echo -n '<your-aws-secret-access-key-here>' > AWS_SECRET_ACCESS_KEY
$ kubectl create secret generic s3-secret \
    --from-file=./AWS_ACCESS_KEY_ID \
    --from-file=./AWS_SECRET_ACCESS_KEY
secret "s3-secret" created
```

```yaml
$ kubectl get secret s3-secret -o yaml

apiVersion: v1
data:
  AWS_ACCESS_KEY_ID: PHlvdXItYXdzLWFjY2Vzcy1rZXktaWQtaGVyZT4=
  AWS_SECRET_ACCESS_KEY: PHlvdXItYXdzLXNlY3JldC1hY2Nlc3Mta2V5LWhlcmU+
kind: Secret
metadata:
  creationTimestamp: 2017-06-28T12:22:33Z
  name: s3-secret
  namespace: default
  resourceVersion: "2511"
  selfLink: /api/v1/namespaces/default/secrets/s3-secret
  uid: 766d78bf-5bfc-11e7-bb52-08002711f4aa
type: Opaque
```

Now, you can create a Snapshot object using this secret. Following parameters are available for `S3` backend.

| Parameter                | Description                                                                     |
|--------------------------|---------------------------------------------------------------------------------|
| `spec.databaseName`      | `Required`. Name of database                                                    |
| `spec.storageSecretName` | `Required`. Name of storage secret                                              |
| `spec.s3.endpoint`       | `Required`. For S3, use `s3.amazonaws.com`. If your bucket is in a different location, S3 server (s3.amazonaws.com) will redirect snapshot to the correct endpoint. For an S3-compatible server that is not Amazon (like Minio), or is only available via HTTP, you can specify the endpoint like this: `http://server:port`. |
| `spec.s3.bucket`         | `Required`. Name of Bucket                                                      |
| `spec.s3.prefix`         | `Optional`. Path prefix into bucket where snapshot will be store                |
| `spec.resources`         | `Optional`. Compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/). |

```console
$ kubectl create -f ./docs/examples/snapshot/s3/s3-snapshot.yaml
snapshot "s3-snapshot" created
```

```yaml
$ kubectl get snapshot s3-snapshot -o yaml

apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: 2017-06-28T12:58:10Z
  name: s3-snapshot
  namespace: default
  resourceVersion: "4889"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/snapshots/s3-snapshot
  uid: 7036ba69-5c01-11e7-bb52-08002711f4aa
  labels:
    kubedb.com/kind: Postgres
spec:
  databaseName: postgres-db
  storageSecretName: s3-secret
  s3:
    endpoint: 's3.amazonaws.com'
    bucket: kubedb-qa
    prefix: demo
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### Google Cloud Storage (GCS)

KubeDB supports Google Cloud Storage(GCS) as snapshot storage backend. To configure this backend, following secret keys are needed:

| Key                               | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `GOOGLE_PROJECT_ID`               | `Required`. Google Cloud project ID                        |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key          |

```console
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key > GOOGLE_SERVICE_ACCOUNT_JSON_KEY
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

Now, you can create a Snapshot object using this secret. Following parameters are available for `gcs` backend.

| Parameter                | Description                                                                     |
|--------------------------|---------------------------------------------------------------------------------|
| `spec.databaseName`      | `Required`. Name of database                                                    |
| `spec.storageSecretName` | `Required`. Name of storage secret                                              |
| `spec.gcs.bucket`        | `Required`. Name of Bucket                                                      |
| `spec.gcs.prefix`        | `Optional`. Path prefix into bucket where snapshot will be stored               |
| `spec.resources`         | `Optional`. Compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/). |

```console
$ kubectl create -f ./docs/examples/snapshot/gcs/gcs-snapshot.yaml
snapshot "gcs-snapshot" created
```

```yaml
$ kubectl get snapshot gcs-snapshot -o yaml

apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: 2017-06-28T13:11:43Z
  name: gcs-snapshot
  namespace: default
  resourceVersion: "5781"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/snapshots/gcs-snapshot
  uid: 54b1bad3-5c03-11e7-bb52-08002711f4aa
  labels:
    kubedb.com/kind: Postgres
spec:
  databaseName: postgres-db
  storageSecretName: gcs-secret
  gcs:
    bucket: bucket-for-snapshot
    prefix: demo
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### Microsoft Azure Storage

KubeDB supports Microsoft Azure Storage as snapshot storage backend. To configure this backend, following secret keys are needed:

| Key                     | Description                                                |
|-------------------------|------------------------------------------------------------|
| `AZURE_ACCOUNT_NAME`    | `Required`. Azure Storage account name                     |
| `AZURE_ACCOUNT_KEY`     | `Required`. Azure Storage account key                      |

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

Now, you can create a Snapshot  using this secret. Following parameters are available for `Azure` backend.

| Parameter                | Description                                                                     |
|--------------------------|---------------------------------------------------------------------------------|
| `spec.databaseName`      | `Required`. Name of database                                                    |
| `spec.storageSecretName` | `Required`. Name of storage secret                                              |
| `spec.azure.container`   | `Required`. Name of Storage container                                           |
| `spec.azure.prefix`      | `Optional`. Path prefix into container where snapshot will be stored            |
| `spec.resources`         | `Optional`. Compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/). |

```console
$ kubectl create -f ./docs/examples/snapshot/azure/azure-snapshot.yaml
snapshot "azure-snapshot" created
```

```yaml
$ kubectl get snapshot azure-snapshot -o yaml

apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: 2017-06-28T13:31:14Z
  name: azure-snapshot
  namespace: default
  resourceVersion: "7070"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/snapshots/azure-snapshot
  uid: 0e8eb89b-5c06-11e7-bb52-08002711f4aa
  labels:
    kubedb.com/kind: Postgres
spec:
  databaseName: postgres-db
  storageSecretName: azure-secret
  azure:
    container: bucket-for-snapshot
    prefix: demo
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### OpenStack Swift

KubeDB supports OpenStack Swift as snapshot storage backend. To configure this backend, following secret keys are needed:

| Key                      | Description                                                |
|--------------------------|------------------------------------------------------------|
| `ST_AUTH`                | For keystone v1 authentication                             |
| `ST_USER`                | For keystone v1 authentication                             |
| `ST_KEY`                 | For keystone v1 authentication                             |
| `OS_AUTH_URL`            | For keystone v2 authentication                             |
| `OS_REGION_NAME`         | For keystone v2 authentication                             |
| `OS_USERNAME`            | For keystone v2 authentication                             |
| `OS_PASSWORD`            | For keystone v2 authentication                             |
| `OS_TENANT_ID`           | For keystone v2 authentication                             |
| `OS_TENANT_NAME`         | For keystone v2 authentication                             |
| `OS_AUTH_URL`            | For keystone v3 authentication                             |
| `OS_REGION_NAME`         | For keystone v3 authentication                             |
| `OS_USERNAME`            | For keystone v3 authentication                             |
| `OS_PASSWORD`            | For keystone v3 authentication                             |
| `OS_USER_DOMAIN_NAME`    | For keystone v3 authentication                             |
| `OS_PROJECT_NAME`        | For keystone v3 authentication                             |
| `OS_PROJECT_DOMAIN_NAME` | For keystone v3 authentication                             |
| `OS_STORAGE_URL`         | For authentication based on tokens                         |
| `OS_AUTH_TOKEN`          | For authentication based on tokens                         |

```console
$ echo -n '<your-auth-url>' > OS_AUTH_URL
$ echo -n '<your-tenant-id>' > OS_TENANT_ID
$ echo -n '<your-tenant-name>' > OS_TENANT_NAME
$ echo -n '<your-username>' > OS_USERNAME
$ echo -n '<your-password>' > OS_PASSWORD
$ echo -n '<your-region>' > OS_REGION_NAME
$ kubectl create secret generic swift-secret \
    --from-file=./OS_AUTH_URL \
    --from-file=./OS_TENANT_ID \
    --from-file=./OS_TENANT_NAME \
    --from-file=./OS_USERNAME \
    --from-file=./OS_PASSWORD \
    --from-file=./OS_REGION_NAME
secret "swift-secret" created
```

```yaml
$ kubectl get secret azure-secret -o yaml

apiVersion: v1
data:
  OS_AUTH_URL: PHlvdXItYXV0aC11cmw+
  OS_PASSWORD: PHlvdXItcGFzc3dvcmQ+
  OS_REGION_NAME: PHlvdXItcmVnaW9uPg==
  OS_TENANT_ID: PHlvdXItdGVuYW50LWlkPg==
  OS_TENANT_NAME: PHlvdXItdGVuYW50LW5hbWU+
  OS_USERNAME: PHlvdXItdXNlcm5hbWU+
kind: Secret
metadata:
  creationTimestamp: 2017-07-03T19:17:39Z
  name: swift-secret
  namespace: default
  resourceVersion: "36381"
  selfLink: /api/v1/namespaces/default/secrets/swift-secret
  uid: 47b4bcab-6024-11e7-879a-080027726d6b
type: Opaque
```

Now, you can create a Snapshot object using this secret. Following parameters are available for `Swift` backend.

| Parameter                | Description                                                                     |
|--------------------------|---------------------------------------------------------------------------------|
| `spec.databaseName`      | `Required`. Name of database                                                    |
| `spec.storageSecretName` | `Required`. Name of storage secret                                              |
| `spec.swift.container`   | `Required`. Name of Storage container                                           |
| `spec.swift.prefix`      | `Optional`. Path prefix into container where snapshot will be stored            |
| `spec.resources`         | `Optional`. Compute resources required by Jobs used to take snapshot or initialize databases from snapshot.  To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/). |

```console
$ kubectl create -f ./docs/examples/snapshot/swift/swift-snapshot.yaml
snapshot "swift-snapshot" created
```

```yaml
$ kubectl get snapshot swift-snapshot -o yaml

apiVersion: kubedb.com/v1alpha1
kind: Snapshot
metadata:
  creationTimestamp: 2017-06-28T13:31:14Z
  name: swift-snapshot
  namespace: default
  resourceVersion: "7070"
  selfLink: /apis/kubedb.com/v1alpha1/namespaces/default/snapshots/swift-snapshot
  uid: 0e8eb89b-5c06-11e7-bb52-08002711f4aa
  labels:
    kubedb.com/kind: Postgres
spec:
  databaseName: postgres-db
  storageSecretName: swift-secret
  swift:
    container: bucket-for-snapshot
    prefix: demo
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

## Next Steps

- Learn how to use KubeDB to manage various databases [here](/docs/0.8.0-beta.2/guides/README).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.2/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.2/CONTRIBUTING).
