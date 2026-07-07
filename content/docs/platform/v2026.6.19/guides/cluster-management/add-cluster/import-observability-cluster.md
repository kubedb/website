---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-add-observability
    name: Import Observability Cluster
    parent: cluster-management-add
    weight: 20
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Importing an Observability Cluster

The Platform Console can run a dedicated **observability cluster** that collects
telemetry (metrics, logs, and traces) from your spoke clusters through
OpenTelemetry. This guide covers the two import-time tasks:

1. Importing the observability cluster itself.
2. Enabling the OpenTelemetry feature on the spoke clusters you want to monitor.

For the full end-to-end setup — MinIO, the `telemetry` bucket, and the
TelemetryStack — see [OpenTelemetry Monitoring](../../otel-monitoring.md).

## Import the Observability Cluster

Import the cluster as a spoke as you normally would (see
[Adding a Cluster](overview.md)). During the import flow, select the
**Observability Cluster** cluster profile. This provisions the components
required to receive and store telemetry from other clusters.

## Enable the OpenTelemetry Feature on a Spoke Cluster

Once the observability cluster is ready, enable the OpenTelemetry feature on
each spoke cluster you want it to monitor. There are two ways to do this.

### Option A: During Cluster Import

When importing a new cluster, select the destination observability cluster from
the **Monitoring Cluster** drop-down in the import flow. This automatically
enables the OpenTelemetry feature on the new spoke and routes its telemetry to
the chosen monitoring cluster.

![Add Cluster import form with the Monitoring Cluster drop-down set to the observability cluster](../../images/otel-monitoring/import-select-monitoring-cluster.png)

### Option B: On an Existing Spoke Cluster

1. Import the cluster as a spoke (if it is not already imported).
2. Install the Perses dashboards on the cluster:

   ```bash
   helm upgrade -i kubedb-perses-dashboards \
     oci://ghcr.io/appscode-charts/kubedb-perses-dashboards \
     -n monitoring --create-namespace \
     --version=v2026.4.27
   ```

3. Navigate to the cluster's **Observability** feature set.
4. Enable the **`appscode-otel-stack`** feature.
