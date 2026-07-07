---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: hub-ui-spoke
    name: Connect Spoke Cluster
    parent: hub-ui
    weight: 50
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Creating a Spoke Cluster

## Method 1 (Recommended): Import with Hub Connection

### Steps

1. Go to **Import Cluster** and complete the necessary steps
2. Select an existing hub cluster before importing

![Spoke](../../images/spoke/spoke.png)

3. Complete import

✅ Spoke cluster is created and linked

![Homepage](../../images/spoke/homepage.png)

This method can also be started from the Hub cluster:

1. Go to Hub → **Cluster List**
2. Click **Import Managed Cluster**


![Homepage](../../images/spoke/import_spoke.png)

3. Follow import steps

✅ Hub auto-selected during import


---

## Method 2: Enable OCM Spoke Feature

1. Go to cluster → Feature Set  
2. Enable **OCM Spoke**  (initially your features will be white leveled)

![featureset](../../images/spoke/featureset.png)

3. Select Hub Cluster

![select](../../images/spoke/select.png)

4. Provide a name
5. Enable

Then:

* Enter into your hub cluster then Click Go to Hub

![request](../../images/spoke/request.png)

* Click **Accept Spoke** The select the spoke from which the connection request was sent before

![accept](../../images/spoke/accept.png)

* Approve the request

✅ Cluster becomes a managed spoke
