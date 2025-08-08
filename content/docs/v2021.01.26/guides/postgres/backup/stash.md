---
title: Backup & Restore PostgreSQL Using Stash
menu:
  docs_v2021.01.26:
    identifier: pg-backup-stash
    name: Using Stash
    parent: pg-backup
    weight: 5
menu_name: docs_v2021.01.26
section_menu_id: guides
info:
  autoscaler: v0.1.2
  cli: v0.16.2
  community: v0.16.2
  enterprise: v0.3.2
  installer: v0.16.2
  version: v2021.01.26
---

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2021.01.26/setup/install/enterprise) to try this feature." >}}

# Backup & Restore PostgreSQL Using Stash

KubeDB uses [Stash](https://stash.run) to backup and restore databases. Stash by AppsCode is a cloud native data backup and recovery solution for Kubernetes workloads. Stash utilizes [restic](https://github.com/restic/restic) to securely backup stateful applications to any cloud or on-prem storage backends (for example, S3, GCS, Azure Blob storage, Minio, NetApp, Dell EMC etc.).

<figure align="center">
  <img alt="KubeDB + Stash" src="/docs/v2021.01.26/images/kubedb_plus_stash.svg">
<figcaption align="center">Fig: Backup KubeDB Databases Using Stash</figcaption>
</figure>

## How to use Stash

In order to backup PostgreSQL database using Stash, follow the following steps:

- **Install Stash Enterprise:** At first, you have to install Stash Enterprise Edition. Please, follow the steps from [here](https://stash.run/docs/latest/setup/install/enterprise/).

- **Install PostgreSQL Addon:** Then, you have to install PostgreSQL addon for Stash. Please, follow the steps from [here](https://stash.run/docs/latest/addons//postgres/setup/install/).

- **Understand the Backup and Restore Flow:** Now, you can read about how PostgreSQL backup and restore works in Stash from [here](https://stash.run/docs/latest/addons//postgres/overview/).

- **Get Started:** Finally, follow the step by step guideline to backup or restore your desired database version from [here](https://stash.run/docs/latest/addons//postgres/).
