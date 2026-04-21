---
title: PgpoolAutoscaler CRD
menu:
  docs_v2025.7.30-rc.0:
    identifier: pp-autoscaler-concepts
    name: PgpoolAutoscaler
    parent: pp-concepts-pgpool
    weight: 26
menu_name: docs_v2025.7.30-rc.0
section_menu_id: guides
info:
  autoscaler: v0.42.0-rc.0
  cli: v0.57.0-rc.0
  dashboard: v0.33.0-rc.0
  installer: v2025.7.30-rc.0
  ops-manager: v0.44.0-rc.0
  provisioner: v0.57.0-rc.0
  schema-manager: v0.33.0-rc.0
  ui-server: v0.33.0-rc.0
  version: v2025.7.30-rc.0
  webhook-server: v0.33.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.7.30-rc.0/README).

# PgpoolAutoscaler

## What is PgpoolAutoscaler

`PgpoolAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling [Pgpool](https://pgpool.net/mediawiki/index.php/Main_Page) compute resources of Pgpool components in a Kubernetes native way.

## PgpoolAutoscaler CRD Specifications

Like any official Kubernetes resource, a `PgpoolAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `PgpoolAutoscaler` CROs for autoscaling different components of pgpool is given below:

**Sample `PgpoolAutoscaler` for pgpool:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: PgpoolAutoscaler
metadata:
  name: pgpool-auto-scale
  namespace: demo
spec:
  databaseRef:
    name: pgpool
  compute:
    pgpool:
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

Here, we are going to describe the various sections of a `PgpoolAutoscaler` crd.

A `PgpoolAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [Pgpool](/docs/v2025.7.30-rc.0/guides/pgpool/concepts/pgpool) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [Pgpool](/docs/v2025.7.30-rc.0/guides/pgpool/concepts/pgpool) object.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of Pgpool components. This field consists of the following sub-field:

- `trigger` indicates if compute autoscaling is enabled for this component of the pgpool. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.