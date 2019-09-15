---
title: Roadmap | KubeDB
description: Roadmap of KubeDB
menu:
  docs_0.9.0-rc.0:
    identifier: roadmap-cli
    name: Roadmap
    parent: welcome
    weight: 15
menu_name: docs_0.9.0-rc.0
section_menu_id: welcome
url: /docs/0.9.0-rc.0/welcome/roadmap/
aliases:
- /docs/0.9.0-rc.0/roadmap/
info:
  version: 0.9.0-rc.0
---

# Project Status

## Versioning Policy

There are 2 parts to versioning policy:

 - Operator & cli version: KubeDB follows semver versioning policy. Until 1.0 release is done, there might be breaking changes between point releases of the operator. Please always check the release notes for upgrade instructions.
 - CRD version: `kubedb.com/v1alpha1` is considered in alpha. This means breaking changes to the YAML format might happen among different releases of the operator.
