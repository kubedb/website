---
title: PgBouncerAutoscaler CRD
menu:
  docs_v2025.5.30:
    identifier: pb-autoscaler-concepts
    name: PgBouncerAutoscaler
    parent: pb-concepts-pgbouncer
    weight: 35
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

# PgBouncerAutoscaler

## What is PgBouncerAutoscaler

`PgBouncerAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [PgBouncer](https://www.pgbouncer.org/usage.html) compute resources of PgBouncer components in a Kubernetes native way.

## PgBouncerAutoscaler CRD Specifications

Like any official Kubernetes resource, a `PgBouncerAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `PgBouncerAutoscaler` CROs for autoscaling different components of pgbouncer is given below:

**Sample `PgBouncerAutoscaler` for pgbouncer:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: PgBouncerAutoscaler
metadata:
  name: pgbouncer-auto-scale
  namespace: demo
spec:
  databaseRef:
    name: pgbouncer-server
  compute:
    pgbouncer:
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
```

Here, we are going to describe the various sections of a `PgBouncerAutoscaler` crd.

A `PgBouncerAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [PgBouncer](/docs/v2025.5.30/guides/pgbouncer/concepts/pgbouncer) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [PgBouncer](/docs/v2025.5.30/guides/pgbouncer/concepts/pgbouncer) object.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of PgBouncer components. This field consists of the following sub-field:

- `trigger` indicates if compute autoscaling is enabled for this component of the pgbouncer. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.