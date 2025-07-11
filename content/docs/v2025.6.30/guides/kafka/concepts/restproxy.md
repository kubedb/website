---
title: RestProxy CRD
menu:
  docs_v2025.6.30:
    identifier: kf-restproxy-concepts
    name: RestProxy
    parent: kf-concepts-kafka
    weight: 35
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# RestProxy

## What is RestProxy

`RestProxy` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [RestProxy](https://www.apicur.io/registry/) in a Kubernetes native way. You only need to describe the desired configuration in a `RestProxy` object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## RestProxy Spec

As with all other Kubernetes objects, a RestProxy needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example RestProxy object.

```yaml
apiVersion: kafka.kubedb.com/v1alpha1
kind: RestProxy
metadata:
  name: restproxy
  namespace: demo
spec:
  version: 3.15.0
  healthChecker:
    failureThreshold: 3
    periodSeconds: 20
    timeoutSeconds: 10
  replicas: 3
  kafkaRef:
    name: kafka
    namespace: demo
  podTemplate:
    metadata:
      annotations:
        passMe: ToDatabasePod
      labels:
        thisLabel: willGoToPod
    controller:
      annotations:
        passMe: ToPetSet
      labels:
        thisLabel: willGoToSts
  deletionPolicy: WipeOut
```

### spec.version

`spec.version` is a required field specifying the name of the [SchemaRegistryVersion](/docs/v2025.6.30/guides/kafka/concepts/schemaregistryversion) CR where the docker images are specified. Currently, when you install KubeDB, it creates the following `SchemaRegistryVersion` resources,
- `2.5.11.final`
- `3.15.0`

### spec.replicas

`spec.replicas` the number of instances in Rest Proxy.

KubeDB uses `PodDisruptionBudget` to ensure that majority of these replicas are available during [voluntary disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions) so that quorum is maintained.

### spec.kafkaRef

`spec.kafkaRef` is a optional field that specifies the name and namespace of the appbinding for `Kafka` object that the `RestProxy` object is associated with.
```yaml
kafkaRef:
  name: <kafka-object-appbinding-name>
  namespace: <kafka-object-appbinding-namespace>
```

### spec.podTemplate

KubeDB allows providing a template for pod through `spec.podTemplate`. KubeDB operator will pass the information provided in `spec.podTemplate` to the PetSet created for RestProxy.

KubeDB accept following fields to set in `spec.podTemplate:`

- metadata:
    - annotations (pod's annotation)
    - labels (pod's labels)
- controller:
    - annotations (petset's annotation)
    - labels (petset's labels)
- spec:
    - volumes
    - initContainers
    - containers
    - imagePullSecrets
    - nodeSelector
    - serviceAccountName
    - schedulerName
    - tolerations
    - priorityClassName
    - priority
    - securityContext

You can check out the full list [here](https://github.com/kmodules/offshoot-api/blob/39bf8b2/api/v2/types.go#L44-L279). Uses of some field of `spec.podTemplate` is described below,

#### spec.podTemplate.spec.nodeSelector

`spec.podTemplate.spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .

#### spec.podTemplate.spec.resources

`spec.podTemplate.spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).

### spec.serviceTemplates

You can also provide template for the services created by KubeDB operator for Kafka cluster through `spec.serviceTemplates`. This will allow you to set the type and other properties of the services.

KubeDB allows following fields to set in `spec.serviceTemplates`:
- `alias` represents the identifier of the service. It has the following possible value:
    - `stats` is used for the exporter service identification.
- metadata:
    - labels
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
    - sessionAffinityConfig

See [here](https://github.com/kmodules/offshoot-api/blob/kubernetes-1.21.1/api/v1/types.go#L237) to understand these fields in detail.

### spec.deletionPolicy

`spec.deletionPolicy` gives flexibility whether to `nullify`(reject) the delete operation of `RestProxy` crd or which resources KubeDB should keep or delete when you delete `RestProxy` crd. KubeDB provides following four deletion policies:

- Delete
- DoNotTerminate
- WipeOut

When `deletionPolicy` is `DoNotTerminate`, KubeDB takes advantage of `ValidationWebhook` feature in Kubernetes 1.9.0 or later clusters to implement `DoNotTerminate` feature. If admission webhook is enabled, `DoNotTerminate` prevents users from deleting the database as long as the `spec.deletionPolicy` is set to `DoNotTerminate`.

## spec.healthChecker
It defines the attributes for the health checker.
- `spec.healthChecker.periodSeconds` specifies how often to perform the health check.
- `spec.healthChecker.timeoutSeconds` specifies the number of seconds after which the probe times out.
- `spec.healthChecker.failureThreshold` specifies minimum consecutive failures for the healthChecker to be considered failed.
- `spec.healthChecker.disableWriteCheck` specifies whether to disable the writeCheck or not.

Know details about KubeDB Health checking from this [blog post](https://appscode.com/blog/post/kubedb-health-checker/).

## Next Steps

- Learn how to use KubeDB to run a Apache Kafka Connect cluster [here](/docs/v2025.6.30/guides/kafka/README).
- Monitor your RestProxy with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2025.6.30/guides/kafka/monitoring/using-prometheus-operator).
- Detail concepts of [KafkaConnectorVersion object](/docs/v2025.6.30/guides/kafka/concepts/kafkaconnectorversion).
- Learn to use KubeDB managed Kafka objects using [CLIs](/docs/v2025.6.30/guides/kafka/cli/cli).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.6.30/CONTRIBUTING).
