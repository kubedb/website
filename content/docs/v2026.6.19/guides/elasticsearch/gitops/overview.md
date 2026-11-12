---
title: Elasticsearch GitOps Overview
description: Elasticsearch GitOps Overview
menu:
  docs_v2026.6.19:
    identifier: es-gitops-overview
    name: Overview
    parent: es-gitops
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# GitOps Overview for Elasticsearch

This guide will give you an overview of how KubeDB `gitops` operator works with Elasticsearch databases using the `gitops.kubedb.com/v1alpha1` API. It will help you understand the GitOps workflow for
managing Elasticsearch databases in Kubernetes.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Elasticsearch](/docs/v2026.6.19/guides/elasticsearch/concepts/elasticsearch/)
    - [ElasticsearchOpsRequest](/docs/v2026.6.19/guides/elasticsearch/concepts/elasticsearch-ops-request/)



## Workflow GitOps with Elasticsearch

The following diagram shows how the `KubeDB` GitOps Operator used to sync with your database. Open the image in a new tab to see the enlarged version.


<figure align="center">

  <img alt="GitOps Flow" src="/docs/v2026.6.19/images/gitops/gitops.jpg">

<figcaption align="center">Fig: GitOps process of Elasticsearch</figcaption>

</figure>

1. **Define GitOps Elasticsearch**: Create Custom Resource (CR) of kind `Elasticsearch` using the `gitops.kubedb.com/v1alpha1` API.
2. **Store in Git**: Push the CR to a Git repository.
3. **Automated Deployment**: Use a GitOps tool (like `ArgoCD` or `FluxCD`) to monitor the Git repository and synchronize the state of the Kubernetes cluster with the desired state defined in Git.
4. **Create Database**: The GitOps operator creates a corresponding KubeDB Elasticsearch CR in the Kubernetes cluster to deploy the database.
5. **Handle Updates**: When you update the ElasticsearchGitOps CR, the operator generates an Ops Request to safely apply the update(e.g. `VerticalScaling`, `HorizontalScaling`, `VolumeExapnsion`, `Reconfigure`, `RotateAuth`, `ReconfigureTLS`, `VersionUpdate`, ans `Restart`.

This flow makes managing Elasticsearch databases efficient, reliable, and fully integrated with GitOps practices.

In the next doc, we are going to show a step by step guide on running Elasticsearch using GitOps.
