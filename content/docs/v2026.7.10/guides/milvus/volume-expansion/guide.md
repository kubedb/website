---
title: Milvus Volume Expansion
menu:
  docs_v2026.7.10:
    identifier: milvus-volume-expansion-guide
    name: Guide
    parent: milvus-volume-expansion
    weight: 20
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# Milvus Volume Expansion

This guide will show you how to use the `KubeDB` Ops-manager operator to expand the persistent volumes of a Milvus database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.7.10/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.7.10/guides/milvus/concepts/milvusopsrequest)
  - [Volume Expansion Overview](/docs/v2026.7.10/guides/milvus/volume-expansion/overview)

- Complete the dependency setup from [Prepare Dependencies](/docs/v2026.7.10/guides/milvus/quickstart/prerequisites). It installs MinIO, creates the `my-release-minio` secret, and installs the etcd operator required by Milvus.

- The PVC's `StorageClass` **must** support volume expansion (`allowVolumeExpansion: true`). The base examples use `local-path`, which does **not** support expansion, so this guide uses `longhorn-custom`:

  ```bash
  $ kubectl get sc longhorn-custom -o jsonpath='{.allowVolumeExpansion}'
  true
  ```

> Note: The yaml files used in this tutorial are stored in [docs/guides/milvus/volume-expansion/yamls](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/milvus/volume-expansion/yamls) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Volume Expansion — Standalone Milvus

Deploy a standalone Milvus on an expansion-capable `StorageClass` (here `longhorn-custom`) with a `1Gi` volume:

```bash
$ kubectl get pvc -n demo -l app.kubernetes.io/instance=milvus-standalone -o custom-columns=NAME:.metadata.name,SIZE:.status.capacity.storage,SC:.spec.storageClassName
NAME                       SIZE   SC
data-milvus-standalone-0   1Gi    longhorn-custom
```

### Offline Volume Expansion

`volume-expansion-offline-standalone.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: volume-expansion-offline
  namespace: demo
spec:
  type: VolumeExpansion
  databaseRef:
    name: milvus-standalone
  volumeExpansion:
    node: 4Gi
    mode: Offline
```

Here, `spec.volumeExpansion.node` is the standalone target size, and `mode: Offline` takes the pod down while the volume is resized.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/volume-expansion/yamls/volume-expansion-offline-standalone.yaml
milvusopsrequest.ops.kubedb.com/volume-expansion-offline created

$ kubectl get milvusopsrequest volume-expansion-offline -n demo
NAME                       TYPE              STATUS       AGE
volume-expansion-offline   VolumeExpansion   Successful   2m
```

The volume is now `4Gi`:

```bash
$ kubectl get pvc -n demo -l app.kubernetes.io/instance=milvus-standalone -o custom-columns=NAME:.metadata.name,SIZE:.status.capacity.storage,SC:.spec.storageClassName
NAME                       SIZE   SC
data-milvus-standalone-0   4Gi    longhorn-custom
```

### Online Volume Expansion

Online expansion grows the volume without taking the pod down. The example file requests `node: 4Gi`; since the volume is already `4Gi` after the offline step above, this walkthrough requests `6Gi` to demonstrate a second (online) expansion:

`volume-expansion-online-standalone.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: volume-expansion-online
  namespace: demo
spec:
  type: VolumeExpansion
  databaseRef:
    name: milvus-standalone
  volumeExpansion:
    node: 6Gi
    mode: Online
```

```bash
$ kubectl apply -f volume-expansion-online-standalone.yaml
milvusopsrequest.ops.kubedb.com/volume-expansion-online created

$ kubectl get milvusopsrequest volume-expansion-online -n demo
NAME                      TYPE              STATUS       AGE
volume-expansion-online   VolumeExpansion   Successful   2m4s
```

The volume has grown to `6Gi`, and the database spec reflects the new size:

```bash
$ kubectl get pvc -n demo -l app.kubernetes.io/instance=milvus-standalone -o custom-columns=NAME:.metadata.name,SIZE:.status.capacity.storage,SC:.spec.storageClassName
NAME                       SIZE   SC
data-milvus-standalone-0   6Gi    longhorn-custom

$ kubectl get milvuses.kubedb.com milvus-standalone -n demo -o jsonpath='{.spec.storage.resources.requests.storage}'
6Gi
```

## Volume Expansion — Distributed Milvus

For a distributed Milvus, volume expansion targets `streamingnode` — the only distributed role that carries a persistent volume. Point `spec.databaseRef.name` at `milvus-cluster` and use the `streamingnode` key:

`volume-expansion-online-distributed.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: volume-expansion-online
  namespace: demo
spec:
  type: VolumeExpansion
  databaseRef:
    name: milvus-cluster
  volumeExpansion:
    streamingnode: 4Gi
    mode: Online
```

(An `Offline` variant — `volume-expansion-offline-distributed.yaml` — uses `streamingnode: 3Gi` with `mode: Offline`.)

The operator expands the PVC of every `streamingnode` replica. Starting from `1Gi` on `longhorn-custom`, an **offline** expansion to `3Gi` followed by an **online** expansion to `4Gi`:

```bash
# offline: streamingnode 1Gi -> 3Gi
$ kubectl get milvusopsrequest volume-expansion-offline -n demo
NAME                       TYPE              STATUS       AGE
volume-expansion-offline   VolumeExpansion   Successful   ...

# online: streamingnode 3Gi -> 4Gi
$ kubectl get pvc -n demo -l app.kubernetes.io/instance=milvus-cluster -o custom-columns=NAME:.metadata.name,SIZE:.status.capacity.storage
NAME                                  SIZE
data-milvus-cluster-streamingnode-0   4Gi
data-milvus-cluster-streamingnode-1   4Gi
```

Both `streamingnode` replicas are expanded. The stateless roles (`mixcoord`, `datanode`, `querynode`, `proxy`) have no persistent volume and are unaffected.

> On a single-node test cluster, offline expansion of a distributed role can take a few minutes because the pods are restarted after the resize.

## Cleaning up

```bash
$ kubectl delete milvusopsrequest -n demo volume-expansion-offline volume-expansion-online
$ kubectl delete milvus.kubedb.com -n demo milvus-standalone
$ kubectl delete ns demo
```

## Next Steps

- Learn about [storage migration](/docs/v2026.7.10/guides/milvus/storage-migration/guide) of a Milvus database.
- Learn about [storage autoscaling](/docs/v2026.7.10/guides/milvus/autoscaler/storage/guide).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.7.10/CONTRIBUTING).
