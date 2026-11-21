---
layout: docs
menu:
  docsplatform_v2026.10.30:
    identifier: platform-support
    name: Support
    parent: welcome
    weight: 20
menu_name: docsplatform_v2026.10.30
section_menu_id: welcome
info:
  kubedb-installer: v2026.10.30
  kubeops-installer: v2026.10.30
  product: kubedbplatform
  version: v2026.10.30
---

# Support

To speak with us, please leave a message on our [website](https://appscode.com/contact/). To receive product announcements, follow us on [Twitter](https://twitter.com/AppsCodeHQ).

If you have found a bug with KubeDB or want to request for new features, please file an issue.

## Planned Maintenance Policy

### Scope

Covers **planned** changes to an AppsCode-supported platform: upgrades (hub, spoke, imported clusters), migrations (e.g. helm-based → Flux-based installation), bulk cluster import/removal, and any other change scheduled in advance.

Unplanned critical/high severity incidents are handled by the on-call rotation (see below).

### Rules

1. **72-hour notice.** Notify AppsCode at least 72 hours before the change, with:
   - What changes (e.g. `v2026.10.12` → `v2026.11.30`)
   - Affected clusters
   - Date/time window, with timezone
   - Non-prod test result
   - Your contact during the window
2. **Test before production.** Apply the change to a QA/non-prod environment first and verify it with the post-checks in the [upgrade SOP](../guides/cluster-management/cluster-upgrade.md).
3. **Or coordinate.** If non-prod testing isn't possible, agree a maintenance window with AppsCode within the 72-hour notice period; an AppsCode engineer will be available during it.

### Unplanned issues

Critical and high severity production issues go to AppsCode's on-call rotation, independent of any single engineer's availability. For planned changes, following the rules above lets us have the right engineer ready and resolve issues fastest.

### Self-service docs

- [Upgrade SOP](../guides/cluster-management/cluster-upgrade.md): *Guides → Cluster Management → Upgrade ACE Clusters*
- [Troubleshooting runbook](../guides/cluster-management/troubleshooting.md): *Guides → Cluster Management → Troubleshooting*
