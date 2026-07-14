---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-billing-dashboard-readme
    name: Overview
    parent: api-billing-dashboard
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/billing-dashboard/
aliases:
- /docs/platform/v2026.7.10/api/billing-dashboard/overview/
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Billing Dashboard

APIs that power the license, usage, and billing screens of the KubeDB Platform web console.
They report on licensed users and their clusters, per-cluster licenses and licensed
products, resource event histories, marketplace subscriptions, system-outage
records, and month-by-month usage summaries (KubeDB, KubeStash, KubeVault, Voyager)
and DBaaS namespace billing reports.

All routes are served under the `/api/v1` prefix. Every endpoint in this group
authenticates with a personal access token sent as `Authorization: token <YOUR_TOKEN>`
(it may also be supplied as a `token` or `access_token` query parameter).

> **Billing-enabled deployments only.** This entire group is registered only when
> the KubeDB Platform API Server runs with billing enabled. On a deployment without billing, all
> of these routes return `404 Not Found` — even with a valid token. The
> owner-scoped and usage-report routes additionally resolve the acting organization
> from the `org` query parameter, so include `?org=<org-slug>` on those calls.

## Authorization tiers

Routes in this group fall into three authorization tiers:

- **Site-admin (licensed users):** the `/dashboard/users/*`,
  `/dashboard/clusters/:cid/licenses/active`, `/dashboard/system-outages/*`, and
  `/dashboard/marketplaces/*` routes require site-admin authorization
  (`view_licensed_users`, `view_system_outages`, or `view_marketplace_usage`).
- **Owner-scoped (`view:contracts`):** the `/dashboard/clusters/*` routes resolve
  the owner from `?org=` and require the `view:contracts` permission on that
  organization — this is the "self-service" billing dashboard an org sees for its
  own clusters.
- **Usage analytics (site-admin):** the `/dashboard/summary/*` usage-report and
  download routes require `view_usage_analytics:site_admin`; the `/dbaas/billing/*`
  reports require org ownership when an org is set.

Available on billing-enabled deployments.

## Site-admin billing dashboard (`/api/v1/dashboard`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/` (+`/active`, `/inactive`) | Licensed users |
| GET | `/users/:uid/clusters/` (+`/active`, `/:cid/`) | A user's clusters |
| GET | `/users/:uid/clusters/:cid/licenses/` (+`/active`, `/:lid/`) | Licenses per cluster |
| GET | `/users/:uid/clusters/:cid/licenses/:lid/products/` (+`/:productName/`) | Licensed products |
| GET | `.../products/:productName/{resources,events-histories,events/,events/raw-event}` | Product resource history & audit events |
| GET | `/clusters/:cid/licenses/active` | Active licenses for a cluster |
| POST | `/system-outages/`, GET `/system-outages/{report,tags}` | System outage records |
| GET | `/marketplaces/subscriptions`, `/marketplaces/settings/warnings` | Marketplace subscriptions / warnings |
| GET/DELETE | `/marketplaces/:marketplace/:subscriptionId/` (+`/ping`, `/audit-logs`) | Inspect / revoke / ping a subscription |

## User billing dashboard (`/api/v1/user/dashboard/clusters`, Token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/active` | My active clusters |
| GET | `/:cid/` (+`/events-count`) | Cluster info / events count |
| GET | `/:cid/licenses/` (+`/:lid/`) | Licenses |
| GET | `/:cid/licenses/:lid/products/:product/{events-count,events/,events/raw-event}` | License events per product |
| GET | `/:cid/licenses/:lid/products/:product/groups/:group/resources/:resource/:rid/events-count` | Per-resource events count |

## Usage reports (`/api/v1/dashboard/summary`, `/api/v1/dbaas`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/summary/generated-months` | Months with generated usage reports |
| GET | `/summary/object-quota-history/clusters/:clusterUID/objects/:objectID` | Object quota history |
| GET | `/summary/:year/:month/usage-report/products/kubeDb/views/*` | KubeDB usage views (objects, clusters, namespaces, GKS, contracts, quota history, cluster-mode) |
| GET | `/summary/:year/:month/usage-report/products/{kubeStash,kubeVault,voyager}/views/{clusters,contracts}-usage-view` | Usage views per product |
| GET | `/summary/:year/:month/download` | Download PDF usage report |
| GET | `/dbaas/billing/reports/namespaces` (+`/clusters/:clusterID/namespaces/:namespaceName`) | DBaaS billing namespace reports |

## Pages

- [Admin Billing Dashboard](../admin-dashboard.md) — the
  site-admin `/api/v1/dashboard/*` routes: licensed users, their clusters,
  per-cluster licenses and licensed products, resource/event histories, marketplace
  subscriptions, and system-outage records.
- [User Billing Dashboard](../user-dashboard.md) — the
  owner-scoped `/api/v1/dashboard/clusters/*` routes (`view:contracts`): an
  organization's own active clusters, licenses, licensed products, and event counts.
- [Usage Reports](../usage-reports.md) — the
  `/api/v1/dashboard/summary/*` monthly usage-report views and PDF download, plus
  the `/api/v1/dbaas/billing/*` namespace billing reports.
