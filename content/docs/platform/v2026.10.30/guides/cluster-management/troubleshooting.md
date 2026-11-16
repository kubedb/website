---
layout: docs
menu:
  docsplatform_v2026.10.30:
    identifier: cluster-management-troubleshooting
    name: Troubleshooting
    parent: cluster-management
    weight: 90
menu_name: docsplatform_v2026.10.30
section_menu_id: guides
info:
  kubedb-installer: v2026.10.30
  kubeops-installer: v2026.10.30
  product: kubedbplatform
  version: v2026.10.30
---

# Troubleshooting Clusters

This page covers the most common problems seen while upgrading, reconciling, and removing
clusters managed by the KubeDB Platform. Each section follows the same pattern:
**Symptom → Check → Fix**.

Terms used below:

- **Hub cluster** — the cluster running the Open Cluster Management (OCM) hub. It holds one
  `ManagedCluster` object per spoke.
- **Spoke cluster** — a cluster joined to the hub. It runs the `klusterlet` agent, installed
  by the `cluster-manager-spoke` Helm chart.
- **HelmRelease (HR)** — the FluxCD resource through which every platform feature is
  installed (see [Feature Reference](../feature-reference.md)).

---

## Before You Start

Collect the current state first. Run these against the cluster that shows the problem.

```bash
# All HelmReleases and their Ready status
kubectl get helmreleases -A

# Only the ones that are not Ready
kubectl get helmreleases -A | grep -v True

# Flux controllers must be running
kubectl get pods -n flux-system
```

On the hub cluster, check the spoke's connection state:

```bash
kubectl get managedclusters
```

```
NAME           HUB ACCEPTED   MANAGED CLUSTER URLS     JOINED   AVAILABLE   AGE
monitoring-1   true           https://10.2.1.87:6443   True     Unknown     12d
```

`AVAILABLE=Unknown` means the spoke's agent stopped reporting to the hub (the cluster is
**inactive**). See [Removing an Inactive Cluster](#removing-an-inactive-cluster).

Through the API, the same information is available from
[`GET /clustersv2/{owner}/{cluster}/status`](../../../api/cluster-management-v2/clusters.md).

---

## Stuck Reconciliation

### Symptom

A HelmRelease stays `Ready=Unknown` with the message `Reconciliation in progress`, or the
version shown in the UI does not change after an upgrade.

### Check

```bash
kubectl describe helmrelease <name> -n <namespace>
```

Look at the `Conditions` and `Events` sections. The common causes:

| What you see | Cause |
|---|---|
| `spec.suspend: true` | The HelmRelease is suspended and will not reconcile. |
| `HelmChart ... is not ready` / `source not found` | The chart source (HelmRepository / HelmChart) is failing. |
| `dependency ... is not ready` | A HelmRelease listed in `spec.dependsOn` is not Ready yet. |
| No new events for a long time | The Flux controllers are not running or are crash-looping. |

### Fix

1. **Suspended** — resume it:
   ```bash
   kubectl patch helmrelease <name> -n <namespace> --type merge -p '{"spec":{"suspend":false}}'
   ```
2. **Source not ready** — check the source object and the source-controller logs:
   ```bash
   kubectl get helmrepositories,helmcharts -A | grep -v True
   kubectl logs -n flux-system deploy/source-controller --tail=100
   ```
3. **Dependency not ready** — fix the HelmRelease it depends on first; this one follows.
4. **Controllers not running** — check `kubectl get pods -n flux-system` and the
   `helm-controller` logs:
   ```bash
   kubectl logs -n flux-system deploy/helm-controller --tail=100
   ```
5. **Force a reconcile** once the cause is fixed:
   ```bash
   kubectl annotate helmrelease <name> -n <namespace> \
     reconcile.fluxcd.io/requestedAt="$(date +%s)" --overwrite
   ```
   From the API, [`GET /clustersv2/{owner}/{cluster}/reconcile?features=<feature>`](../../../api/cluster-management-v2/clusters.md)
   does the same for the HelmReleases of the given features.

---

## HelmRelease Progress Issues

### Symptom

A HelmRelease shows `Ready=False` with a reason such as `InstallFailed`, `UpgradeFailed`, or
`RetriesExceeded`, and the upgrade does not move forward.

### Check

```bash
kubectl get helmrelease <name> -n <namespace> \
  -o jsonpath='{range .status.conditions[*]}{.type}={.status} {.reason}: {.message}{"\n"}{end}'

# Helm's own history of the release
helm history <release-name> -n <release-namespace>
```

### Fix

| Situation | Fix |
|---|---|
| A pod in the release does not become Ready (image pull, resources, probe) | Fix the workload (`kubectl describe pod`, `kubectl logs`). Then force a reconcile (see above). |
| `RetriesExceeded` | Fix the cause, then suspend and resume the HelmRelease to reset the retry counter. |
| `helm history` shows the last revision as `pending-install`, `pending-upgrade`, or `pending-rollback` | A previous Helm operation was interrupted and holds the release lock. Roll back to the last `deployed` revision with `helm rollback <release-name> <revision> -n <release-namespace>`, then force a reconcile. |

Suspend and resume:

```bash
kubectl patch helmrelease <name> -n <namespace> --type merge -p '{"spec":{"suspend":true}}'
kubectl patch helmrelease <name> -n <namespace> --type merge -p '{"spec":{"suspend":false}}'
```

If the upgrade job reported a release as failed but the HelmRelease is already on the target
chart version with `Ready=True`, a later reconciliation succeeded. No action is needed.

---

## Spoke Version Does Not Change

### Symptom

After upgrading a spoke from the Hub UI, `CURRENT VERSION` in
`kubectl get managedclusterprofilebinding -A` shows the target version, but the HelmReleases on
the spoke stay on the old version.

### Check

1. On the hub cluster, check that the spoke is connected:
   ```bash
   kubectl get managedclusters
   ```
   The spoke must show `JOINED=True` and `AVAILABLE=True`.
2. On the spoke cluster, check the HelmReleases:
   ```bash
   kubectl get helmreleases -A | grep -v True
   ```

### Fix

- **`AVAILABLE=Unknown`** — the hub cannot deliver the new version to the spoke. Restore the
  spoke's connectivity, or remove it (see [Removing an Inactive Cluster](#removing-an-inactive-cluster)).
- **Spoke connected, HelmReleases not Ready** — follow [Stuck Reconciliation](#stuck-reconciliation)
  and [HelmRelease Progress Issues](#helmrelease-progress-issues) on the spoke.

---

## ClusterSet Stays Unaligned

### Symptom

After **Update Cluster Set**, the ClusterSet still shows the old **Current version** or a cluster
labelled **unaligned**.

### Check

On the hub cluster, find the spoke that is not on the target version:

```bash
kubectl get managedclusterprofilebinding -A
```

### Fix

1. Upgrade that spoke (see [Upgrade ACE Clusters](../cluster-upgrade.md#step-3--upgrade-spoke-clusters)),
   or remove it if it is no longer in use (see [Removing a Cluster](#removing-a-cluster)).
2. Click **Update Cluster Set** again.

---

## Removing a Cluster

### Removing through the API

[`POST /clustersv2/{owner}/{cluster}/remove`](../../../api/cluster-management-v2/clusters.md)
is **asynchronous**: `200` means the removal task was accepted, not that it finished.

- Call it **once**.
- Poll [`GET /clustersv2/{owner}/{cluster}/status`](../../../api/cluster-management-v2/clusters.md)
  to follow progress. The cluster is removed when it no longer appears in the cluster list.
- Do not call `remove` again while the first removal is running. A second call returns
  `409 Conflict` with `cluster removal already in progress`.

### Removing an Inactive Cluster

When a spoke is inactive (`AVAILABLE=Unknown` on the hub), the platform cannot reach it, so
removal skips the spoke-side cleanup. The spoke's `ManagedCluster` object stays on the hub
and must be removed manually.

**On the hub cluster:**

1. Delete the `ManagedCluster`. This is the only hub object you need to remove; OCM cleans up
   the cluster's namespace, ManifestWorks, and add-ons.
   ```bash
   kubectl delete managedcluster <cluster-name> --wait=false
   kubectl get managedcluster <cluster-name>
   ```
2. If it stays in `Terminating`, the finalizers are waiting for an agent that no longer
   responds. Remove them:
   ```bash
   kubectl patch managedcluster <cluster-name> --type merge -p '{"metadata":{"finalizers":null}}'
   ```

**On the spoke cluster** (if you can still reach it):

1. Check whether the OCM agent is still installed:
   ```bash
   kubectl get klusterlet
   helm ls -A --all | grep cluster-manager-spoke
   ```
2. If either returns a result, the spoke still thinks it belongs to the hub. Uninstall the
   chart using the namespace shown by `helm ls`:
   ```bash
   helm uninstall cluster-manager-spoke -n <namespace>
   ```
3. If the `klusterlet` object stays in `Terminating`, remove its finalizers:
   ```bash
   kubectl patch klusterlet klusterlet --type merge -p '{"metadata":{"finalizers":null}}'
   ```

See also [Remove / Delete Cluster](../remove-cluster.md) for removing a cluster from the UI.
