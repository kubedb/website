---
title: QdrantOpsRequest CRD
menu:
  docs_v2026.7.10:
    identifier: qdrant-opsrequest-concepts
    name: QdrantOpsRequest
    parent: qdrant-concepts
    weight: 25
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

# QdrantOpsRequest

## What is QdrantOpsRequest

`QdrantOpsRequest` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Qdrant](https://qdrant.tech/) administrative operations like database version updating, horizontal scaling, vertical scaling, etc. in a Kubernetes native way.

## QdrantOpsRequest CRD Specifications

Like any official Kubernetes resource, a `QdrantOpsRequest` has `TypeMeta`, `ObjectMeta`, `Spec` and `Status` sections.

Here are some sample `QdrantOpsRequest` CRs for different administrative operations:

**Sample `QdrantOpsRequest` for updating database version:**

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: QdrantOpsRequest
metadata:
  name: qdops-update-version
  namespace: demo
spec:
  type: UpdateVersion
  databaseRef:
    name: qdrant-sample
  updateVersion:
    targetVersion: "1.18.0"
status:
  conditions:
  - lastTransitionTime: "2024-10-01T10:00:00Z"
    message: The controller has updated the Qdrant successfully
    reason: OpsRequestSuccessful
    status: "True"
    type: Successful
  phase: Successful
```

**Sample `QdrantOpsRequest` for horizontal scaling:**

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: QdrantOpsRequest
metadata:
  name: qdops-hscale-up
  namespace: demo
spec:
  type: HorizontalScaling
  databaseRef:
    name: qdrant-sample
  horizontalScaling:
    node: 5
status:
  conditions:
  - lastTransitionTime: "2024-10-01T10:00:00Z"
    message: The controller has scaled/updated the Qdrant successfully
    reason: OpsRequestSuccessful
    status: "True"
    type: Successful
  phase: Successful
```

**Sample `QdrantOpsRequest` for vertical scaling:**

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: QdrantOpsRequest
metadata:
  name: qdops-vscale
  namespace: demo
spec:
  type: VerticalScaling
  databaseRef:
    name: qdrant-sample
  verticalScaling:
    node:
      resources:
        requests:
          memory: "1Gi"
          cpu: "500m"
        limits:
          memory: "1Gi"
          cpu: "500m"
status:
  conditions:
  - lastTransitionTime: "2024-10-01T10:00:00Z"
    message: The controller has scaled/updated the Qdrant successfully
    reason: OpsRequestSuccessful
    status: "True"
    type: Successful
  phase: Successful
```

### QdrantOpsRequest `Spec`

A `QdrantOpsRequest` object has the following fields in the `spec` section:

#### spec.databaseRef

`spec.databaseRef` is a required field that points to the [Qdrant](/docs/v2026.7.10/guides/qdrant/concepts/qdrant) object where the administrative operations will be applied. It contains:

- `spec.databaseRef.name` — the name of the target Qdrant database (required).

#### spec.type

`spec.type` specifies the type of operation that will be applied to the database. Supported operations are:

- `Reconfigure` — reconfigure a running Qdrant database with new configuration.
- `ReconfigureTLS` — reconfigure TLS configuration for a running Qdrant database.
- `Restart` — restart the database pods in a rolling fashion.
- `RotateAuth` — rotate the authentication credentials of a running Qdrant database.
- `UpdateVersion` — update the version of a running Qdrant database.
- `HorizontalScaling` — scale the number of nodes up or down.
- `VerticalScaling` — vertically scale the resources (CPU and memory) of database pods.
- `VolumeExpansion` — expand the persistent volume claim size of a running Qdrant database.

#### spec.authentication

`spec.authentication` is used when `spec.type` is `RotateAuth`. It contains:

- `spec.authentication.secretRef` — a reference to the secret containing the new authentication credentials:
  - `apiGroup` — the API group of the referenced secret.
  - `kind` — the kind of the referenced secret.
  - `name` — the name of the secret (required).

#### spec.maxRetries

`spec.maxRetries` is an optional `<integer>` field that specifies the maximum number of times the ops request should be retried if it fails.

#### spec.migration

`spec.migration` is used when `spec.type` is `VolumeExpansion` or other migration-requiring operations. It contains:

- `spec.migration.storageClassName` — the target storage class name for migration.
- `spec.migration.oldPVReclaimPolicy` — the reclaim policy for the old PersistentVolume.

#### spec.restart

`spec.restart` is used when `spec.type` is `Restart`. It is an empty object (`{}`). No further configuration is needed for a restart operation.

#### spec.updateVersion

`spec.updateVersion` is used when `spec.type` is `UpdateVersion`. It contains:

- `spec.updateVersion.targetVersion` — the target `QdrantVersion` to update to.

#### spec.horizontalScaling

`spec.horizontalScaling` is used when `spec.type` is `HorizontalScaling`. It contains:

- `spec.horizontalScaling.node` — the desired number of Qdrant nodes.

#### spec.verticalScaling

`spec.verticalScaling` is used when `spec.type` is `VerticalScaling`. It contains:

- `spec.verticalScaling.node` — the per-node vertical scaling configuration:
  - `resources` — the CPU and memory resource requests and limits for Qdrant nodes.
  - `nodeSelectionPolicy` — the policy for selecting nodes to scale.
  - `topology` — the topology constraints for the vertical scaling operation:
    - `key` — the topology key (required).
    - `value` — the topology value (required).
- `spec.verticalScaling.mode` specifies how the scaling is actuated. `Restart` (the default) applies the new resources by restarting the Pods, while `InPlace` resizes the running Pods in place via the Kubernetes `pods/resize` subresource (no restart), automatically falling back to `Restart` for any Pod whose Node cannot fit the new resources. Optional; defaults to `Restart`.

#### spec.volumeExpansion

`spec.volumeExpansion` is used when `spec.type` is `VolumeExpansion`. It contains:

- `spec.volumeExpansion.node` — the per-node volume expansion configuration. Can be an empty object `{}` if the volume expansion should use defaults.
- `spec.volumeExpansion.mode` — the volume expansion mode. Can be `Online` or `Offline`.

#### spec.tls

`spec.tls` is used when `spec.type` is `ReconfigureTLS`. It contains:

- `spec.tls.client` — TLS configuration for client connections.
- `spec.tls.p2p` — TLS configuration for peer-to-peer connections.
- `spec.tls.remove` — specifies whether to remove TLS configuration.
- `spec.tls.rotateCertificates` — specifies whether to rotate TLS certificates.

#### spec.configuration

`spec.configuration` is used when `spec.type` is `Reconfigure`. It contains:

- `spec.configuration.applyConfig` — a map of key-value pairs for inline configuration changes.
- `spec.configuration.configSecret` — the secret containing the new configuration.
- `spec.configuration.removeCustomConfig` — specifies whether to remove the custom configuration.
- `spec.configuration.restart` — specifies the restart behavior after applying configuration. Supported values are `auto`, `true`, and `false`.

#### spec.timeout

`spec.timeout` is an optional field that specifies the timeout duration for the OpsRequest to complete. If the OpsRequest does not complete within the specified timeout, it will be marked as failed. The value is in the form of a Kubernetes duration (e.g., `5m`, `1h`).

#### spec.apply

`spec.apply` is an optional field that specifies when the OpsRequest will be applied. Possible values are `Always` and `IfReady`. The default is `IfReady`, which means the OpsRequest will only be applied when the target database is in `Ready` state.

### QdrantOpsRequest `Status`

`.status` describes the current state and progress of the `QdrantOpsRequest` operation. It has the following fields:

#### status.phase

`status.phase` indicates the overall phase of the operation for this `QdrantOpsRequest`. It can have the following values:

| Phase              | Meaning                                                                         |
|--------------------|---------------------------------------------------------------------------------|
| Pending            | The QdrantOpsRequest has been created but execution has not started yet           |
| Progressing        | KubeDB has started the execution of the applied QdrantOpsRequest                  |
| Successful         | KubeDB has successfully performed the operation requested in the QdrantOpsRequest |
| Failed             | KubeDB has failed the operation requested in the QdrantOpsRequest                 |
| Denied             | KubeDB has denied the operation requested in the QdrantOpsRequest                 |
| Skipped            | KubeDB has skipped the operation requested in the QdrantOpsRequest                |
| WaitingForApproval | The QdrantOpsRequest is waiting for approval before execution                     |

Ops-manager Operator can skip an opsRequest only if its execution has not been started yet and there is a newer opsRequest applied in the cluster. `spec.type` has to be the same as the skipped one, in this case.

#### status.pausedBackups

`status.pausedBackups` is a list of references to backup objects that were paused during the operation. Each entry has:

- `apiGroup` — the API group of the paused backup.
- `kind` — the kind of the paused backup.
- `name` — the name of the paused backup (required).
- `namespace` — the namespace of the paused backup.

#### status.observedGeneration

`status.observedGeneration` shows the most recent generation observed by the `QdrantOpsRequest` controller.

#### status.conditions

`status.conditions` is an array that specifies the conditions of different steps of `QdrantOpsRequest` processing. Each condition entry has the following fields:

- `type` specifies the type of the condition. QdrantOpsRequest has the following types of conditions:

| Type                | Meaning                                                                          |
|---------------------|----------------------------------------------------------------------------------|
| `Progressing`       | Specifies that the operation is now progressing                                  |
| `Successful`        | Specifies that the operation on the database has been successful                 |
| `HaltDatabase`      | Specifies that the database is halted by the operator                            |
| `ResumeDatabase`    | Specifies that the database is resumed by the operator                           |
| `Failed`            | Specifies that the operation on the database has failed                          |
| `Scaling`           | Specifies that the scaling operation on the database has started                 |
| `VerticalScaling`   | Specifies that vertical scaling has performed successfully on the database       |
| `HorizontalScaling` | Specifies that horizontal scaling has performed successfully on the database     |
| `Updating`          | Specifies that the database updating operation has started                       |
| `UpdateVersion`     | Specifies that version updating on the database has performed successfully       |

- The `status` field is a string, with possible values `"True"`, `"False"`, and `"Unknown"`.
    - `status` will be `"True"` if the current transition is succeeded.
    - `status` will be `"False"` if the current transition is failed.
    - `status` will be `"Unknown"` if the current transition is denied.
- The `message` field is a human-readable message indicating details about the condition.
- The `reason` field is a unique, one-word, CamelCase reason for the condition's last transition.
- The `lastTransitionTime` field provides a timestamp for when the operation last transitioned from one state to another.
- The `observedGeneration` shows the most recent condition transition generation observed by the controller.

## Next Steps

- Follow operation tutorials like [Restart](/docs/v2026.7.10/guides/qdrant/restart/restart) and [Volume Expansion](/docs/v2026.7.10/guides/qdrant/volume-expansion/volume-expansion).