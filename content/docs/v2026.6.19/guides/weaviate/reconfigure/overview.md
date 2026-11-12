---
title: Weaviate Reconfigure Overview
menu:
  docs_v2026.6.19:
    identifier: weaviate-reconfigure-overview
    name: Overview
    parent: weaviate-reconfigure
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

# Reconfigure Weaviate

This guide will give you an overview of how KubeDB Ops Manager reconfigures a `Weaviate` cluster.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Weaviate](/docs/v2026.6.19/guides/weaviate/concepts/weaviate)
  - [Custom Configuration](/docs/v2026.6.19/guides/weaviate/configuration/using-config-file)

## How Reconfigure Process Works

The reconfigure process consists of the following steps:

1. At first, a user creates a `Weaviate` CR (optionally with a custom configuration).

2. `KubeDB` provisioner operator watches for the `Weaviate` CR and creates a `PetSet` and related necessary resources.

3. Then, in order to change the configuration of the `Weaviate` cluster, the user creates a `WeaviateOpsRequest` CR with the desired configuration. The new configuration can be provided in one or more of the following ways:
   - `spec.configuration.configSecret` — a reference to a `Secret` holding the full `conf.yaml`.
   - `spec.configuration.applyConfig` — inline `conf.yaml` content that is merged on top of the existing configuration.
   - `spec.configuration.backupConfigSecret` — a reference to a `Secret` holding backup-related credentials.

4. `KubeDB` Ops Manager watches for the `WeaviateOpsRequest` CR.

5. When it finds one, it halts the `Weaviate` object so that the `KubeDB` provisioner operator doesn't perform any operation on the `Weaviate` during the reconfigure process.

6. Then the `KubeDB` Ops Manager prepares the new configuration, updates the PetSet, and restarts the pods one by one so they pick up the new configuration.

7. After successfully reconfiguring, the `KubeDB` Ops Manager updates the `Weaviate` object to reflect the new configuration and resumes the `Weaviate` object so that the `KubeDB` Provisioner operator resumes its usual operations.

In the next doc, we are going to show a step-by-step guide on reconfiguring a Weaviate cluster.
