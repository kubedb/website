---
title: Run PostgreSQL using Private Registry
menu:
  docs_0.9.0:
    identifier: pg-using-private-registry-private-registry
    name: Quickstart
    parent: pg-private-registry-postgres
    weight: 10
menu_name: docs_0.9.0
section_menu_id: guides
info:
  version: 0.9.0
---

> New to KubeDB? Please start [here](/docs/0.9.0/concepts/README).

# Using private Docker registry

KubeDB supports using private Docker registry. This tutorial will show you how to run KubeDB managed PostgreSQL database using private Docker images.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace "demo" created

$ kubectl get ns demo
NAME    STATUS  AGE
demo    Active  5s
```

> Note: Yaml files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/cli/tree/0.9.0/docs/examples/postgres) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Prepare Private Docker Registry
You will also need a docker private [registry](https://docs.docker.com/registry/) or [private repository](https://docs.docker.com/docker-hub/repos/#private-repositories). In this tutorial we will use private repository of [docker hub](https://hub.docker.com/).

You have to push the required images from KubeDB's [Docker hub account](https://hub.docker.com/r/kubedb/) into your private registry.

For Postgres, push the following images to your private registry.

- [kubedb/operator](https://hub.docker.com/r/kubedb/operator)
- [kubedb/postgres](https://hub.docker.com/r/kubedb/postgres)
- [kubedb/postgres-tools](https://hub.docker.com/r/kubedb/postgres-tools)
- [kubedb/postgres_exporter](https://hub.docker.com/r/kubedb/postgres_exporter)

```console
$ export DOCKER_REGISTRY=<your-registry>

$ docker pull kubedb/operator:0.9.0 ; docker tag kubedb/operator:0.9.0 $DOCKER_REGISTRY/operator:0.9.0 ; docker push $DOCKER_REGISTRY/operator:0.9.0
$ docker pull kubedb/postgres:9.6-v1 ; docker tag kubedb/postgres:9.6-v1 $DOCKER_REGISTRY/postgres:9.6-v1 ; docker push $DOCKER_REGISTRY/postgres:9.6-v1
$ docker pull kubedb/postgres-tools:9.6-v1 ; docker tag kubedb/postgres-tools:9.6-v1 $DOCKER_REGISTRY/postgres-tools:9.6-v1 ; docker push $DOCKER_REGISTRY/postgres-tools:9.6-v1
$ docker pull kubedb/postgres_exporter:v0.4.6 ; docker tag kubedb/postgres_exporter:v0.4.6 $DOCKER_REGISTRY/postgres_exporter:v0.4.6 ; docker push $DOCKER_REGISTRY/postgres_exporter:v0.4.6
```

## Create ImagePullSecret

ImagePullSecrets is a type of a Kubernetes Secret whose sole purpose is to pull private images from a Docker registry. It allows you to specify the url of the docker registry, credentials for logging in and the image name of your private docker image.

Run the following command, substituting the appropriate uppercase values to create an image pull secret for your private Docker registry:

```console
$ kubectl create secret -n demo docker-registry myregistrykey \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-email=DOCKER_EMAIL \
  --docker-password=DOCKER_PASSWORD

secret "myregistrykey" created.
```

If you wish to follow other ways to pull private images see [official docs](https://kubernetes.io/docs/concepts/containers/images/) of kubernetes.

> Note; If you are using `kubectl` 1.9.0, update to 1.9.1 or later to avoid this [issue](https://github.com/kubernetes/kubernetes/issues/57427).

## Install KubeDB operator

When installing KubeDB operator, set the flags `--docker-registry` and `--image-pull-secret` to appropriate value.
Follow the steps to [install KubeDB operator](/docs/0.9.0/setup/install) properly in cluster so that to points to the DOCKER_REGISTRY you wish to pull images from.

## Create PostgresVersion CRD

KubeDB uses images specified in PostgresVersion crd for database, backup and exporting prometheus metrics. You have to create a PostgresVersion crd specifying images from your private registry. Then, you have to point this PostgresVersion crd in `spec.version` field of Postgres object. For more details about PostgresVersion crd, please visit [here](/docs/0.9.0/concepts/catalog/postgres).

Here, is an example of PostgresVersion crd. Replace `<YOUR_PRIVATE_REGISTRY>` with your private registy.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PostgresVersion
metadata:
  name: "pvt-9.6"
  labels:
    app: kubedb
spec:
  version: "9.6"
  db:
    image: "<YOUR_PRIVATE_REGISTRY>/postgres:9.6-v1"
  exporter:
    image: "<YOUR_PRIVATE_REGISTRY>/postgres_exporter:v0.4.6"
  tools:
    image: "<YOUR_PRIVATE_REGISTRY>/postgres-tools:9.6-v1"
```

Now, create the PostgresVersion crd,

```console
$ kubectl apply -f pvt-postgresversion.yaml
postgresversion.kubedb.com/pvt-9.6 created
```

## Deploy PostgreSQL database from Private Registry

While deploying PostgreSQL from private repository, you have to add `myregistrykey` secret in Postgres `spec.podTemplate.spec.imagePullSecrets` and specify `pvt-9.6` in `spec.version` field.

Below is the Postgres object we will create in this tutorial

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: pvt-reg-postgres
  namespace: demo
spec:
  version: "pvt-9.6"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  podTemplate:
    spec:
      imagePullSecrets:
      - name: myregistrykey
```

Now run the command to create this Postgres object:

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0/docs/examples/postgres/private-registry/pvt-reg-postgres.yaml
postgres.kubedb.com/pvt-reg-postgres created
```

To check if the images pulled successfully from the repository, see if the PostgreSQL is in Running state:

```console
$ kubectl get pods -n demo --selector="kubedb.com/name=pvt-reg-postgres"
NAME                 READY     STATUS    RESTARTS   AGE
pvt-reg-postgres-0   1/1       Running   0          3m
```

## Snapshot

You can specify `imagePullSecret` for Snapshot objects in `spec.podTemplate.spec.imagePullSecrets` field of Snapshot object. If you are using scheduled backup, you can also provide `imagePullSecret` in `backupSchedule.podTemplate.spec.imagePullSecrets` field of Postgres crd. KubeDB also reuses `imagePullSecret` for Snapshot object from `spec.podTemplate.spec.imagePullSecrets` field of Postgres crd.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubectl patch -n demo pg/pvt-reg-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
$ kubectl delete -n demo pg/pvt-reg-postgres

$ kubectl delete ns demo
```

If you would like to uninstall KubeDB operator, please follow the steps [here](/docs/0.9.0/setup/uninstall).

## Next Steps

- Learn about [taking instant backup](/docs/0.9.0/guides/postgres/snapshot/instant_backup) of PostgreSQL database using KubeDB Snapshot.
- Learn how to [schedule backup](/docs/0.9.0/guides/postgres/snapshot/scheduled_backup)  of PostgreSQL database.
- Learn about initializing [PostgreSQL with Script](/docs/0.9.0/guides/postgres/initialization/script_source).
- Learn about initializing [PostgreSQL from KubeDB Snapshot](/docs/0.9.0/guides/postgres/initialization/snapshot_source).
- Want to setup PostgreSQL cluster? Check how to [configure Highly Available PostgreSQL Cluster](/docs/0.9.0/guides/postgres/clustering/ha_cluster)
- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/0.9.0/guides/postgres/monitoring/using-builtin-prometheus).
- Monitor your PostgreSQL database with KubeDB using [CoreOS Prometheus Operator](/docs/0.9.0/guides/postgres/monitoring/using-coreos-prometheus-operator).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0/CONTRIBUTING).
