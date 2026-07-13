---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-users-settings
    name: 'Identity: Users & Settings'
    parent: api
    weight: 10
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Identity: Users & Settings

APIs for user accounts, profile and security settings, personal access and NATS
tokens, cloud credentials, and social (follow) relationships. These endpoints back
the account and settings screens of the ACE web console and let you script the same
operations against the `b3` backend.

All routes are served under the `/api/v1` prefix. Most endpoints authenticate with a
personal access token sent as `Authorization: token <YOUR_TOKEN>` (it may also be
supplied as a `token` or `access_token` query parameter). A handful of routes are
public (no auth) or use HTTP Basic auth — this is called out per endpoint.

## Pages

- [Public & Basic-auth User APIs](../public-user-apis.md) — public
  user lookup/search, a user's organizations, social follow info, HTTP Basic-auth
  token management, and sign-in.
- [Authenticated User](../authenticated-user.md) — the
  `/api/v1/user/*` endpoints: the current user, emails, NATS credentials, cloud
  credentials, clusters, teams, organizations, and name/email validation.
- [User Settings](../user-settings.md) — the
  `/api/v1/user/settings/*` endpoints: profile and avatar, password and account
  emails, 2FA and WebAuthn security, sessions, personal access and NATS tokens, and
  OAuth2 applications.
