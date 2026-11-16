---
layout: docs
menu:
  docsplatform_v2026.10.30:
    identifier: hub-ui-upgrade
    name: Upgrade Spoke
    parent: hub-ui
    weight: 90
menu_name: docsplatform_v2026.10.30
section_menu_id: guides
info:
  kubedb-installer: v2026.10.30
  kubeops-installer: v2026.10.30
  product: kubedbplatform
  version: v2026.10.30
---

# Upgrade a Spoke Cluster

Use this page to upgrade a single spoke cluster from the Hub UI. Upgrade the management cluster first, and update the ClusterSet after all of its spokes are upgraded. For the full procedure, including pre-checks, post-checks, and troubleshooting, see [Upgrade Cluster](../../cluster-upgrade.md).

1. In the Hub UI, open the ClusterSet that contains the spoke you want to upgrade, then select the spoke in the **Cluster list**.

![ClusterSet page in the Hub UI with the spoke cluster in the cluster list](../../images/upgrade/upgrade_1.png)

2. The spoke's feature sets are shown inside the hub. To give a spoke different features than the hub, configure them here.

![Spoke feature sets shown inside the hub](../../images/upgrade/upgrade_2.png)

3. From the sidebar, open **Update ACE resources**. If a newer version is available, click **Upgrade version** and confirm with **Upgrade**.

![Upgrade version confirmation dialog for a spoke cluster](../../images/upgrade/upgrade_3.png)

4. Verify the new version from the management cluster:

   ```bash
   kubectl get managedclusterprofilebinding -A
   ```

   The spoke's `CURRENT VERSION` should show the target version. The HelmReleases on the spoke update over the next few minutes. Check them from the spoke with `kubectl get hr -A`.

5. After every spoke in the ClusterSet is upgraded, open the ClusterSet and click **Update Cluster Set**.

If the spoke's version does not change or the ClusterSet stays unaligned, see [Troubleshooting](../../troubleshooting.md).

<!-- SCREENSHOT: images/upgrade/clusterset-update.png — ClusterSet page showing the Update Cluster Set button -->
