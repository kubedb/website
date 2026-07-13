---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api
    name: API Reference
    weight: 40
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# ACE Platform API Reference

Low-level reference for the AppsCode Cloud Engine (ACE) platform backend (`b3`)
REST API. Every endpoint lists its HTTP method, path, authentication, path/query
parameters, and request/response shapes so you can implement a client directly
against it.

All routes are served under the `/api/v1` prefix unless noted otherwise. The
marketplace webhook service is a separate listener rooted at `/marketplace/api/v1`.

## Authentication

Most endpoints require a personal access token. Send it as an HTTP header:

```
Authorization: token <YOUR_TOKEN>
```

You can also pass it as a `token` or `access_token` query parameter. Token-management
endpoints accept HTTP Basic auth. The web console uses a session cookie
(`i_like_ace`); a session cookie alone does **not** authenticate the token-guarded
REST endpoints — use a token.

A machine-readable [OpenAPI 3.0.3 specification](../openapi.yaml) of this API is also
available (`openapi.yaml`) — load it into any OpenAPI tool (Swagger UI, Redoc,
`openapi-generator`) to explore the API or generate a client. A self-contained
Swagger UI viewer (`api.html`, with the spec inlined) is available at the repository
root.

## API groups

| Group | What it covers |
|---|---|
| [Identity: Users & Settings](../users-settings/) | Accounts, profile/security settings, tokens, credentials |
| [Identity: Organizations & Teams](../organizations-teams/) | Orgs, members, teams, org tokens |
| [Administration](../administration/) | Admin console, site settings |
| [Authorization](../authorization/) | Custom roles & permissions |
| [Cluster Management v1](../cluster-management-v1/) | Cluster lifecycle, Kubernetes proxy, Helm |
| [Cluster Management v2](../cluster-management-v2/) | Hub-aware cluster API, subscriptions, gateways |
| [Multi-cluster (OCM)](../multicluster-ocm/) | Hub/spoke, cluster sets, feature sets |
| [Client Organizations](../client-organizations/) | Managed-service client orgs |
| [Cloud Providers](../cloud-providers/) | Provider discovery for provisioning |
| [ACE Installer](../ace-installer/) | Self-host installer bundles |
| [ACE Upgrade](../ace-upgrade/) | Platform & cluster upgrades |
| [Licensing & Contracts](../licensing-contracts/) | Contracts, licenses, registration |
| [Billing Dashboard](../billing-dashboard/) | Usage reports & billing dashboards |
| [Marketplace](../marketplace/) | Cloud-marketplace webhooks & metering |
| [Monitoring & Telemetry](../monitoring-telemetry/) | Telemetry stack, Trickster auth proxy |
| [Rancher Integration](../rancher/) | Rancher sync & proxy |
| [Chart Repositories](../chart-repositories/) | Public Helm chart repositories |
| [Miscellaneous](../miscellaneous/) | Version, markdown, health |
