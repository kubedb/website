---
title: Kafka GitOps Overview
description: Kafka GitOps Overview
menu:
  docs_v2026.6.5-rc.1:
    identifier: kf-gitops-overview
    name: Overview
    parent: kf-gitops
    weight: 10
menu_name: docs_v2026.6.5-rc.1
section_menu_id: guides
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

# GitOps Overview for Kafka

This guide will give you an overview of how KubeDB `gitops` operator works with Kafka databases using the `gitops.kubedb.com/v1alpha1` API. It will help you understand the GitOps workflow for
managing Kafka databases in Kubernetes.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [Kafka](/docs/v2026.6.5-rc.1/guides/kafka/concepts/kafka)
    - [KafkaOpsRequest](/docs/v2026.6.5-rc.1/guides/kafka/concepts/kafkaopsrequest)



## Workflow GitOps with Kafka

The following diagram shows how the `KubeDB` GitOps Operator used to sync with your database. Open the image in a new tab to see the enlarged version.


<figure align="center">

  <img alt="GitOps Flow" src="/docs/v2026.6.5-rc.1/images/gitops/gitops.jpg">

<figcaption align="center">Fig: GitOps process of Kafka</figcaption>

</figure>

1. **Define GitOps Kafka**: Create Custom Resource (CR) of kind `Kafka` using the `gitops.kubedb.com/v1alpha1` API.
2. **Store in Git**: Push the CR to a Git repository.
3. **Automated Deployment**: Use a GitOps tool (like `ArgoCD` or `FluxCD`) to monitor the Git repository and synchronize the state of the Kubernetes cluster with the desired state defined in Git.
4. **Create Database**: The GitOps operator creates a corresponding KubeDB Kafka CR in the Kubernetes cluster to deploy the database.
5. **Handle Updates**: When you update the KafkaGitOps CR, the operator generates an Ops Request to safely apply the update(e.g. `VerticalScaling`, `HorizontalScaling`, `VolumeExapnsion`, `Reconfigure`, `RotateAuth`, `ReconfigureTLS`, `VersionUpdate`, ans `Restart`.

This flow makes managing Kafka databases efficient, reliable, and fully integrated with GitOps practices.

In the next doc, we are going to show a step by step guide on running Kafka using GitOps.
