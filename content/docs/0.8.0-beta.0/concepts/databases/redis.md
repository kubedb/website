---
title: Redis
menu:
  docs_0.8.0-beta.0:
    identifier: redis-db
    name: Redis
    parent: databases
    weight: 35
menu_name: docs_0.8.0-beta.0
section_menu_id: concepts
info:
  version: 0.8.0-beta.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.0/guides/README).

# Redis

## What is Redis
A `Redis` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Redis](https://redis.io/) in a Kubernetes native way. You only need to describe the desired database configuration in a Redis object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## Redis Spec
As with all other Kubernetes objects, a Redis needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example Redis object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Redis
metadata:
  name: r1
  namespace: demo
spec:
  version: 4
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  nodeSelector:
    disktype: ssd
  doNotPause: true
  monitor:
    agent: coreos-prometheus-operator
    prometheus:
      namespace: demo
      labels:
        app: kubedb
      interval: 10s
  resources:
    requests:
      memory: "64Mi"
      cpu: "250m"
    limits:
      memory: "128Mi"
      cpu: "500m"
```

### spec.version
`spec.version` is a required field specifying the version of Redis database. Official [Redis docker images](https://hub.docker.com/r/library/redis/tags/) will be used for the specific version.


### spec.storage
`spec.storage` is an optional field that specifies the StorageClass of PVCs dynamically allocated to store data for the database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests. If no storage spec is given, an `emptyDir` is used.

 - `spec.storage.storageClassName` is the name of the StorageClass used to provision PVCs. PVCs don’t necessarily have to request a class. A PVC with its storageClassName set equal to "" is always interpreted to be requesting a PV with no class, so it can only be bound to PVs with no class (no annotation or one set equal to ""). A PVC with no storageClassName is not quite the same and is treated differently by the cluster depending on whether the DefaultStorageClass admission plugin is turned on.

 - `spec.storage.accessModes` uses the same conventions as Kubernetes PVCs when requesting storage with specific access modes.

 - `spec.storage.resources` can be used to request specific quantities of storage. This follows the same resource model used by PVCs.

To learn how to configure `spec.storage`, please visit the links below:
 - https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims


### spec.nodeSelector
`spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .


### spec.doNotPause
`spec.doNotPause` is an optional field that tells KubeDB operator that if this Redis object is deleted, whether it should be reverted automatically. This should be set to `true` for production databases to avoid accidental deletion. If not set or set to false, deleting a Redis object put the database into a dormant state. The StatefulSet for a DormantDatabase is deleted but the underlying PVCs are left intact. This allows user to resume the database later.


### spec.monitor
To learn how to monitor Redis databases, please visit [here](/docs/0.8.0-beta.0/concepts/monitoring).


### spec.resources
`spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


## Next Steps
- Learn how to use KubeDB to run a Redis database [here](/docs/0.8.0-beta.0/guides/redis/overview).
- See the list of supported storage providers for snapshots [here](/docs/0.8.0-beta.0/concepts/snapshot).
- Thinking about monitoring your database? KubeDB works [out-of-the-box with Prometheus](/docs/0.8.0-beta.0/guides/monitoring).
- Learn how to use KubeDB in a [RBAC](/docs/0.8.0-beta.0/guides/rbac) enabled cluster.
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.0/CONTRIBUTING).
