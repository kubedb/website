---
title: HanaDB
menu:
  docs_v2026.6.19:
    identifier: hanadb-readme
    name: HanaDB
    parent: guides-hanadb
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
url: /docs/v2026.6.19/guides/hanadb/
aliases:
- /docs/v2026.6.19/guides/hanadb/README/
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

## Overview

KubeDB operates [SAP HANA](https://www.sap.com/products/technology-platform/hana.html) databases on
Kubernetes through the `HanaDB` Custom Resource Definition (CRD). A single `HanaDB` object describes a
standalone HANA instance or a multi-node HANA **System Replication** cluster, and the KubeDB operator
provisions the PetSet, Services, authentication Secret, and AppBinding required to run it. Day-2
operations such as restart, reconfigure, TLS management, scaling, volume expansion, storage migration,
and credential rotation are driven declaratively through the `HanaDBOpsRequest` CRD.

The guides in this section use [SAP HANA, express edition](https://www.sap.com/products/technology-platform/hana/express-trial.html)
(`hanaexpress`) images.

## Supported HanaDB Features

| Features                                              | Availability |
|-------------------------------------------------------|:------------:|
| Standalone instance                                   |   &#10003;   |
| System Replication cluster (multi-node)               |   &#10003;   |
| Synchronous / async replication modes                 |   &#10003;   |
| Read-enabled secondary (`logreplay_readaccess`)       |   &#10003;   |
| Persistent Volume                                     |   &#10003;   |
| Custom Configuration (`global.ini`)                   |   &#10003;   |
| Custom docker image                                   |   &#10003;   |
| Authentication (auto-generated credentials)           |   &#10003;   |
| TLS/SSL (cert-manager)                                |   &#10003;   |
| Builtin Prometheus Monitoring                         |   &#10003;   |
| Prometheus Operator Monitoring                        |   &#10003;   |
| Restart (`HanaDBOpsRequest`)                          |   &#10003;   |
| Reconfigure (`HanaDBOpsRequest`)                      |   &#10003;   |
| Reconfigure TLS (`HanaDBOpsRequest`)                  |   &#10003;   |
| Vertical Scaling (`HanaDBOpsRequest`)                 |   &#10003;   |
| Volume Expansion (`HanaDBOpsRequest`)                 |   &#10003;   |
| Horizontal Scaling (`HanaDBOpsRequest`)               |   &#10003;   |
| Storage Migration (`HanaDBOpsRequest`)                |   &#10003;   |
| Rotate Authentication (`HanaDBOpsRequest`)            |   &#10003;   |

## User Guide

- [HanaDB Quickstart](/docs/v2026.6.19/guides/hanadb/quickstart/quickstart) — deploy a standalone HanaDB and connect to it.
- [HanaDB System Replication](/docs/v2026.6.19/guides/hanadb/clustering/system-replication) — run a multi-node HANA System Replication cluster.
- [Custom Configuration](/docs/v2026.6.19/guides/hanadb/configuration/using-config-file) — supply a custom `global.ini`.
- [Monitoring with builtin Prometheus](/docs/v2026.6.19/guides/hanadb/monitoring/using-builtin-prometheus).
- [Monitoring with Prometheus Operator](/docs/v2026.6.19/guides/hanadb/monitoring/using-prometheus-operator).
- [TLS/SSL Encryption](/docs/v2026.6.19/guides/hanadb/tls/overview).
- Day-2 operations: [Restart](/docs/v2026.6.19/guides/hanadb/restart/restart.md), [Reconfigure](/docs/v2026.6.19/guides/hanadb/reconfigure/reconfigure), [Vertical Scaling](/docs/v2026.6.19/guides/hanadb/scaling/vertical-scaling/vertical-scaling), [Volume Expansion](/docs/v2026.6.19/guides/hanadb/volume-expansion/volume-expansion), [Storage Migration](/docs/v2026.6.19/guides/hanadb/storage-migration/storage-migration), [Rotate Authentication](/docs/v2026.6.19/guides/hanadb/rotate-authentication/rotate-authentication).

## Concepts

- [HanaDB CRD](/docs/v2026.6.19/guides/hanadb/concepts/hanadb)
- [HanaDBVersion CRD](/docs/v2026.6.19/guides/hanadb/concepts/catalog)
- [HanaDBOpsRequest CRD](/docs/v2026.6.19/guides/hanadb/concepts/opsrequest)
- [AppBinding](/docs/v2026.6.19/guides/hanadb/concepts/appbinding)

> ## ⚠️ Legal Notice
>
> SAP® and SAP HANA® are registered trademarks of SAP SE. KubeDB is not affiliated with, endorsed by,
> or sponsored by SAP SE.
>
> KubeDB provides only orchestration and management tooling for Kubernetes. It does not distribute,
> bundle, ship, or include any SAP HANA software or binaries. Users must provide their own SAP HANA
> container images and hold valid SAP licenses, and are solely responsible for compliance with SAP's
> licensing terms.
