---
title: Project Status | KubeDB
description: KubeDB Project Status
menu:
  docs_0.12.0:
    identifier: roadmap-cli
    name: Status
    parent: welcome
    weight: 15
menu_name: docs_0.12.0
section_menu_id: welcome
url: /docs/0.12.0/welcome/status/
aliases:
- /docs/0.12.0/status/
info:
  version: 0.12.0
---

# Project Status

## Versioning Policy

There are 2 parts to versioning policy:

 - Operator & cli version: KubeDB follows semver versioning policy. Until 1.0 release is done, there might be breaking changes between point releases of the operator. Please always check the release notes for upgrade instructions.
 - CRD version: `kubedb.com/v1alpha1` is considered in alpha. This means breaking changes to the YAML format might happen among different releases of the operator.
