---
title: RabbitMQAutoscaler CRD
menu:
  docs_v2025.10.17:
    identifier: rm-autoscaler
    name: RabbitMQAutoscaler
    parent: rm-concepts-guides
    weight: 26
menu_name: docs_v2025.10.17
section_menu_id: guides
info:
  autoscaler: v0.44.0
  cli: v0.59.0
  dashboard: v0.35.0
  installer: v2025.10.17
  ops-manager: v0.46.0
  provisioner: v0.59.0
  schema-manager: v0.35.0
  ui-server: v0.35.0
  version: v2025.10.17
  webhook-server: v0.35.0
---

> New to KubeDB? Please start [here](/docs/v2025.10.17/README).

# RabbitMQAutoscaler

## What is RabbitMQAutoscaler

`RabbitMQAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [RabbitMQ](https://www.rabbitmq.com/) compute resources and storage of database components in a Kubernetes native way.

## RabbitMQAutoscaler CRD Specifications

Like any official Kubernetes resource, a `RabbitMQAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `RabbitMQAutoscaler` CROs for autoscaling different components of database is given below:

**Sample `RabbitMQAutoscaler`:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: RabbitMQAutoscaler
metadata:
  name: rabbitmq-autoscaler
  namespace: rabbit
spec:
  databaseRef:
    name: rabbitmq
  opsRequestOptions:
    timeout: 3m
    apply: IfReady
  compute:
    rabbitmq:
      trigger: "On"
      podLifeTimeThreshold: 5m
      resourceDiffPercentage: 20
      minAllowed:
        cpu: 1
        memory: "1.5Gi"
      maxAllowed:
        cpu: 2
        memory: 5Gi
      controlledResources: ["cpu", "memory"]
      containerControlledValues: "RequestsAndLimits"
  storage:
    rabbitmq:
      expansionMode: "Offline"
      trigger: "On"
      usageThreshold: 20
      scalingThreshold: 30
```

Here, we are going to describe the various sections of a `RabbitMQAutoscaler` crd.

A `RabbitMQAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [RabbitMQ](/docs/v2025.10.17/guides/rabbitmq/concepts/rabbitmq) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [RabbitMQ](/docs/v2025.10.17/guides/rabbitmq/concepts/rabbitmq) object.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of the database components. It has the following sub-fields:

- `trigger` indicates if compute autoscaling is enabled for this component of the database. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.

### spec.storage

`spec.compute` specifies the autoscaling configuration for the storage resources of the database components. This field consists of the following sub-field:

- `trigger` indicates if storage autoscaling is enabled for this component of the database. If "On" then storage autoscaling is enabled. If "Off" then storage autoscaling is disabled.
- `usageThreshold` indicates usage percentage threshold, if the current storage usage exceeds then storage autoscaling will be triggered.
- `scalingThreshold` indicates the percentage of the current storage that will be scaled.
- `expansionMode` indicates the volume expansion mode.
