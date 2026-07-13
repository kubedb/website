---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-monitoring-telemetry
    name: Monitoring & Telemetry
    parent: api
    weight: 150
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
AppsCode Container Engine (ACE) platform. It has two surfaces:

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

## Pages

- [Telemetry Stack](../telemetry-stack.md) — list monitoring
  clusters, install the telemetry stack, fetch `appscode-otel-stack` Helm values, get the
  stack host, and list tenant owners.
- [Trickster Auth Proxy](../trickster.md) — register/unregister
  Prometheus backends for Grafana and Perses datasources, and the `prom-authproxy`
  ownership check.
