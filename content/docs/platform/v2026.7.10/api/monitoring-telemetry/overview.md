---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-monitoring-telemetry-overview
    name: Overview
    parent: api-monitoring-telemetry
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Monitoring & Telemetry API

The Monitoring & Telemetry API provisions and wires up the observability plane of the
KubeDB Platform. It has two surfaces:

- **Telemetry stack** (`/api/v1/telemetry/...`) — designates one of an owner's imported
  clusters as a *monitoring cluster*, installs the OpenTelemetry-based telemetry stack
  (`appscode-otel-stack` / `opentelemetry-kube-stack`) on it, and generates the Helm
  values that target clusters use to ship metrics, logs, and traces to that monitoring
  cluster. It also exposes the stack's ingress host and lists the tenants served.
- **Trickster / Prometheus auth proxy** (`/api/v1/trickster/...`) — registers and
  unregisters per-cluster Prometheus backends behind the Trickster proxy (for Grafana or
  Perses datasources) and provides the ownership/auth hook that `prom-authproxy` calls to
  enforce per-tenant access to Prometheus data.

> **Auth.** Every route in this group requires a valid bearer token
> (`Authorization: token <t>`, or the `?token=` / `?access_token=` query forms) and
> org-admin context: the caller must be an **admin of the `{owner}` organization** (or,
> for the Trickster routes, a member/owner of the org that owns the referenced cluster).
> These routes are registered in all deployment modes.

## Telemetry stack (`/api/v1/telemetry/:owner`, Token + org admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/monitoring-clusters` | List clusters serving as monitoring clusters |
| POST | `/:cluster/stack` | Install the telemetry (OTel) stack on a cluster |
| GET | `/:cluster/values/appscode-otel-stack` | Helm values of the OTel stack |
| GET | `/:cluster/stack/host` | Telemetry stack endpoint |
| GET | `/:cluster/tenants/ownerlist` | Tenant owners served by this monitoring cluster |

## Trickster / Prometheus auth proxy (`/api/v1/trickster`, Token + org admin)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register`, `/unregister` | Register / unregister a Prometheus backend |
| POST | `/perses/register`, `/perses/unregister` | Same, for Perses dashboards |
| GET | `/auth/:uidcid/*` | Ownership/auth check for a `uid.clusterid` identity |

## Pages

- [Telemetry Stack](../telemetry-stack) — list monitoring
  clusters, install the telemetry stack, fetch `appscode-otel-stack` Helm values, get the
  stack host, and list tenant owners.
- [Trickster Auth Proxy](../trickster) — register/unregister
  Prometheus backends for Grafana and Perses datasources, and the `prom-authproxy`
  ownership check.
