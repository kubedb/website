---
title: SingleStoreAutoscaler CRD
menu:
  docs_v2025.4.30:
    identifier: sdb-autoscaler-concepts
    name: SingleStoreAutoscaler
    parent: sdb-concepts-singlestore
    weight: 26
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# SingleStoreAutoscaler

## What is SingleStoreAutoscaler

`SingleStoreAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [SingleStore](https://www.singlestore.com/) compute resources and storage of database components in a Kubernetes native way.

## SingleStoreAutoscaler CRD Specifications

Like any official Kubernetes resource, a `SingleStoreAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `SingleStoreAutoscaler` CROs for autoscaling different components of database is given below:

**Sample `SingleStoreAutoscaler` for cluster database:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: SinglestoreAutoscaler
metadata:
  name: sdb-as-cluster
  namespace: demo
spec:
  databaseRef:
    name: sdb-sample
  storage:
    leaf:
      trigger: "On"
      usageThreshold: 30
      scalingThreshold: 50
      expansionMode: "Offline"
      upperBound: "100Gi"
    aggregator:
      trigger: "On"
      usageThreshold: 40
      scalingThreshold: 50
      expansionMode: "Offline"
      upperBound: "100Gi"
  compute:
    aggregator:
      trigger: "On"
      podLifeTimeThreshold: 5m
      minAllowed:
        cpu: 900m
        memory: 3000Mi
      maxAllowed:
        cpu: 2000m
        memory: 6Gi
      controlledResources: ["cpu", "memory"]
      resourceDiffPercentage: 10
    leaf:
      trigger: "On"
      podLifeTimeThreshold: 5m
      minAllowed:
        cpu: 900m
        memory: 3000Mi
      maxAllowed:
        cpu: 2000m
        memory: 6Gi
      controlledResources: ["cpu", "memory"]
      resourceDiffPercentage: 10
```

**Sample `SingleStoreAutoscaler` for standalone database:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: SinglestoreAutoscaler
metadata:
  name: sdb-as-standalone
  namespace: demo
spec:
  databaseRef:
    name: sdb-standalone
  storage:
    node:
      trigger: "On"
      usageThreshold: 40
      scalingThreshold: 50
      expansionMode: "Offline"
      upperBound: "100Gi"
  compute:
    node:
      trigger: "On"
      podLifeTimeThreshold: 5m
      minAllowed:
        cpu: 900m
        memory: 3000Mi
      maxAllowed:
        cpu: 2000m
        memory: 6Gi
      controlledResources: ["cpu", "memory"]
      resourceDiffPercentage: 10
```

Here, we are going to describe the various sections of a `SingleStoreAutoscaler` crd.

A `SingleStoreAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [SingleStore](/docs/v2025.4.30/guides/singlestore/concepts/singlestore) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [SingleStore](/docs/v2025.4.30/guides/singlestore/concepts/singlestore) object.

### spec.opsRequestOptions
These are the options to pass in the internally created opsRequest CRO. `opsRequestOptions` has three fields. They have been described in details [here](/docs/v2025.4.30/guides/singlestore/concepts/opsrequest#specreadinesscriteria).

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of the database components. This field consists of the following sub-field:

- `spec.compute.standalone` indicates the desired compute autoscaling configuration for a standalone SingleStore database.
- `spec.compute.aggregator` indicates the desired compute autoscaling configuration for aggregator node of cluster mode.
- `spec.compute.leaf` indicates the desired compute autoscaling configuration for the leaf node of cluster mode.

All of them has the following sub-fields:

- `trigger` indicates if compute autoscaling is enabled for this component of the database. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.

### spec.storage

`spec.compute` specifies the autoscaling configuration for the storage resources of the database components. This field consists of the following sub-field:

- `spec.compute.standalone` indicates the desired storage autoscaling configuration for a standalone SingleStore database.
- `spec.compute.leaf` indicates the desired storage autoscaling configuration for leaf node of cluster mode.
- `spec.compute.aggregator` indicates the desired storage autoscaling configuration for aggregator node of cluster mode.

All of them has the following sub-fields:

- `trigger` indicates if storage autoscaling is enabled for this component of the database. If "On" then storage autoscaling is enabled. If "Off" then storage autoscaling is disabled.
- `usageThreshold` indicates usage percentage threshold, if the current storage usage exceeds then storage autoscaling will be triggered.
- `scalingThreshold` indicates the percentage of the current storage that will be scaled.
- `expansionMode` indicates the volume expansion mode.
