---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-organizations-teams
    name: 'Identity: Organizations & Teams'
    parent: api
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Identity: Organizations & Teams

APIs for organizations and the teams inside them. Organizations own clusters,
contracts, and billing scope; teams provide per-org grouping with role-based
permissions. All authorization checks are OpenFGA-backed (relationship-based), so
access to each endpoint depends on the caller's role in the organization or team.

All routes are served under the `/api/v1` prefix. Most endpoints authenticate with a
personal access token sent as `Authorization: token <YOUR_TOKEN>` (it may also be
supplied as a `token` or `access_token` query parameter). A few read endpoints are
public (no auth) and return only what an anonymous caller may see — this is called
out per endpoint.

## Pages

- [Organizations](../organizations.md) — the `/api/v1/orgs/*`
  endpoints: create/claim organizations, get/edit/delete an org, ownership and
  membership checks, member management, avatars, Rancher sync/user tokens, and org
  access/NATS tokens.
- [Teams](../teams.md) — the `/api/v1/orgs/{orgname}/teams` and
  `/api/v1/teams/{teamid}/*` endpoints: list/create teams, team actions, and team
  member management.
