---
title: Install | KubeDB
description: Installation guide for KubeDB
menu:
  docs_v2026.7.10:
    identifier: install-kubedb-readme
    name: Overview
    parent: install-kubedb-enterprise
    weight: 5
product_name: kubedb
menu_name: docs_v2026.7.10
section_menu_id: setup
url: /docs/v2026.7.10/setup/install/kubedb/
aliases:
- /docs/v2026.7.10/setup/install/kubedb/README/
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

# Install KubeDB

## Get a Free License

Download a FREE license from [AppsCode License Server](https://appscode.com/issue-license?p=kubedb).

> KubeDB licensing process has been designed to work with CI/CD workflow. You can automatically obtain a license from your CI/CD pipeline by following the guide from [here](https://github.com/appscode/offline-license-server#offline-license-server).

## Choose an Installation Method

KubeDB can be installed in several ways. Pick the one that fits your workflow:

- [Helm 3](/docs/v2026.7.10/setup/install/kubedb/helm) — recommended for most users.
- [YAML](/docs/v2026.7.10/setup/install/kubedb/yaml) — render manifests and apply with `kubectl`.
- [ArgoCD](/docs/v2026.7.10/setup/install/kubedb/argocd) — GitOps via ArgoCD `Application` resources.
- [FluxCD](/docs/v2026.7.10/setup/install/kubedb/fluxcd) — GitOps via the Flux Helm Controller.
- [OpenShift](/docs/v2026.7.10/setup/install/kubedb/openshift) — standard chart, Red Hat certified chart, or OperatorHub.

After installing, see [Common Configuration](/docs/v2026.7.10/setup/install/kubedb/configuration) to enable database engines and verify the installation.

## Purchase KubeDB License

If you are interested in purchasing KubeDB license, please contact us via sales@appscode.com for further discussion. You can also set up a meeting via our [calendly link](https://calendly.com/appscode/intro).

If you are willing to purchase KubeDB but need more time to test in your dev cluster, feel free to contact sales@appscode.com. We will be happy to extend your trial period.
