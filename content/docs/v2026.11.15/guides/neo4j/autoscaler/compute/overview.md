---
title: Neo4j Compute Autoscaling Overview
menu:
  docs_v2026.11.15:
    identifier: neo4j-compute-autoscaling-overview
    name: Overview
    parent: neo4j-compute-autoscaling
    weight: 10
menu_name: docs_v2026.11.15
section_menu_id: guides
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

# Neo4j Compute Autoscaling

KubeDB can automatically adjust the CPU and memory assigned to Neo4j pods. A `Neo4jAutoscaler` observes real resource usage, generates recommendations, and creates a `Neo4jOpsRequest` when the recommended resources differ sufficiently from the current allocation.

## Before You Begin

You should be familiar with:

- [Neo4j](/docs/v2026.11.15/guides/neo4j/concepts/neo4j)
- [Neo4jAutoscaler](/docs/v2026.11.15/guides/neo4j/concepts/autoscaler)
- [Neo4jOpsRequest](/docs/v2026.11.15/guides/neo4j/concepts/opsrequest)
- [Neo4j vertical scaling](/docs/v2026.11.15/guides/neo4j/scaling/vertical-scaling/overview)

Install [Kubernetes Metrics Server](https://github.com/kubernetes-sigs/metrics-server#installation) before enabling compute autoscaling. The recommender uses resource metrics collected from the Neo4j pods.

## How Compute Autoscaling Works

<figure align="center">
  <img alt="Compute autoscaling process for Neo4j" src="/docs/v2026.11.15/images/neo4j/compute-autoscaling.png">
  <figcaption align="center">Fig: Neo4j compute autoscaling process</figcaption>
</figure>

1. The user creates a KubeDB `Neo4j` resource.
2. The Provisioner creates the Neo4j cluster and its supporting Kubernetes resources.
3. The user creates a `Neo4jAutoscaler` with a `spec.compute.neo4j` policy.
4. The Autoscaler creates and watches a Vertical Pod Autoscaler recommendation for the Neo4j container.
5. After the pod lifetime and resource-difference thresholds are satisfied, the Autoscaler creates a `Neo4jOpsRequest` of type `VerticalScaling`.
6. Ops Manager applies the recommendation and updates the Neo4j pods within the configured minimum and maximum bounds.

The next guide demonstrates this workflow end to end.
