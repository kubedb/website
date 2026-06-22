---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-k8sworkloads
    name: Kubernetes Workload Management
    parent: cluster-management
    weight: 40
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Kubernetes Workload Management

The Kubernetes Workload Management section in the Platform Console manages Kubernetes resources.

1. Navigate to the [Platform Console](https://console.appscode.com).
2. Click on your imported cluster to access the Cluster Overview page.

## Cluster Overview Page

The Cluster Overview page provides essential information about your cluster, including a node list, available FeatureSets, and their respective statuses (enabled or disabled).

## Left Sidebar Navigation

The left sidebar presents a variety of options for managing Kubernetes workloads:

- **Kubernetes:**
  - Overview
  - Nodes

- **Workloads:**
  - Deployments
  - Replica Sets
  - Replication Sets
  - Stateful Sets
  - Daemon Sets
  - Jobs
  - Cron Jobs
  - Pods

- **Helm:**
  - Releases

- **Datastore:**
  - Postgres
  - Elasticsearch
  - MongoDB (and others managed by KubeDB)

- **Service & Discovery:**
  - Services
  - Ingresses
  - Network Policies

- **Config:**
  - Config Maps
  - Secrets

- **Storage:**
  - Persistent Volume Claims
  - Persistent Volumes
  - Storage Classes

- **Monitoring:**
  - Alertmanager
  - PodMonitor
  - Prometheus
  - ServiceMonitor
  - PrometheusRule

- **Security:**
  - Service Accounts
  - Policy
  - Gatekeeper Report

- **Admin:**
  - Namespaces
  - Resource Quotas
  - Cluster Roles
  - Roles
  - CSI Drivers

You can customize the left sidebar by clicking the ⚙️ icon on the navbar, navigating to the Cluster Settings page, and selecting the `Sidebar` tab. Refer to the [Sidebar Management Documentation](cluster-sidebar.md) for more details.

## Resource Management

Select any resource from the left sidebar to list the resources. From there, you can go to the resource details page. The available options for each resource include:

- Basic Overview
- Resource Components
- Related Resources
- Events
- Graph of Connected Resources
- Resource Manifest

The `Datastore` section is dedicated to KubeDB, an AppsCode product, for managing various types of databases. You can create new databases, explore overviews, components, connected resources, and manifests for each database.

You can also create new resources directly from any resource list page by clicking the `➕ Create` button, filling out the form, and submitting to create the resource.
