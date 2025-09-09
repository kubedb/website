---
title: IgniteAutoscaler CRD
menu:
  docs_v2025.8.31:
    identifier: ig-autoscaler-concepts
    name: IgniteAutoscaler
    parent: ig-concepts-ignite
    weight: 20
menu_name: docs_v2025.8.31
section_menu_id: guides
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

# IgniteAutoscaler

## What is IgniteAutoscaler

`IgniteAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [Ignite](https://ignite.apache.org/) compute resources and storage of database components in a Kubernetes native way.

## IgniteAutoscaler CRD Specifications

Like any official Kubernetes resource, a `IgniteAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `IgniteAutoscaler` CROs for autoscaling different components of database is given below:

**Sample `IgniteAutoscaler` for `ignite` cluster:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: IgniteAutoscaler
metadata:
  name: ignite-autoscale-ops
  namespace: demo
spec:
  databaseRef:
    name: ignite-autoscale
  compute:
    ignite:
      trigger: "On"
      podLifeTimeThreshold: 5m
      resourceDiffPercentage: 20
      minAllowed:
        cpu: 600m
        memory: 1.2Gi
      maxAllowed:
        cpu: 1
        memory: 2Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
```

Here, we are going to describe the various sections of a `IgniteAutoscaler` crd.

A `IgniteAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [Ignite](/docs/v2025.8.31/guides/ignite/concepts/ignite) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [Ignite](/docs/v2025.8.31/guides/ignite/concepts/ignite) object.

### spec.opsRequestOptions
These are the options to pass in the internally created opsRequest CRO. `opsRequestOptions` has two fields.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of the database components. This field consists of the following sub-field:

- `spec.compute.ignite` indicates the desired compute autoscaling configuration for Ignite database.


`spec.compute.ignite` has the following sub-fields:

- `trigger` indicates if compute autoscaling is enabled for this component of the database. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.

There are two more fields, those are only specifiable for the percona variant inMemory databases.
- `inMemoryStorage.UsageThresholdPercentage` If db uses more than usageThresholdPercentage of the total memory, memoryStorage should be increased.
- `inMemoryStorage.ScalingFactorPercentage` If db uses more than usageThresholdPercentage of the total memory, memoryStorage should be increased by this given scaling percentage.

### spec.storage

`spec.storage` specifies the autoscaling configuration for the storage resources of the database components. This field consists of the following sub-field:

- `spec.storage.ignite` indicates the desired storage autoscaling configuration for Ignite cluster.


All of them has the following sub-fields:

- `trigger` indicates if storage autoscaling is enabled for this component of the database. If "On" then storage autoscaling is enabled. If "Off" then storage autoscaling is disabled.
- `usageThreshold` indicates usage percentage threshold, if the current storage usage exceeds then storage autoscaling will be triggered.
- `scalingThreshold` indicates the percentage of the current storage that will be scaled.
- `expansionMode` indicates the volume expansion mode.
