---
title: Recommendation
menu:
  docs_v2026.6.5-rc.1:
    identifier: recommendation
    name: Recommendation
    parent: operatormanual
    weight: 10
menu_name: docs_v2026.6.5-rc.1
section_menu_id: operatormanual
url: /docs/v2026.6.5-rc.1/operatormanual/recommendation/
aliases:
- /docs/v2026.6.5-rc.1/operatormanual/recommendation/README/
info:
  autoscaler: v0.50.0-rc.1
  cli: v0.65.0-rc.1
  dashboard: v0.41.0-rc.1
  installer: v2026.6.5-rc.1
  ops-manager: v0.52.0-rc.1
  product: kubedb
  provisioner: v0.65.0-rc.1
  schema-manager: v0.41.0-rc.1
  ui-server: v0.41.0-rc.1
  version: v2026.6.5-rc.1
  webhook-server: v0.41.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2026.6.5-rc.1/README).

# Recommendation for KubeDB

Production databases on Kubernetes need regular, careful maintenance — security patches, version upgrades, TLS certificate rotations, and credential rotations. Skipping them risks exposure to known CVEs, expired certificates that break clients, and stale secrets that violate compliance. Doing them by hand is error-prone and easy to forget.

KubeDB solves this by **generating recommendations automatically**, as Kubernetes-native CRDs, whenever a managed database needs a maintenance action. The Supervisor then executes the recommendation either immediately, on operator approval, or inside a scheduled maintenance window — with full status tracked on the resource itself.

## Why it matters

- **Security** — older versions carry known vulnerabilities; expiring TLS certificates cause outages; stale auth secrets are an obvious attack surface.
- **Compliance** — auditors expect documented, repeatable rotation policies.
- **Operational safety** — execution is bounded by deadlines, retries, and (optionally) operator-approved windows, so disruptive ops never run at peak hours.

## How recommendations flow

A `Recommendation` is a custom resource created by the KubeDB **Ops-manager** and reconciled by the **Supervisor**. You need both installed; the easiest path is to enable the Supervisor when installing KubeDB via Helm:

```bash
--set supervisor.enabled=true
```

<p align="center">
<img alt="Recommendation Generation"  src="/docs/v2026.6.5-rc.1/operatormanual/recommendation/images/recommendation-generation.png">
</p>

1. The **KubeDB Provisioner** reconciles user-provided database CRs and creates all required resources.
2. Once the database is `Ready`, the **Ops-manager** inspects it and creates a `Recommendation` whenever an action is needed (vulnerable version, certificate near expiry, auth secret near rotation deadline, …).
3. The **Supervisor** watches the Recommendation, applies approval policies, waits for the configured maintenance window, and then creates the corresponding `OpsRequest` (e.g. `UpdateVersion`, `ReconfigureTLS`, `RotateAuth`).
4. The Supervisor watches the OpsRequest and updates the Recommendation status (`Succeeded`, `Failed`, `Skipped`, …) so the whole lifecycle is visible on one object.

## Recommendation types

KubeDB generates three kinds of recommendations:

1. [Version Update Recommendation](/docs/v2026.6.5-rc.1/operatormanual/recommendation/version-update-recommendation) — upgrade to a patched/newer database version.
2. [TLS Certificate Rotation Recommendation](/docs/v2026.6.5-rc.1/operatormanual/recommendation/rotate-tls-recommendation) — rotate certificates before expiry.
3. [Authentication Secret Rotation Recommendation](/docs/v2026.6.5-rc.1/operatormanual/recommendation/rotate-auth-recommendation) — rotate database credentials.

## Setup and configuration

- [Recommendation Configuration](/docs/v2026.6.5-rc.1/operatormanual/recommendation/configuration) — install Supervisor CRDs, enable the Supervisor via Helm, and tune generation timing flags.

## Configuring scheduling and approval

For automation and execution control, refer to:

- [Recommendation Spec & Status](/docs/v2026.6.5-rc.1/operatormanual/recommendation/recommendation-spec) — complete field reference for the Recommendation CRD.
- [Maintenance Window](/docs/v2026.6.5-rc.1/operatormanual/recommendation/maintenance-window) — namespace-scoped scheduling for automatic operations.
- [Cluster Maintenance Window](/docs/v2026.6.5-rc.1/operatormanual/recommendation/cluster-maintenance-window) — cluster-wide default maintenance scheduling.
- [Approval Policy](/docs/v2026.6.5-rc.1/operatormanual/recommendation/approval-policy) — link maintenance windows to resources for automatic recommendation execution.

The following pages walk through each recommendation type, show how to approve or reject them, and explain how to automate execution with maintenance windows.
