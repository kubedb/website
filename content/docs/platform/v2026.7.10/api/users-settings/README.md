---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-users-settings-readme
    name: Overview
    parent: api-users-settings
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
url: /docs/platform/v2026.7.10/api/users-settings/
aliases:
- /docs/platform/v2026.7.10/api/users-settings/overview/
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Identity: Users & Settings

APIs for user accounts, profile and security settings, personal access and NATS
tokens, cloud credentials, and social (follow) relationships. These endpoints back
the account and settings screens of the KubeDB Platform web console and let you script the same
operations against the KubeDB Platform API Server.

All routes are served under the `/api/v1` prefix. Most endpoints authenticate with a
personal access token sent as `Authorization: token <YOUR_TOKEN>` (it may also be
supplied as a `token` or `access_token` query parameter). A handful of routes are
public (no auth) or use HTTP Basic auth — this is called out per endpoint.

User accounts, profile/security settings, tokens, credentials, and deploy orders.
This is the identity foundation the rest of the platform builds on: every
authenticated call resolves to a user here, and personal access tokens minted
through these endpoints authenticate the token-guarded REST API.

## Public / basic-auth user APIs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users/search` | Public | Search users |
| GET | `/api/v1/users/:username` | Public | Get public info for a user |
| GET | `/api/v1/users/:username/orgs` | Public | List a user's organizations |
| GET | `/api/v1/users/:username/tokens` | Basic auth | List a user's access tokens |
| POST | `/api/v1/users/:username/tokens` | Basic auth | Create an access token |
| DELETE | `/api/v1/users/:username/tokens/:id` | Basic auth | Delete an access token |
| GET | `/api/v1/users/:username/followers` | Token | List a user's followers |
| GET | `/api/v1/users/:username/following` | Token | List who a user follows |
| GET | `/api/v1/users/:username/following/:target` | Token | Check follow relationship |
| POST | `/api/v1/user/signin` | Public | Sign in a user |

## Authenticated user (`/api/v1/user`, all require Token)

| Method | Path | Extra auth | Description |
|--------|------|------------|-------------|
| GET | `/api/v1/user` | — | Get the authenticated user |
| GET | `/api/v1/user/signout` | — | Sign out |
| GET | `/api/v1/user/firebase-token` | AppsCode-hosted only | Get a Firebase auth token |
| GET | `/api/v1/user/nats/credentials` | — | Get NATS credentials for the user |
| GET | `/api/v1/user/nats/admin_credentials` | Site admin | Get NATS admin credentials |
| GET | `/api/v1/user/nats/user_credentials` | Site admin | Get NATS user credentials |
| GET | `/api/v1/user/nats/cluster-resource-history` | Site admin | Cluster resource history from NATS |
| GET/POST/DELETE | `/api/v1/user/emails` | — | List / add / delete account emails |
| GET | `/api/v1/user/followers`, `/following`, `/following/:username` | — | Social follow info |
| PUT/DELETE | `/api/v1/user/following/:username` | — | Follow / unfollow a user |
| GET | `/api/v1/user/orgs` | — | List my organizations |
| GET | `/api/v1/user/teams` | — | List my teams |
| GET | `/api/v1/user/clusters` | — | List clusters accessible to me |
| POST | `/api/v1/user/validate/username` `/orgname` `/email` | — | Validate names/emails |
| GET/POST/PUT/DELETE | `/api/v1/user/credentials`, `/credentials/:credName` | — | Manage cloud credentials |
| GET | `/api/v1/user/clouds/:cloud/buckets` | — | List buckets for a cloud provider |
| POST | `/api/v1/user/deploy/orders` | — | Create a deployment order |
| GET | `/api/v1/user/deploy/orders/:id/render/manifest` `/render/resources` `/helm3` `/yaml` | Helm registry | Preview/render an order (manifest, resources, Helm 3 script, YAML) |

## User settings (`/api/v1/user/settings`, all require Token)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/profile` | Get / update profile |
| GET/POST | `/avatar`, POST `/avatar/delete` | Manage avatar |
| POST | `/account/password` | Change password |
| GET/POST | `/account/email`, POST `/account/email/delete` | Manage account emails |
| POST | `/account/delete` | Delete the account |
| GET/POST | `/pagination` | Pagination preferences |
| GET | `/security/` | Two-factor status |
| GET/POST | `/security/twofa/enroll` | Enroll in 2FA |
| POST | `/security/twofa/regenerate_scratch`, `/security/twofa/disable` | Manage 2FA |
| GET | `/security/webauthn/keys` | List WebAuthn keys |
| POST | `/security/webauthn/request_register`, `/security/webauthn/register` | Register a WebAuthn key |
| DELETE | `/security/webauthn/keys/:id` | Delete a WebAuthn key |
| GET | `/security/sessions/` | List sessions |
| DELETE | `/security/sessions/:sid/revoke` | Revoke a session |
| GET/POST | `/security/account_link` | Linked accounts (list / unlink) |
| GET | `/organizations` | List my organizations |
| GET/POST | `/organizations/create` | Check permission / create an org |
| GET/POST | `/tokens/access-tokens/` | List / create personal access tokens |
| POST | `/tokens/access-tokens/delete-records` | Bulk-delete tokens |
| DELETE | `/tokens/access-tokens/:id` | Delete a token |
| GET | `/tokens/nats-tokens/` | List NATS tokens |
| POST | `/tokens/nats-tokens/:id/revoke/` | Revoke a NATS token |
| GET/POST | `/applications/oauth2` | List / create OAuth2 apps |
| GET/PUT/DELETE | `/applications/oauth2/:id` | Manage an OAuth2 app |
| POST | `/applications/oauth2/:id/regenerate_secret`, `/:id/revoke` | Rotate secret / revoke grant |
| GET | `/applications/oauth2/grants` | List OAuth2 grants |

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
