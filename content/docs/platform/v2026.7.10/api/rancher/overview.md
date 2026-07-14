---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-rancher-overview
    name: Overview
    parent: api-rancher
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Rancher Integration API

The Rancher Integration API wires the KubeDB Platform together with a Rancher management cluster.
It lets a site administrator sync Rancher users into a Rancher-managed
organization, obtain the `acerproxy` Helm installation command, download the
platform CA certificate, and mint Rancher proxy-server tokens. It also exposes an
endpoint that returns NATS credentials for the authenticated Rancher user.

All routes live under the `/api/v1/rancher` prefix and require a valid bearer
token.

> **Auth notes.** The `/rancher/org/{orgname}/...` routes require **site-admin**
> privileges **and** a **Rancher-managed organization** (an org whose origin is
> Rancher). On a platform whose organizations are not Rancher-managed these routes
> return `500` with `org isn't a rancher organization`. `POST /rancher/proxy-token`
> requires site-admin only. `GET /rancher/nats-cred` requires a token in the
> **Rancher-user** context (injected by the server's `injectRancherUserInfo`
> middleware).

`/api/v1/rancher` (Token)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/org/:orgname/sync/users` | Site admin + Rancher-managed org | Sync Rancher users for an org |
| GET | `/org/:orgname/acerproxy` | Site admin + Rancher-managed org | ACER proxy installation command |
| GET | `/org/:orgname/ca/download` | Site admin + Rancher-managed org | Download CA certificate |
| POST | `/proxy-token` | Site admin | Create a Rancher proxy-server token |
| GET | `/nats-cred` | Token (Rancher user) | Get NATS credentials |

## Pages

- [Rancher Integration](../rancher) — user sync, acerproxy install
  command, CA download, proxy-server token, and NATS credentials.
