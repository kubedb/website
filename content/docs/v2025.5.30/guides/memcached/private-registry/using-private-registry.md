---
title: Run Memcached using Private Registry
menu:
  docs_v2025.5.30:
    identifier: mc-using-private-registry-private-registry
    name: Quickstart
    parent: mc-private-registry-memcached
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

# Using private Docker registry

KubeDB operator supports using private Docker registry. This tutorial will show you how to use KubeDB to run Memcached server using private Docker images.

## Before You Begin

- Read [concept of Memcached Version Catalog](/docs/v2025.5.30/guides/memcached/concepts/memcached-version) to learn detail concepts of `MemcachedVersion` object.

- You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- You will also need a docker private [registry](https://docs.docker.com/registry/) or [private repository](https://docs.docker.com/docker-hub/repos/#private-repositories).  In this tutorial we will use private repository of [docker hub](https://hub.docker.com/).

- You have to push the required images from KubeDB's [Docker hub account](https://hub.docker.com/r/kubedb/) into your private registry. For memcached, push `DB_IMAGE`, `EXPORTER_IMAGE` of following MemcachedVersions, where `deprecated` is not true, to your private registry.

  ```bash
  $ kubectl get memcachedversions -n kube-system  -o=custom-columns=NAME:.metadata.name,VERSION:.spec.version,DB_IMAGE:.spec.db.image,EXPORTER_IMAGE:.spec.exporter.image,DEPRECATED:.spec.deprecated
  NAME     VERSION   DB_IMAGE                                          EXPORTER_IMAGE                                          DEPRECATED
  1.5.22   1.5.22    ghcr.io/appscode-images/memcached:1.5.22-alpine   prom/memcached-exporter:v0.14.2                         <none>
  1.6.22   1.6.22    ghcr.io/appscode-images/memcached:1.6.22-alpine   ghcr.io/appscode-images/memcached_exporter:v0.14.3-ac   <none>
  1.6.29   1.6.29    ghcr.io/appscode-images/memcached:1.6.29-alpine   ghcr.io/appscode-images/memcached_exporter:v0.14.3-ac   <none>
  ```

  Docker hub repositories:

  - [kubedb/operator](https://hub.docker.com/r/kubedb/operator)
  - [kubedb/memcached](https://hub.docker.com/r/kubedb/memcached)
  - [kubedb/memcached-exporter](https://hub.docker.com/r/kubedb/memcached-exporter)

- Update KubeDB catalog for private Docker registry. Ex:

  ```yaml
  apiVersion: catalog.kubedb.com/v1alpha1
  kind: MemcachedVersion
  metadata:
    name: 1.6.22
  spec:
    db:
      image: PRIVATE_REGISTRY/memcached:1.6.22-alpine
    exporter:
      image: PRIVATE_REGISTRY/memcached_exporter:v0.14.3
    podSecurityPolicies:
      databasePolicyName: memcached-db
    securityContext:
      runAsUser: 999
    version: 1.6.22
  ```

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```bash
  $ kubectl create ns demo
  namespace/demo created
   ```

## Create ImagePullSecret

ImagePullSecrets is a type of a Kubernete Secret whose sole purpose is to pull private images from a Docker registry. It allows you to specify the url of the docker registry, credentials for logging in and the image name of your private docker image.

Run the following command, substituting the appropriate uppercase values to create an image pull secret for your private Docker registry:

```bash
$ kubectl create secret docker-registry -n demo myregistrykey \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-email=DOCKER_EMAIL \
  --docker-password=DOCKER_PASSWORD
secret/myregistrykey created
```

If you wish to follow other ways to pull private images see [official docs](https://kubernetes.io/docs/concepts/containers/images/) of Kubernetes.

NB: If you are using `kubectl` 1.9.0, update to 1.9.1 or later to avoid this [issue](https://github.com/kubernetes/kubernetes/issues/57427).

## Install KubeDB operator

When installing KubeDB operator, set the flags `--docker-registry` and `--image-pull-secret` to appropriate value. Follow the steps to [install KubeDB operator](/docs/v2025.5.30/setup/README) properly in cluster so that to points to the DOCKER_REGISTRY you wish to pull images from.

## Deploy Memcached server from Private Registry

While deploying `Memcached` from private repository, you have to add `myregistrykey` secret in `Memcached` `spec.imagePullSecrets`.
Below is the Memcached CRD object we will create.

```yaml
apiVersion: kubedb.com/v1
kind: Memcached
metadata:
  name: memcd-pvt-reg
  namespace: demo
spec:
  replicas: 1
  version: "1.6.22"
  podTemplate:
    spec:
      containers:
      - name: memcached
        resources:
          limits:
            cpu: 500m
            memory: 128Mi
          requests:
            cpu: 250m
            memory: 64Mi
      imagePullSecrets:
      - name: myregistrykey
```

Now run the command to deploy this `Memcached` object:

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/memcached/private-registry/demo-2.yaml
memcached.kubedb.com/memcd-pvt-reg created
```

To check if the images pulled successfully from the repository, see if the `Memcached` is in running state:

```bash
$ kubectl get pods -n demo -w
NAME                             READY     STATUS              RESTARTS   AGE
memcd-pvt-reg-694d4d44df-bwtk8   0/1       ContainerCreating   0          18s
memcd-pvt-reg-694d4d44df-tkqc4   0/1       ContainerCreating   0          17s
memcd-pvt-reg-694d4d44df-zhj4l   0/1       ContainerCreating   0          17s
memcd-pvt-reg-694d4d44df-bwtk8   1/1       Running             0          25s
memcd-pvt-reg-694d4d44df-zhj4l   1/1       Running             0          26s
memcd-pvt-reg-694d4d44df-tkqc4   1/1       Running             0          27s

$ kubectl get mc -n demo
NAME            VERSION    STATUS    AGE
memcd-pvt-reg   1.6.22     Running   59s
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl patch -n demo mc/memcd-pvt-reg -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
memcached.kubedb.com/memcd-pvt-reg patched

$ kubectl delete -n demo mc/memcd-pvt-reg
memcached.kubedb.com "memcd-pvt-reg" deleted

$ kubectl delete -n demo secret myregistrykey
secret "myregistrykey" deleted

$ kubectl delete ns demo
namespace "demo" deleted
```

## Next Steps

- Monitor your Memcached server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.5.30/guides/memcached/monitoring/using-prometheus-operator).
- Monitor your Memcached server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.5.30/guides/memcached/monitoring/using-builtin-prometheus).
- Detail concepts of [Memcached object](/docs/v2025.5.30/guides/memcached/concepts/memcached).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.5.30/CONTRIBUTING).
