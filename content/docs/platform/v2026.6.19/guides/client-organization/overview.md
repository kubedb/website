---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: client-organization-overview
    name: Overview
    parent: client-organization
    weight: 10
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Client Organizations

A **Client Organization** is an isolated tenant that a platform administrator provisions from **Site Administration**. It lets you give a team or customer their own organization on KubeDB Platform, scoped to a specific cluster, gateway, and monitoring setup.

When you create a client organization, the platform provisions three namespaces from the organization name (`orgName`):

| Namespace | Purpose |
| --- | --- |
| `orgName` | The organization's primary workload namespace. |
| `orgName-gw` | Holds the organization's gateway resources. |
| `orgName-monitoring` | Holds the organization's telemetry and monitoring resources. |

Each client organization is created with:

- An **organization admin** — either an existing user or a newly created one.
- An assigned **hub** and **spoke** cluster.
- A **gateway** configuration (shared or dedicated).
- A **telemetry** configuration applied to the monitoring namespace.

## Where to find it

Client organizations are managed from **Site Administration → Client Organizations**, under the **ADMINISTRATION** group in the left sidebar. You need site administration access to view and use this section.

## Next steps

- [Create a Client Organization](../create-client-organization.md) — a step-by-step walkthrough of the creation wizard.
- [Add a Cluster to an Existing Client Organization](../add-cluster-to-existing-client-organization.md) — assign additional clusters after the organization is created.
