---
title: Backup & Restore PerconaXtraDB Using Stash
menu:
  docs_v2020.10.28:
    identifier: px-backup-stash
    name: Using Stash
    parent: px-backup
    weight: 5
menu_name: docs_v2020.10.28
section_menu_id: guides
info:
  cli: v0.14.0
  community: v0.14.0
  enterprise: v0.1.0
  installer: v0.14.0
  version: v2020.10.28
---

> New to KubeDB? Please start [here](/docs/v2020.10.28/README).

{{< notice type="warning" message="This is an Enterprise-only feature. Please install [KubeDB Enterprise Edition](/docs/v2020.10.28/setup/install/enterprise) to try this feature." >}}

# Backup & Restore Percona XtraDB Using Stash

KubeDB uses [Stash](https://stash.run) to backup and restore databases. Stash by AppsCode is a cloud native data backup and recovery solution for Kubernetes workloads. Stash utilizes [restic](https://github.com/restic/restic) to securely backup stateful applications to any cloud or on-prem storage backends (for example, S3, GCS, Azure Blob storage, Minio, NetApp, Dell EMC etc.).

<figure align="center">
  <img alt="KubeDB + Stash" src="/docs/v2020.10.28/images/kubedb_plus_stash.svg">
<figcaption align="center">Fig: Backup KubeDB Databases Using Stash</figcaption>
</figure>

## How to use Stash

In order to backup PerconaXtraDB database using Stash, follow the following steps:

- **Install Stash Enterprise:** At first, you have to install Stash Enterprise Edition. Please, follow the steps from [here](https://stash.run/docs/latest/setup/install/enterprise/).

- **Install PerconaXtraDB Addon:** Then, you have to install PerconaXtraDB addon for Stash. Please, follow the steps from [here](https://stash.run/docs/latest/addons/percona-xtradb/setup/install/).

- **Understand the Backup and Restore Flow:** Now, you can read about how PerconaXtraDB backup and restore works in Stash from [here](https://stash.run/docs/latest/addons/percona-xtradb/overview/).

- **Get Started:** Finally, follow the step by step guideline to backup or restore your desired database version from [here](https://stash.run/docs/latest/addons/percona-xtradb/).
