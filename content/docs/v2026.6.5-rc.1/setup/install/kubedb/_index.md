---
title: Install KubeDB
description: Installation guide for KubeDB
menu:
  docs_v2026.6.5-rc.1:
    identifier: install-kubedb-enterprise
    name: KubeDB
    parent: installation-guide
    weight: 20
product_name: kubedb
menu_name: docs_v2026.6.5-rc.1
section_menu_id: setup
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

# Install KubeDB

## Get a Free License

Download a FREE license from [AppsCode License Server](https://appscode.com/issue-license?p=kubedb).

> KubeDB licensing process has been designed to work with CI/CD workflow. You can automatically obtain a license from your CI/CD pipeline by following the guide from [here](https://github.com/appscode/offline-license-server#offline-license-server).

## Choose an Installation Method

KubeDB can be installed in several ways. Pick the one that fits your workflow:

- [Helm 3](/docs/v2026.6.5-rc.1/setup/install/kubedb/helm) — recommended for most users.
- [YAML](/docs/v2026.6.5-rc.1/setup/install/kubedb/yaml) — render manifests and apply with `kubectl`.
- [ArgoCD](/docs/v2026.6.5-rc.1/setup/install/kubedb/argocd) — GitOps via ArgoCD `Application` resources.
- [FluxCD](/docs/v2026.6.5-rc.1/setup/install/kubedb/fluxcd) — GitOps via the Flux Helm Controller.
- [OpenShift](/docs/v2026.6.5-rc.1/setup/install/kubedb/openshift) — standard chart, Red Hat certified chart, or OperatorHub.

After installing, see [Common Configuration](/docs/v2026.6.5-rc.1/setup/install/kubedb/configuration) to enable database engines and verify the installation.

## Purchase KubeDB License

If you are interested in purchasing KubeDB license, please contact us via sales@appscode.com for further discussion. You can also set up a meeting via our [calendly link](https://calendly.com/appscode/intro).

If you are willing to purchase KubeDB but need more time to test in your dev cluster, feel free to contact sales@appscode.com. We will be happy to extend your trial period.
