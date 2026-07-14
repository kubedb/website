---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: api-cloud-providers-overview
    name: Overview
    parent: api-cloud-providers
    weight: 1
menu_name: docsplatform_v2026.7.10
section_menu_id: api
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Cloud Providers

Discovery APIs used by the cluster-provisioning wizard. Given stored cloud
credentials for an owner (organization or user), these endpoints enumerate the
projects, regions, zones, Kubernetes versions, machine types, and existing
managed clusters available on each supported cloud provider — so the console can
offer them as choices when provisioning or importing a cluster. A single public
endpoint lists the providers the platform supports, and a provisioning endpoint
creates a new Cluster API (CAPI) cluster on a provider.

All routes are served under the `/api/v1` prefix. Except for the public provider
list (`GET /clouds`), every endpoint requires a personal access token sent as
`Authorization: token <YOUR_TOKEN>` (it may also be supplied as a `token` or
`access_token` query parameter). The per-provider discovery routes additionally
require **stored cloud credentials** for the referenced provider under the owner
scope; without a matching credential these routes fail.

`/api/v1/clouds`

Discovery APIs used by the cluster-provisioning wizard. Provider routes require Token + stored
cloud credentials.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List supported cloud providers (public) |
| POST | `/:owner/:provider/cluster` | Provision a cluster on a provider |
| GET | `/:owner/providers/gke/projects` (+ per-project `clusters`, `clusters/:cluster`; per-region under `projects/:project/regions/:region`: `kubernetesversions`, `vms`) | GKE discovery |
| GET | `/:owner/providers/aks/{regions,resourcegroups}` (+ per-region `vms`/`kubernetesversions`, per-RG `clusters` and `clusters/:cluster`) | AKS discovery |
| GET | `/:owner/providers/eks/regions` (+ per-region `kubernetesversions`, `vms`, `clusters`, `clusters/:cluster`) | EKS discovery |
| GET | `/:owner/providers/digitalocean/clusters` (+`/:id`) | DigitalOcean discovery |
| GET | `/:owner/providers/linode/clusters` (+`/:id`) | Linode discovery |
| GET | `/:owner/providers/rancher/clusters/` (+`/:id`) | Rancher-managed cluster discovery |
| GET | `/:owner/providers/hetzner/{servers,kubernetesversions,regions}` (+ per-region `servers`) | Hetzner discovery |
| GET | `/:owner/providers/kubevirt/kubernetesversions` | KubeVirt versions |

## Pages

- [Cloud Providers](../cloud-providers) — the public provider
  list, CAPI cluster provisioning, and per-provider discovery for GKE, AKS, EKS,
  DigitalOcean, Linode, Rancher, Hetzner, and KubeVirt.
