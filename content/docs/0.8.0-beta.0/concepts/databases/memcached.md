---
title: Memcached
menu:
  docs_0.8.0-beta.0:
    identifier: memcached-db
    name: Memcached
    parent: databases
    weight: 15
menu_name: docs_0.8.0-beta.0
section_menu_id: concepts
info:
  version: 0.8.0-beta.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.0/guides/README).

# Memcached

## What is Memcached
A `Memcached` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Memcached](https://memcached.org/) in a Kubernetes native way. You only need to describe the desired database configuration in a Memcached object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## Memcached Spec
As with all other Kubernetes objects, a Memcached needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example of a Memcached object.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Memcached
metadata:
  name: mc1
  namespace: demo
spec:
  replicas: 3
  version: 1.5.3-alpine
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
### spec.replicas
`spec.replicas` is an optional field that specifies the number of desired Instances/Replicas of Memcached database. If you do not specify .spec.replicas, then it defaults to 1.


### spec.version
`spec.version` is a required field specifying the version of Memcached database. Here the database version is [`1.5.3-alpine`](https://hub.docker.com/r/library/memcached/tags/).


### spec.nodeSelector
`spec.nodeSelector` is an optional field that specifies a map of key-value pairs. For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). To learn more, see [here](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector) .


### spec.doNotPause
`spec.doNotPause` is an optional field that tells KubeDB operator that if this Memcached object is deleted, whether it should be reverted automatically. This should be set to `true` for production databases to avoid accidental deletion. If not set or set to false, deleting a Memcached object put the database into a dormant state. 


### spec.monitor
To learn how to monitor Memcached databases, please visit [here](/docs/0.8.0-beta.0/concepts/monitoring).


### spec.resources
`spec.resources` is an optional field. This can be used to request compute resources required by the database pods. To learn more, visit [here](http://kubernetes.io/docs/user-guide/compute-resources/).


## Next Steps
- Learn how to use KubeDB to run a Memcached database [here](/docs/0.8.0-beta.0/guides/memcached/overview).
- Thinking about monitoring your database? KubeDB works [out-of-the-box with Prometheus](/docs/0.8.0-beta.0/guides/monitoring).
- Learn how to use KubeDB in a [RBAC](/docs/0.8.0-beta.0/guides/rbac) enabled cluster.
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.0/CONTRIBUTING).
