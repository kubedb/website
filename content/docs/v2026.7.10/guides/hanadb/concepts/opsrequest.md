---
title: HanaDBOpsRequest CRD
menu:
  docs_v2026.7.10:
    identifier: hanadb-concepts-opsrequest
    name: HanaDBOpsRequest
    parent: guides-hanadb-concepts
    weight: 20
menu_name: docs_v2026.7.10
section_menu_id: guides
info:
  autoscaler: v0.51.0
  cli: v0.66.0
  dashboard: v0.42.0
  installer: v2026.7.10
  ops-manager: v0.53.0
  product: kubedb
  provisioner: v0.66.0
  schema-manager: v0.42.0
  ui-server: v0.42.0
  version: v2026.7.10
  webhook-server: v0.42.0
---

> New to KubeDB? Please start [here](/docs/v2026.7.10/README).

# HanaDBOpsRequest

## What is HanaDBOpsRequest

`HanaDBOpsRequest` is a Kubernetes `Custom Resource Definition` (CRD). It provides a declarative way to
run **day-2 operations** — such as restart, reconfiguration, scaling, volume expansion, storage
migration, TLS management, and credential rotation — against an existing `HanaDB` database. The KubeDB
Ops-manager operator watches `HanaDBOpsRequest` objects and orchestrates the change while keeping the
database available.

## Supported operation types

Every operation type below is implemented by the KubeDB Ops-manager operator for HanaDB:

| `spec.type`          | What it does                                                             | Guide |
|----------------------|-------------------------------------------------------------------------|-------|
| `Restart`            | Rolling restart of the database pods.                                   | [Restart](/docs/v2026.7.10/guides/hanadb/restart/restart) |
| `Reconfigure`        | Apply / change / remove custom `global.ini` configuration.              | [Reconfigure](/docs/v2026.7.10/guides/hanadb/reconfigure/reconfigure) |
| `ReconfigureTLS`     | Add, rotate, or remove TLS certificates.                                | [Reconfigure TLS](/docs/v2026.7.10/guides/hanadb/tls/overview) |
| `VerticalScaling`    | Change CPU/memory of the database (and sidecar) containers.             | [Vertical Scaling](/docs/v2026.7.10/guides/hanadb/scaling/vertical-scaling/vertical-scaling) |
| `VolumeExpansion`    | Grow the data PVCs (requires an expandable StorageClass).               | [Volume Expansion](/docs/v2026.7.10/guides/hanadb/volume-expansion/volume-expansion) |
| `HorizontalScaling`  | Add/remove nodes of a System Replication cluster.                       | — |
| `StorageMigration`   | Move the data volumes to a different StorageClass.                      | [Storage Migration](/docs/v2026.7.10/guides/hanadb/storage-migration/storage-migration) |
| `RotateAuth`         | Rotate the `SYSTEM` password (auto-generated or user-provided).         | [Rotate Authentication](/docs/v2026.7.10/guides/hanadb/rotate-authentication/rotate-authentication) |

## HanaDBOpsRequest Spec

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: HanaDBOpsRequest
metadata:
  name: hdbops-restart
  namespace: demo
spec:
  type: Restart
  databaseRef:
    name: hanadb-cluster
  timeout: 30m
  apply: IfReady
```

### spec.databaseRef

`spec.databaseRef.name` is **required** and references the target `HanaDB` object in the same namespace.

### spec.type

`spec.type` is **required** and is one of the supported operation types listed above.

### spec.timeout

`spec.timeout` bounds how long the operation may run before it is marked failed (for example `30m`). It
is **required** for `StorageMigration` and recommended for every storage-heavy or restart-heavy
operation.

### spec.apply

`spec.apply` controls when the operation starts:

- `IfReady` (default) — wait until the database is `Ready` before applying.
- `Always` — apply even if the database is not `Ready` (used by `Restart` to recover an unhealthy
  database).

### Operation-specific fields

Each type reads its own sub-spec:

- `spec.restart` — empty marker for `Restart`.
- `spec.configuration` — `{ configSecret, applyConfig, removeCustomConfig, restart }` for `Reconfigure`.
  `applyConfig` keys must be `global.ini`; the values are **merged** with the existing inline
  configuration. `restart` is `auto` (default), `true`, or `false`.
- `spec.tls` — `{ issuerRef, certificates, rotateCertificates, remove }` for `ReconfigureTLS`.
- `spec.verticalScaling` — `{ hanadb, coordinator, exporter }` resources for `VerticalScaling`.
- `spec.verticalScaling.mode` specifies how the scaling is actuated. `Restart` (the default) applies the
  new resources by restarting the Pods, while `InPlace` resizes the running Pods in place via the
  Kubernetes `pods/resize` subresource (no restart), automatically falling back to `Restart` for any Pod
  whose Node cannot fit the new resources. Optional; defaults to `Restart`.
- `spec.volumeExpansion` — `{ hanadb, mode }` where `mode` is `Online` or `Offline`, for `VolumeExpansion`.
- `spec.horizontalScaling` — `{ replicas }` for `HorizontalScaling` (System Replication only, `>= 2`).
- `spec.migration` — `{ storageClassName, oldPVReclaimPolicy }` for `StorageMigration`.
- `spec.authentication` — `{ secretRef }` for `RotateAuth` (omit to auto-generate a new password).

## HanaDBOpsRequest Status

`status.phase` of a `HanaDBOpsRequest` is one of `Pending`, `Progressing`, `Successful`, `Failed`,
`Skipped`, `WaitingForApproval`, `Approved`, or `Denied`. The `status.conditions` array records each
step of the operation (for example `UpdatePetSets`, `RestartPods`, `Successful`).

## Next Steps

- Run a [Restart](/docs/v2026.7.10/guides/hanadb/restart/restart) or [Reconfigure](/docs/v2026.7.10/guides/hanadb/reconfigure/reconfigure).
- Review the [HanaDB CRD](/docs/v2026.7.10/guides/hanadb/concepts/hanadb).
