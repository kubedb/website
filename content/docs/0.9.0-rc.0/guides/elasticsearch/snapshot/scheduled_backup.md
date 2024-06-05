---
title: Scheduled Backup of Elasticsearch
menu:
  docs_0.9.0-rc.0:
    identifier: es-scheduled-backup-snapshot
    name: Scheduled Backup
    parent: es-snapshot-elasticsearch
    weight: 15
menu_name: docs_0.9.0-rc.0
section_menu_id: guides
info:
  version: 0.9.0-rc.0
---

> Don't know how backup works?  Check [tutorial](/docs/0.9.0-rc.0/guides/elasticsearch/snapshot/instant_backup) on Instant Backup.

# Database Scheduled Snapshots

KubeDB supports taking periodic backups for Elasticsearch database.

## Before you begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.9.0-rc.0/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace "demo" created

$ kubectl get ns demo
NAME    STATUS  AGE
demo    Active  5s
```

> Note: Yaml files used in this tutorial are stored in [docs/examples/elasticsearch](https://github.com/kubedb/cli/tree/master/docs/examples/elasticsearch) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Create Elasticsearch with BackupSchedule

KubeDB supports taking periodic backups for a database using a [cron expression](https://github.com/robfig/cron/blob/v2/doc.go#L26). KubeDB operator will launch a Job periodically that takes backup and uploads the output files to various cloud providers S3, GCS, Azure, OpenStack Swift and/or locally mounted volumes using [osm](https://github.com/appscode/osm).

In this tutorial, snapshots will be stored in a Google Cloud Storage (GCS) bucket. To do so, a secret is needed that has the following 2 keys:

| Key                               | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `GOOGLE_PROJECT_ID`               | `Required`. Google Cloud project ID                        |
| `GOOGLE_SERVICE_ACCOUNT_JSON_KEY` | `Required`. Google Cloud service account json key          |

```console
$ echo -n '<your-project-id>' > GOOGLE_PROJECT_ID
$ mv downloaded-sa-json.key > GOOGLE_SERVICE_ACCOUNT_JSON_KEY
$ kubectl create secret -n demo generic gcs-secret \
    --from-file=./GOOGLE_PROJECT_ID \
    --from-file=./GOOGLE_SERVICE_ACCOUNT_JSON_KEY
secret "gcs-secret" created
```

To learn how to configure other storage destinations for Snapshots, please [visit here](/docs/0.9.0-rc.0/concepts/snapshot).

Below is the Elasticsearch object with BackupSchedule field.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Elasticsearch
metadata:
  name: scheduled-es
  namespace: demo
spec:
  version: "6.3-v1"
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb
```

Here,

- [`cronExpression`](https://github.com/robfig/cron/blob/v2/doc.go) represents a set of times or interval when a single backup will be created.
- `storageSecretName` points to the Secret containing the credentials for snapshot storage destination.
- `gcs.bucket` points to the bucket name used to store the snapshot data

> Note: Secret object must be in the same namespace as Elasticsearch, `scheduled-es`, in this case.

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.0/docs/examples/elasticsearch/snapshot/scheduled-es.yaml
elasticsearch.kubedb.com/scheduled-es created
```

When Elasticsearch starts running successfully, KubeDB operator creates a Snapshot object immediately and registers to create a new Snapshot object on each tick of the cron expression.

```console
$ kubectl get snap -n demo --selector="kubedb.com/kind=Elasticsearch,kubedb.com/name=scheduled-es"
NAME                           DATABASENAME   STATUS    AGE
scheduled-es-20181005-120106   scheduled-es   Running   3s
```

## Update Elasticsearch to disable periodic backups

If you already have a running Elasticsearch that takes backup periodically, you can disable that by removing BackupSchedule field.

Edit your Elasticsearch object and remove BackupSchedule. This will stop taking future backups for this schedule.

```console
$ kubectl edit es -n demo scheduled-es
spec:
#  backupSchedule:
#    cronExpression: '@every 6h'
#    gcs:
#      bucket: kubedb
#    storageSecretName: gcs-secret
```

## Update Elasticsearch to enable periodic backups

If you already have a running Elasticsearch, you can enable periodic backups by adding BackupSchedule.

Edit the Elasticsearch `scheduled-es` to add following `spec.backupSchedule` section.

```yaml
$ kubectl edit es scheduled-es -n demo
  backupSchedule:
    cronExpression: "@every 6h"
    storageSecretName: gcs-secret
    gcs:
      bucket: kubedb
```

Once the `spec.backupSchedule` is added, KubeDB operator creates a Snapshot object immediately and registers to create a new Snapshot object on each tick of the cron expression.

```console
$ kubectl get snap -n demo --selector=kubedb.com/kind=Elasticsearch,kubedb.com/name=scheduled-es
NAME                           DATABASE          STATUS      AGE
scheduled-es-20180214-095019   es/scheduled-es   Succeeded   17m
scheduled-es-20180214-100711   es/scheduled-es   Running     9s
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubectl patch -n demo es/scheduled-es -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
$ kubectl delete -n demo es/scheduled-es

$ kubectl delete ns demo
```

## Next Steps

- See the list of supported storage providers for snapshots [here](/docs/0.9.0-rc.0/concepts/snapshot).
- Learn about initializing [Elasticsearch with Snapshot](/docs/0.9.0-rc.0/guides/elasticsearch/initialization/snapshot_source).
- Learn how to configure [Elasticsearch Topology](/docs/0.9.0-rc.0/guides/elasticsearch/clustering/topology).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` builtin-Prometheus](/docs/0.9.0-rc.0/guides/elasticsearch/monitoring/using-builtin-prometheus).
- Monitor your Elasticsearch database with KubeDB using [`out-of-the-box` CoreOS Prometheus Operator](/docs/0.9.0-rc.0/guides/elasticsearch/monitoring/using-coreos-prometheus-operator).
- Use [private Docker registry](/docs/0.9.0-rc.0/guides/elasticsearch/private-registry/using-private-registry) to deploy Elasticsearch with KubeDB.
- Wondering what features are coming next? Please visit [here](/docs/0.9.0-rc.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0-rc.0/CONTRIBUTING).
