---
title: FerretDBAutoscaler CRD
menu:
  docs_v2025.10.17:
    identifier: fr-autoscaler-concepts
    name: FerretDBAutoscaler
    parent: fr-concepts-ferretdb
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

# FerretDBAutoscaler

## What is FerretDBAutoscaler

`FerretDBAutoscaler` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration for autoscaling `FerretDB` compute resources of FerretDB components in a Kubernetes native way.

## FerretDBAutoscaler CRD Specifications

Like any official Kubernetes resource, a `FerretDBAutoscaler` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here, some sample `FerretDBAutoscaler` CROs for autoscaling different components of ferretdb is given below:

**Sample `FerretDBAutoscaler` for ferretdb:**

```yaml
apiVersion: autoscaling.kubedb.com/v1alpha1
kind: FerretDBAutoscaler
metadata:
  name: ferretdb-auto-scale
  namespace: demo
spec:
  databaseRef:
    name: ferretdb
  compute:
    primary:
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

Here, we are going to describe the various sections of a `FerretDBAutoscaler` crd.

A `FerretDBAutoscaler` object has the following fields in the `spec` section.

### spec.databaseRef

`spec.databaseRef` is a required field that point to the [FerretDB](/docs/v2025.10.17/guides/ferretdb/concepts/ferretdb) object for which the autoscaling will be performed. This field consists of the following sub-field:

- **spec.databaseRef.name :** specifies the name of the [FerretDB](/docs/v2025.10.17/guides/ferretdb/concepts/ferretdb) object.

### spec.compute

`spec.compute` specifies the autoscaling configuration for the compute resources i.e. cpu and memory of FerretDB components. This field consists of the following sub-field:
- `primary` indicates autoscaling information for ferretdb primary server.
- `secondary` indicates autoscaling information for ferretdb secondary server.

On each `spec.compute.primary` or `spec.compute.secondary` field, these are the sub-field:

- `trigger` indicates if compute autoscaling is enabled for this component of the ferretdb. If "On" then compute autoscaling is enabled. If "Off" then compute autoscaling is disabled.
- `minAllowed` specifies the minimal amount of resources that will be recommended, default is no minimum.
- `maxAllowed` specifies the maximum amount of resources that will be recommended, default is no maximum.
- `controlledResources` specifies which type of compute resources (cpu and memory) are allowed for autoscaling. Allowed values are "cpu" and "memory".
- `containerControlledValues` specifies which resource values should be controlled. Allowed values are "RequestsAndLimits" and "RequestsOnly".
- `resourceDiffPercentage` specifies the minimum resource difference between recommended value and the current value in percentage. If the difference percentage is greater than this value than autoscaling will be triggered.
- `podLifeTimeThreshold` specifies the minimum pod lifetime of at least one of the pods before triggering autoscaling.