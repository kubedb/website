---
layout: docs
menu:
  docsplatform_v2026.3.30:
    identifier: hub-ui-cluster
    name: Cluster & Clusterset
    parent: hub-ui
    weight: 70
menu_name: docsplatform_v2026.3.30
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.3.30
---

# Important Note

⚠️ Spoke users **should NOT manage feature sets directly**

* Feature updates must be handled from the **Hub**
* Hub must stay in sync

---

# ClusterSets

ClusterSets group multiple clusters together.

## Create ClusterSet

1. Go to **ClusterSets**
2. Click **Add ClusterSet**

![ClusterSet](../images/cluster_and_clusterset/clusterset.png)

3. Provide a name



---

## Feature Sets

* Select any feature you want to change in all of your connected spokes 

![ClusterSet](../images/cluster_and_clusterset/clusterset_feature_1.png)

![ClusterSet](../images/cluster_and_clusterset/clusterset_feature_2.png)


* Apply configurations across all clusters
* Centralized feature management

## Unaligned and Out of sync cluster 

### Unaligned cluster: If any spoke cluster has extra features enabled than hub that's unaligned 

![Unaligned](../images/cluster_and_clusterset/unaligned.png)

Like in the image secret management have 1 unaligned cluster 

![Unaligned](../images/cluster_and_clusterset/unaligned_2.png)

You can see config-syncer is enabled in spoke but not in hub

### Similarly if any hub update does not get applied in spoke that becomes out of sync 

---

## Add Clusters

You can add cluster from another clusterset if you want 


![ClusterSet](../images/cluster_and_clusterset/add_cluster_1.png)

1. Select cluster(s)

![ClusterSet](../images/cluster_and_clusterset/add_cluster_2.png)

2. Add to ClusterSet

