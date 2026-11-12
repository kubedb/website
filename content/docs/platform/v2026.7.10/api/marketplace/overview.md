---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-marketplace-overview
    name: Overview
    parent: api-marketplace
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Marketplace

The Marketplace APIs integrate the KubeDB Platform with the public cloud marketplaces (AWS, Azure,
GCP). They cover two distinct surfaces served by two different processes:

- **Marketplace webhook service** — a **separate listener** rooted at
  `/marketplace/api/v1` (not `/api/v1`). It receives subscription lifecycle
  notifications from the cloud marketplaces, answers the standalone-organization
  claimable check, and serves a version endpoint. These routes only exist when the
  API Server binary runs its `marketplace` subcommand as part of a marketplace deployment.
- **Metered-billing proxy** (`/api/v1/proxy/metered-billing/marketplaces/*`) — a
  site-admin proxy on the **main** API server that forwards metered-usage reports
  and readiness probes to the AWS Marketplace Metering / GCP Service Control APIs.
  Each provider's routes are registered **only** for the matching deployment type
  (`AWSMarketplaceDeployment` / `GCPMarketplaceDeployment`); on any other deployment
  they do not exist and return `404`.

Because these endpoints are gated by marketplace deployment types, most of them are
**unavailable on a standard KubeDB Platform installation**. Each page notes the gating and, for
GET endpoints, the observed behaviour on a non-marketplace deployment.

> **Note on the two listeners:** the webhook service listens on its own root
> `/marketplace/api/v1`, which is **different** from the main server's `/api/v1`
> prefix used everywhere else in this reference. It shares the `GET /version`
> response shape with the main server but runs as a separate process.

## Webhook service (separate listener rooted at `/marketplace/api`, marketplace deployments)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/marketplace/api/v1/marketplaces/standalone-organizations/:claimID/claimable` | Public | Check claim rules of a standalone org |
| POST | `/marketplace/api/v1/marketplaces/{aws,azure,gcp}/notification/resource` | Webhook | Cloud-marketplace subscription notifications |
| GET | `/marketplace/api/v1/version` | Public | Service version |

## Metered-billing proxy (`/api/v1/proxy/metered-billing/marketplaces`, site admin)

| Method | Path | Gated by | Description |
|--------|------|----------|-------------|
| POST | `/aws/report-usage`, GET `/aws/check/readiness` | AWS marketplace deployment | Report metered usage / readiness |
| POST | `/gcp/report-usage`, GET `/gcp/check/readiness` | GCP marketplace deployment | Report metered usage / readiness |

## Pages

- [Webhook Service](../webhook-service) — `/marketplace/api/v1/*`: claimable check, AWS/Azure/GCP subscription notifications, and version (separate listener).
- [Metered Billing](../metered-billing) — `/api/v1/proxy/metered-billing/marketplaces/*`: AWS/GCP usage reporting and readiness probes (site-admin, deployment-gated).
