---
title: Neo4j Storage Autoscaling Overview
menu:
  docs_v2026.11.15:
    identifier: neo4j-storage-autoscaling-overview
    name: Overview
    parent: neo4j-storage-autoscaling
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

# Neo4j Storage Autoscaling

KubeDB can automatically expand Neo4j persistent volumes as graph data grows. The Autoscaler watches volume usage and creates a volume-expansion operation before the disks become full.

## Before You Begin

You should be familiar with:

- [Neo4j](/docs/v2026.11.15/guides/neo4j/concepts/neo4j)
- [Neo4jAutoscaler](/docs/v2026.11.15/guides/neo4j/concepts/autoscaler)
- [Neo4jOpsRequest](/docs/v2026.11.15/guides/neo4j/concepts/opsrequest)
- [Neo4j volume expansion](/docs/v2026.11.15/guides/neo4j/volume-expansion/overview)

## How Storage Autoscaling Works

<figure align="center">
  <img alt="Storage autoscaling process for Neo4j" src="/docs/v2026.11.15/images/neo4j/storage-autoscaling.png">
  <figcaption align="center">Fig: Neo4j storage autoscaling process</figcaption>
</figure>

1. The user creates a KubeDB `Neo4j` resource with durable storage.
2. The Provisioner creates a persistent volume for every Neo4j pod.
3. The user creates a `Neo4jAutoscaler` with a `spec.storage.neo4j` policy.
4. The Autoscaler reads PVC usage from the KubeDB storage metrics API.
5. When usage reaches `usageThreshold`, the Autoscaler calculates a larger size and creates a `Neo4jOpsRequest` of type `VolumeExpansion`.
6. Ops Manager expands the PVCs using the configured online or offline mode.

> Volume expansion requires a StorageClass with `allowVolumeExpansion: true`. Kubernetes does not support shrinking a PVC after it has been expanded.

The next guide demonstrates this workflow using actual Neo4j graph data.
