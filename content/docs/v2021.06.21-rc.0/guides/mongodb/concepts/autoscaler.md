---
title: MongoDBAutoscaler CRD
menu:
  docs_v2021.06.21-rc.0:
    identifier: mg-autoscaler-concepts
    name: MongoDBAutoscaler
    parent: mg-concepts-mongodb
    weight: 26
menu_name: docs_v2021.06.21-rc.0
section_menu_id: guides
info:
  autoscaler: v0.4.0-rc.0
  cli: v0.19.0-rc.0
  community: v0.19.0-rc.0
  enterprise: v0.6.0-rc.0
  installer: v2021.06.21-rc.0
  version: v2021.06.21-rc.0
---

> New to KubeDB? Please start [here](/docs/v2021.06.21-rc.0/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.06.21-rc.0/setup/install/enterprise) to try this feature." >}}

# MongoDBAutoscaler

## What is MongoDBAutoscaler

`MongoDBAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [MongoDB](https://www.mongodb.com/) compute resources and storage of database components in a Kubernetes native way.

## MongoDBAutoscaler CRD Specifications

Like any official Kubernetes resource, a `MongoDBAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `MongoDBAutoscaler` CROs for autoscaling different components of database is given below:

**Sample `MongoDBAutoscaler` for standalone database:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: MongoDBAutoscaler
metadata:
  name: mg-as
  namespace: demo
spec:
  databaseRef:
    name: mg-standalone
  compute:
    standalone:
      trigger: "On"
      podLifeTimeThreshold: 24h
      minAllowed:
        cpu: 250m
        memory: 350Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
      resourceDiffPercentage: 10
  storage:
    standalone:
      trigger: "On"
      usageThreshold: 60
      scalingThreshold: 50
```

**Sample `MongoDBAutoscaler` for replicaset database:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: MongoDBAutoscaler
metadata:
  name: mg-as-rs
  namespace: demo
spec:
  databaseRef:
    name: mg-rs
  compute:
    replicaSet:
      trigger: "On"
      podLifeTimeThreshold: 24h
      minAllowed:
        cpu: 200m
        memory: 300Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
      resourceDiffPercentage: 10
  storage:
    replicaSet:
      trigger: "On"
      usageThreshold: 60
      scalingThreshold: 50
```

**Sample `MongoDBAutoscaler` for sharded database:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: MongoDBAutoscaler
metadata:
  name: mg-as-sh
  namespace: demo
spec:
  databaseRef:
    name: mg-sh
  compute:
    shard:
      trigger: "On"
      podLifeTimeThreshold: 24h
      minAllowed:
        cpu: 250m
        memory: 350Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
      resourceDiffPercentage: 10
    configServer:
      trigger: "On"
      podLifeTimeThreshold: 24h
      minAllowed:
        cpu: 250m
        memory: 350Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
      resourceDiffPercentage: 10
    mongos:
      trigger: "On"
      podLifeTimeThreshold: 24h
      minAllowed:
        cpu: 250m
        memory: 350Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
      resourceDiffPercentage: 10
  storage:
    shard:
      trigger: "On"
      usageThreshold: 60
      scalingThreshold: 50
    configServer:
      trigger: "On"
      usageThreshold: 60
      scalingThreshold: 50
```

Here, we are going to describe the various sections of a `MongoDBAutoscaler` crd.

A `MongoDBAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [MongoDB](/docs/v2021.06.21-rc.0/guides/mongodb/concepts/mongodb) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [MongoDB](/docs/v2021.06.21-rc.0/guides/mongodb/concepts/mongodb) object.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of the database components. This field consists of the following sub-field:

- `spec.compute.standalone` indicates the desired compute autoscaling configuration for a standalone MongoDB database.
- `spec.compute.replicaSet` indicates the desired compute autoscaling configuration for replicaSet of a MongoDB database.
- `spec.compute.configServer` indicates the desired compute autoscaling configuration for config servers of a sharded MongoDB database.
- `spec.compute.mongos` indicates the desired compute autoscaling configuration for the mongos nodes of a sharded MongoDB database.
- `spec.compute.shard` indicates the desired compute autoscaling configuration for the shard nodes of a sharded MongoDB database.

All of them has the following sub-fields:

- `trigger` indicates if compute autoscaling is enabled for this component of the database. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.
- `InMemoryScalingThreshold` the percentage of the Memory that will be passed as inMemorySizeGB for inmemory database engine, which is only available for the percona variant of the mongodb.

### spec.storage

`spec.compute` specifies the autoscaling configuration for the storage resources of the database components. This field consists of the following sub-field:

- `spec.compute.standalone` indicates the desired storage autoscaling configuration for a standalone MongoDB database.
- `spec.compute.replicaSet` indicates the desired storage autoscaling configuration for replicaSet of a MongoDB database.
- `spec.compute.configServer` indicates the desired storage autoscaling configuration for config servers of a sharded MongoDB database.
- `spec.compute.shard` indicates the desired storage autoscaling configuration for the shard nodes of a sharded MongoDB database.

All of them has the following sub-fields:

- `trigger` indicates if storage autoscaling is enabled for this component of the database. If "On" then storage autoscaling is enabled. If "Off" then storage autoscaling is disabled.
- `usageThreshold` indicates usage percentage threshold, if the current storage usage exceeds then storage autoscaling will be triggered.
- `scalingThreshold` indicates the percentage of the current storage that will be scaled.
