---
title: Etcd
menu:
  docs_v2026.8.26-rc.2:
    identifier: etcd-readme-etcd
    name: Etcd
    parent: etcd-etcd-guides
    weight: 10
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
url: /docs/v2026.8.26-rc.2/guides/etcd/
aliases:
- /docs/v2026.8.26-rc.2/guides/etcd/README/
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

<!-- Drafted from source code and CRD schemas; not yet verified against a live cluster. -->

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

## Supported Etcd Features

| Features                                                                           | Availability |
|------------------------------------------------------------------------------------|:------------:|
| Clustered (single Raft cluster)                                                    |   &#10003;   |
| Single member cluster (`replicas: 1`)                                              |   &#10003;   |
| Authentication & Authorization (etcd RBAC, `root` user)                            |   &#10003;   |
| Custom Configuration (tuning knobs only)                                           |   &#10003;   |
| Externally manageable Auth Secret                                                  |   &#10003;   |
| Reconfigurable Health Checker                                                      |   &#10003;   |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) |   &#10003;   |
| Automated Version update                                                           |   &#10003;   |
| Automatic Vertical Scaling                                                         |   &#10003;   |
| Automated Horizontal Scaling (learner add & promote)                               |   &#10003;   |
| Automated Volume Expansion                                                         |   &#10003;   |
| Storage Class Migration                                                            |   &#10003;   |
| Move Raft Leadership / Defragment / Compact                                        |   &#10003;   |
| Backup/Recovery: Instant, Scheduled ([KubeStash](https://kubestash.com/))          |   &#10003;   |
| In-place restore into an existing cluster                                          |   &#10003;   |
| Recovery from a permanent Raft quorum loss                                         |   &#10003;   |
| Persistent Volume                                                                  |   &#10003;   |
| Builtin Prometheus Discovery                                                       |   &#10003;   |
| Using Prometheus operator                                                          |   &#10003;   |
| Autoscaler (compute & storage)                                                     |   &#10003;   |
| Recommendation Engine                                                              |   &#10003;   |
| GitOps                                                                             |   &#10003;   |
| Grafana Dashboards                                                                 |   &#10007;   |
| Continuous Archiving / Point-In-Time Recovery                                      |   &#10007;   |
| Multi-cluster / Disaster Recovery topology                                         |   &#10007;   |

A few notes on the table above:

- **Custom Configuration** for etcd is limited to the typed tuning knobs exposed through
  `spec.configuration.tuning` (`quotaBackendBytes`, `autoCompactionMode`,
  `autoCompactionRetention`, `snapshotCount`). etcd's `--config-file` is mutually exclusive
  with the individual command line flags KubeDB has to set for cluster bootstrap, so a
  free-form config file is intentionally not supported. Anything the tuning knobs do not cover can
  still be passed as a raw etcd flag through `spec.podTemplate.spec.containers[name=etcd].args`,
  which is appended after the operator's own flags. See
  [Etcd CRD](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcd#specconfiguration) and
  [Extra etcd flags](/docs/v2026.8.26-rc.2/guides/etcd/custom-configuration/using-config#extra-etcd-flags).
- **Backup/Recovery** is snapshot based only. etcd has no WAL-shipping style continuous
  archiving primitive that can be streamed out of the cluster, so there is no point-in-time
  recovery between two full snapshots. See
  [EtcdArchiver](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcdarchiver).
- **Monitoring** does not deploy an exporter sidecar. etcd serves its own Prometheus metrics
  natively, so KubeDB points the stats Service and the ServiceMonitor straight at etcd.
- No Grafana dashboards ship with KubeDB for etcd yet.

## Life Cycle of an Etcd Object

An `Etcd` object goes through the following phases, reported in `status.phase`:

| Phase          | Meaning                                                                                                            |
|----------------|--------------------------------------------------------------------------------------------------------------------|
| `Provisioning` | The KubeDB operator has accepted the object and is creating the offshoot resources (PetSet, Services, Secrets, RBAC). |
| `Ready`        | All members are up, the Raft cluster has quorum and the client endpoint is accepting connections.                   |
| `Critical`     | The client endpoint is reachable, but not every member is ready (for example a learner is still catching up).       |
| `NotReady`     | The client endpoint is not reachable — quorum has been lost or every member is down.                                |
| `Halted`       | `spec.halted` is `true`: every offshoot resource except the PVCs has been deleted.                                  |
| `Unknown`      | The phase could not be computed.                                                                                   |

In the normal path, an `Etcd` object moves `Provisioning` → `Ready`. When the cluster is
bootstrapped from a snapshot (`spec.init.archiver`), the operator restores the ordinal-0 volume
before the first member is ever started, so the object simply stays in `Provisioning` for longer;
the restore's own outcome is reported on the `SuccessfullyDataRestored` condition rather than as a
phase.

The phase is derived from the object's conditions — `ProvisioningStarted`, `ReplicaReady`,
`AcceptingConnection`, `Ready` and `Provisioned`. The health checker keeps them up to date by
calling etcd's own `Status()` and `MemberList()` RPCs on the client port and treating the cluster
as healthy while at least `N/2+1` members answer.

## User Guide

- [Quickstart Etcd](/docs/v2026.8.26-rc.2/guides/etcd/quickstart/quickstart) with KubeDB Operator.
- Secure your cluster with [TLS/SSL](/docs/v2026.8.26-rc.2/guides/etcd/tls/overview) and reconfigure it later with [ReconfigureTLS](/docs/v2026.8.26-rc.2/guides/etcd/reconfigure-tls/overview).
- Tune etcd with [custom configuration](/docs/v2026.8.26-rc.2/guides/etcd/custom-configuration/using-config).
- Scale your cluster [horizontally](/docs/v2026.8.26-rc.2/guides/etcd/scaling/horizontal-scaling/overview) or [vertically](/docs/v2026.8.26-rc.2/guides/etcd/scaling/vertical-scaling/overview).
- [Backup & Restore](/docs/v2026.8.26-rc.2/guides/etcd/backup/kubestash/overview/) etcd using KubeStash.
- [Restore a snapshot in place](/docs/v2026.8.26-rc.2/guides/etcd/restore/overview) into an `Etcd` cluster that already exists.
- [Recover from a permanent quorum loss](/docs/v2026.8.26-rc.2/guides/etcd/recover-from-quorum-loss/overview) when a majority of members is gone for good.
- [Rotate the authentication credential](/docs/v2026.8.26-rc.2/guides/etcd/rotate-authentication/overview) of the etcd `root` user.
- [Restart](/docs/v2026.8.26-rc.2/guides/etcd/restart/restart) the members with a leader-aware rolling restart.
- Autoscale [compute](/docs/v2026.8.26-rc.2/guides/etcd/autoscaler/compute/overview) and [storage](/docs/v2026.8.26-rc.2/guides/etcd/autoscaler/storage/overview) resources.
- Detail Concept of [Etcd Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcd).
- Detail Concept of [EtcdVersion Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcdversion).
- Detail Concept of [EtcdOpsRequest Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcdopsrequest).
- Detail Concept of [EtcdAutoscaler Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcdautoscaler).
- Detail Concept of [EtcdArchiver Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/etcdarchiver).
- Detail Concept of [AppBinding Object](/docs/v2026.8.26-rc.2/guides/etcd/concepts/appbinding).

## Next Steps

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.8.26-rc.2/CONTRIBUTING).
