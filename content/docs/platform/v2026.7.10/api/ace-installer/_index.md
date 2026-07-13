---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-ace-installer
    name: ACE Installer
    parent: api
    weight: 100
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# ACE Installer API

The ACE Installer API generates and manages self-host installer bundles for the
AppsCode Container Engine (ACE) platform. It serves the installer options schema,
generates and imports installer bundles, lists and inspects generated installers,
and supports reconfigure/upgrade/versioning and marketplace-installer status.

> **AppsCode-hosted only.** Every route under `/api/v1/ace-installer/...` is available
> only on the AppsCode-hosted (SaaS) deployment. On self-hosted ACE installations these
> routes are not registered and return `404 Not Found`. All calls require a bearer token,
> an org context (resolved from the `org` query param), and per-action authorization
> checks (`view_installers`, `create_installers`, `import_installers`,
> `reconfigure_installers`, `upgrade_installers`, `download_installers`,
> `delete_installers`).

## Pages

- [ACE Installer](../ace-installer.md) — schema/model, generate/import,
  installer metadata and latest version, installers CRUD, reconfigure/upgrade,
  versions/archives, and marketplace installer status.
