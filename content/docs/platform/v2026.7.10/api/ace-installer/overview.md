---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-installer-overview
    name: Overview
    parent: api-ace-installer
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Platform Installer API

The Platform Installer API generates and manages self-host installer bundles for the
KubeDB Platform. It serves the installer options schema,
generates and imports installer bundles, lists and inspects generated installers,
and supports reconfigure/upgrade/versioning and marketplace-installer status.

> **AppsCode-hosted only.** Every route under `/api/v1/ace-installer/...` is available
> only on the AppsCode-hosted (SaaS) deployment. On self-hosted KubeDB Platform installations these
> routes are not registered and return `404 Not Found`. All calls require a bearer token,
> an org context (resolved from the `org` query param), and per-action authorization
> checks (`view_installers`, `create_installers`, `import_installers`,
> `reconfigure_installers`, `upgrade_installers`, `download_installers`,
> `delete_installers`).

`/api/v1/ace-installer` (AppsCode-hosted only)

Generates and manages self-host installer bundles. Token + org context; per-action authz checks.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/schema.json`, `/model.json` | Installer JSON schema / default options |
| POST | `/generate` | Generate an installer |
| POST | `/import` | Import an installer |
| GET | `/installer-meta`, `/latest-version` | Installer metadata / latest KubeDB Platform version |
| GET | `/installers/` (+`/:name/`, `/:name/:id`) | List / inspect installers |
| DELETE | `/installers/:name/:id` | Delete a generated installer |
| POST | `/installers/:name/:id/{reconfigure,upgrade}` | Reconfigure / upgrade an installer |
| GET | `/installers/:name/:id/versions` | List installer versions |
| GET | `/installers/:name/:id/archives/:archiveName` | Read installer archive details |
| GET | `/installers/:name/:id/model.json` | Installer options |
| GET | `/deployment/marketplace/installers/:installerID/status` | Marketplace installer status |

## Pages

- [Platform Installer](../ace-installer) — schema/model, generate/import,
  installer metadata and latest version, installers CRUD, reconfigure/upgrade,
  versions/archives, and marketplace installer status.
