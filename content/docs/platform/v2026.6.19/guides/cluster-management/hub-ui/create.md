---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: hub-ui-create
    name: Create Hub Cluster
    parent: hub-ui
    weight: 40
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

# Creating a Hub Cluster

> ⚠️ Recommended: Use an organizational account for full functionality

### Steps

1. Go to import cluster and choose your preferred method
![Hub & Spoke Model](../../images/import/select-cluster.png)
2. After filling up necessary steps for your preferred method Choose Generic as cluster profile 
![Cluster Profile](../../images/import/cluster-profile.png)
3. Open **Cluster Details**  
You won't see the hub UI button initially

![Cluster Details](../../images/import/cluster-details.png)

4. Go to **Feature Set Settings**
5. Select **OCM Hub Feature Set**

All the features will be white leveled if you are enabling it for the first time.

![Cluster Feature-set](../../images/import/feature-set.png)

In the top right corner there will be enable button. 
1. Click in the enable button 
2. Select all features ( will be auto-selected)
3. Click Preview then Deploy 

![Deploy](../../images/import/deploy.png)



✅ Wait a bit Your Hub Cluster is ready




