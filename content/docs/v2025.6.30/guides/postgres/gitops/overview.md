---
title: PostgreSQL GitOps Overview
description: PostgreSQL GitOps Overview
menu:
  docs_v2025.6.30:
    identifier: pg-gitops-overview
    name: Overview
    parent: pg-gitops-postgres
    weight: 10
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# GitOps Overview for PostgreSQL

This guide will give you an overview of how KubeDB `gitops` operator works with PostgreSQL databases using the `gitops.kubedb.com/v1alpha1` API. It will help you understand the GitOps workflow for managing PostgreSQL databases in Kubernetes.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Postgres](/docs/v2025.6.30/guides/postgres/concepts/postgres)
    - [PostgresOpsRequest](/docs/v2025.6.30/guides/postgres/concepts/opsrequest)
    - GitOps [Postgres](/docs/v2025.6.30/guides/postgres/concepts/postgres-gitops)

## Workflow GitOps with PostgreSQL

The following diagram shows how the `KubeDB` GitOps Operator used to sync with your database. Open the image in a new tab to see the enlarged version.

<figure align="center">
  <img alt="GitOps Flow" src="/docs/v2025.6.30/images/gitops/gitops.png">
<figcaption align="center">Fig: GitOps process of Postgres</figcaption>
</figure>

1. **Define GitOps Postgres**: Create Custom Resource (CR) of kind `Postgres` using the `gitops.kubedb.com/v1alpha1` API.
2. **Store in Git**: Push the CR to a Git repository.
3. **Automated Deployment**: Use a GitOps tool (like `ArgoCD` or `FluxCD`) to monitor the Git repository and synchronize the state of the Kubernetes cluster with the desired state defined in Git.
4. **Create Database**: The GitOps operator creates a corresponding KubeDB Postgres CR in the Kubernetes cluster to deploy the database.
5. **Handle Updates**: When you update the PostgresGitOps CR, the operator generates an Ops Request to safely apply the update(e.g. `VerticalScaling`, `HorizontalScaling`, `VolumeExapnsion`, `Reconfigure`, `RotateAuth`, `ReconfigureTLS`, `VersionUpdate`, ans `Restart`.

This flow makes managing PostgreSQL databases efficient, reliable, and fully integrated with GitOps practices.

In the next doc, we are going to show a step by step guide on running postgres using GitOps.
