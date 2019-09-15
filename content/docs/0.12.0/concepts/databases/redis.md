---
title: Redis
menu:
  docs_0.12.0:
    identifier: redis-db
    name: Redis
    parent: databases
    weight: 35
menu_name: docs_0.12.0
section_menu_id: concepts
info:
  version: 0.12.0
---

> New to KubeDB? Please start [here](/docs/0.12.0/concepts/README).

# Redis

## What is Redis

`Redis` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Redis](https://redis.io/) in a Kubernetes native way. You only need to describe the desired database configuration in a Redis object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

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
  mode: Cluster
  cluster:
    master: 3
    replicas: 1
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  monitor:
    agent: prometheus.io/coreos-operator
    prometheus:
      namespace: demo
      labels:
        app: kubedb
      interval: 10s
  configSource:
    configMap:
      name: rd-custom-config
  podTemplate:
    annotations:
      passMe: ToDatabasePod
    controller:
      annotations:
        passMe: ToStatefulSet
    spec:
      schedulerName: my-scheduler
      nodeSelector:
        disktype: ssd
      imagePullSecrets:
      - name: myregistrykey
      args:
      - "--loglevel verbose"
      env:
      - name: ENV_VARIABLE
        value: "value"
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
  serviceTemplate:
    annotations:
      passMe: ToService
    spec:
      type: NodePort
      ports:
      - name:  http
        port:  9200
        targetPort: http
  terminationPolicy: Pause
  updateStrategy:
    type: RollingUpdate
```

### spec.version

`spec.version` is a required field specifying the name of the [RedisVersion](/docs/0.12.0/concepts/catalog/redis) crd where the docker images are specified. Currently, when you install KubeDB, it creates the following `RedisVersion` crd,

- `4.0.11`, `4.0.6-v2`, `4.0.6-v1`, `4.0.6`, `4.0-v2`, `4.0-v1`, `4.0`, `4-v1`, `4`, `5.0.3-v1`, `5.0.3`, `5.0-v1`, `5.0`

### spec.mode

`spec.mode` specifies the mode in which Redis server instance(s) will be deployed. The possible values are either `"Standalone"` or `"Cluster"`. The default value is `"Standalone"`.

- ***Standalone***: In this mode, the operator to starts a standalone Redis server.

- ***Cluster***: In this mode, the operator will deploy Redis cluster.

### spec.cluster

If `spec.mode` is set to `"Cluster"`, users can optionally provide a cluster specification. Currently, the following two parameters can be configured:

- `spec.cluster.master`: specifies the number of Redis master nodes. It must be greater or equal to 3. If not set, the operator set it to 3.
- `spec.cluster.replicas`: specifies the number of replica nodes per master. It must be greater than 0. If not set, the operator set it to 1.

> If `spec.mode` is set to `"Cluster"`, then `spec.replicas` field is ignored.

### spec.storage

Since 0.10.0-rc.0, If you set `spec.storageType:` to `Durable`, then  `spec.storage` is a required field that specifies the StorageClass of PVCs dynamically allocated to store data for the database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests.

- `spec.storage.storageClassName` is the name of the StorageClass used to provision PVCs. PVCs don’t necessarily have to request a class. A PVC with its storageClassName set equal to "" is always interpreted to be requesting a PV with no class, so it can only be bound to PVs with no class (no annotation or one set equal to ""). A PVC with no storageClassName is not quite the same and is treated differently by the cluster depending on whether the DefaultStorageClass admission plugin is turned on.
- `spec.storage.accessModes` uses the same conventions as Kubernetes PVCs when requesting storage with specific access modes.
- `spec.storage.resources` can be used to request specific quantities of storage. This follows the same resource model used by PVCs.

To learn how to configure `spec.storage`, please visit the links below:

- https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims

### spec.monitor

Redis managed by KubeDB can be monitored with builtin-Prometheus and CoreOS-Prometheus operator out-of-the-box. To learn more,

- [Monitor Redis with builtin Prometheus](/docs/0.12.0/guides/redis/monitoring/using-builtin-prometheus)
- [Monitor Redis with CoreOS Prometheus operator](/docs/0.12.0/guides/redis/monitoring/using-coreos-prometheus-operator)

### spec.configSource

`spec.configSource` is an optional field that allows users to provide custom configuration for Redis. This field accepts a [`VolumeSource`](https://github.com/kubernetes/api/blob/release-1.11/core/v1/types.go#L47). So you can use any kubernetes supported volume source such as `configMap`, `secret`, `azureDisk` etc. To learn more about how to use a custom configuration file see [here](/docs/0.12.0/guides/redis/custom-config/using-custom-config).

### spec.podTemplate

KubeDB allows providing a template for database pod through `spec.podTemplate`. KubeDB operator will pass the information provided in `spec.podTemplate` to the StatefulSet created for Redis server.

KubeDB accept following fields to set in `spec.podTemplate:`

- metadata:
  - annotations (pod's annotation)
- controller:
  - annotations (statefulset's annotation)
- spec:
  - args
  - env
  - resources
  - initContainers
  - imagePullSecrets
  - nodeSelector
  - affinity
  - schedulerName
  - tolerations
  - priorityClassName
  - priority
  - securityContext
  - livenessProbe
  - readinessProbe
  - lifecycle

Uses of some field of `spec.podTemplate` is described below,

#### spec.podTemplate.spec.args
 `spec.podTemplate.spec.args` is an optional field. This can be used to provide additional arguments to database installation.

### spec.podTemplate.spec.env

`spec.podTemplate.spec.env` is an optional field that specifies the environment variables to pass to the Redis docker image.

Note that, KubeDB does not allow to update the environment variables. If you try to update environment variables, KubeDB operator will reject the request with following error,

```ini
Error from server (BadRequest): error when applying patch:
...
for: "./redis.yaml": admission webhook "redis.validators.kubedb.com" denied the request: precondition failed for:
...
At least one of the following was changed:
apiVersion
kind
name
namespace
spec.storage
spec.podTemplate.spec.nodeSelector
spec.podTemplate.spec.env
```

#### spec.podTemplate.spec.imagePullSecret

`KubeDB` provides the flexibility of deploying Redis server from a private Docker registry. To learn how to deploy Redis from a private registry, please visit [here](/docs/0.12.0/guides/redis/private-registry/using-private-registry).

#### spec.podTemplate.spec.nodeSelector

`spec.podTemplate.spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .

#### spec.podTemplate.spec.resources

`spec.podTemplate.spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).

### spec.serviceTemplate

You can also provide a template for the services created by KubeDB operator for Redis server through `spec.serviceTemplate`. This will allow you to set the type and other properties of the services.

KubeDB allows following fields to set in `spec.serviceTemplate`:

- metadata:
  - annotations
- spec:
  - type
  - ports
  - clusterIP
  - externalIPs
  - loadBalancerIP
  - loadBalancerSourceRanges
  - externalTrafficPolicy
  - healthCheckNodePort

### spec.updateStrategy

You can specify [update strategy](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#update-strategies) of StatefulSet created by KubeDB for Redis server thorough `spec.updateStrategy` field. The default value of this field is `RollingUpdate`. In future, we will use this field to determine how automatic migration from old KubeDB version to new one should behave.

### spec.terminationPolicy

`terminationPolicy` gives flexibility whether to `nullify`(reject) the delete operation of `Redis` crd or which resources KubeDB should keep or delete when you delete `Redis` crd. KubeDB provides following four termination policies:

- DoNotTerminate
- Pause (`Default`)
- Delete
- WipeOut

When, `terminationPolicy` is `DoNotTerminate`, KubeDB takes advantage of `ValidationWebhook` feature in Kubernetes 1.9.0 or later clusters to implement `DoNotTerminate` feature. If admission webhook is enabled, `DoNotTerminate` prevents users from deleting the database as long as the `spec.terminationPolicy` is set to `DoNotTerminate`.

Following table show what KubeDB does when you delete Redis crd for different termination policies,

|          Behaviour          | DoNotTerminate |  Pause   |  Delete  | WipeOut  |
| --------------------------- | :------------: | :------: | :------: | :------: |
| 1. Block Delete operation   |    &#10003;    | &#10007; | &#10007; | &#10007; |
| 2. Create Dormant Database  |    &#10007;    | &#10003; | &#10007; | &#10007; |
| 3. Delete StatefulSet       |    &#10007;    | &#10003; | &#10003; | &#10003; |
| 4. Delete Services          |    &#10007;    | &#10003; | &#10003; | &#10003; |
| 5. Delete PVCs              |    &#10007;    | &#10007; | &#10003; | &#10003; |
| 6. Delete Secrets           |    &#10007;    | &#10007; | &#10007; | &#10003; |

If you don't specify `spec.terminationPolicy` KubeDB uses `Pause` termination policy by default.

## Next Steps

- Learn how to use KubeDB to run a Redis server [here](/docs/0.12.0/guides/redis/README).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.12.0/CONTRIBUTING).
