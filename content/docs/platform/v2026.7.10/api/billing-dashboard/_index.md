---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-billing-dashboard
    name: Billing Dashboard
    parent: api
    weight: 130
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Billing Dashboard

APIs that power the license, usage, and billing screens of the ACE web console.
They report on licensed users and their clusters, per-cluster licenses and licensed
products, resource event histories, marketplace subscriptions, system-outage
records, and month-by-month usage summaries (KubeDB, KubeStash, KubeVault, Voyager)
and DBaaS namespace billing reports.

All routes are served under the `/api/v1` prefix. Every endpoint in this group
authenticates with a personal access token sent as `Authorization: token <YOUR_TOKEN>`
(it may also be supplied as a `token` or `access_token` query parameter).

> **Billing-enabled deployments only.** This entire group is registered only when
> the `b3` backend runs with billing enabled. On a deployment without billing, all
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
