---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-helmcharts
    name: Manage Cluster Helm Charts
    parent: cluster-management
    weight: 50
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Helm Chart Management

The **Helm** group in the Cluster UI sidebar gives you full visibility into your cluster's Helm ecosystem. It has three pages — Releases, HelmRelease, and HelmChart — covering deployed releases, FluxCD-managed releases, and chart sources respectively.

## Open the Helm Section

1. Navigate to the [Platform Console](https://console.appscode.com).
2. Click on your imported cluster to open its Cluster Overview page.
3. In the left sidebar, click **Helm** to expand it.

---

## Releases

The Releases page lists all Helm v3 releases currently deployed in your cluster — everything installed via `helm install`, regardless of how it got there. This is the primary page to check what is running, what version is deployed, and whether the release is in a healthy state.

Use this page to get a quick overview of all deployed charts, check release status, or install a new chart using the **+ Install Chart** button.

Lists every release with its **Name**, **Namespace**, **Status** (e.g. deployed, failed), **Version**, and **Age**. Use the **Select All** and **All Namespaces** dropdowns to filter the list.

![Helm Releases page showing all deployed Helm releases with name, namespace, status, version, and age columns](../images/cluster-helm-charts/helm-releases-deployed.png)

---

## HelmRelease

A HelmRelease is a FluxCD resource that declaratively manages a Helm chart installation. The Platform Console tracks every HelmRelease and shows its reconciliation state, so you can see whether a GitOps-driven installation or upgrade succeeded or is still in progress.

Use this page to check FluxCD-managed release health, spot failed reconciliations, or create a new HelmRelease from the UI.

Lists every HelmRelease with its **Namespace**, **Age**, **Ready** status, and a **Status** message showing the last Helm operation result. Click **+ Create HelmRelease** to define a new one.

![HelmRelease list page showing FluxCD-managed releases with namespace, age, ready, and status columns](../images/cluster-helm-charts/helm-releases-list.png)

---

## HelmChart

A HelmChart is a FluxCD resource that sources a specific chart and version from a HelmRepository. Each HelmRelease references a HelmChart behind the scenes. This page tells you which charts are being pulled, from where, and whether the source is reachable and up to date.

Use this page to verify chart versions in use, check that chart sources are resolving correctly, or create a new HelmChart resource.

Lists every HelmChart with its **Namespace**, **Annotations**, **Age**, **Chart** name, **Version**, **Source Kind**, **Source Name**, **Ready** state, and **Status**. Click **+ Create HelmChart** to add a new chart source.

![HelmChart list page showing chart name, version, source kind, source name, ready, and status columns](../images/cluster-helm-charts/helm-charts-list.png)

---

## Quick Reference

| Task | How to do it |
|---|---|
| View all deployed releases | Click **Releases** under the Helm group |
| Install a new chart | Click **+ Install Chart** on the Releases page |
| Check FluxCD-managed release health | Click **HelmRelease** under the Helm group |
| View chart sources | Click **HelmChart** under the Helm group |
| Create a new FluxCD release | Click **+ Create HelmRelease** on the HelmRelease page |
