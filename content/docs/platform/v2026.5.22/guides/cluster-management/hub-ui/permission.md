---
layout: docs
menu:
  docsplatform_v2026.5.22:
    identifier: hub-ui-permission
    name: User Permission
    parent: hub-ui
    weight: 60
menu_name: docsplatform_v2026.5.22
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.5.22
---

# User Access Management

![permission](../../images/permission/permission.png)

Here you can assign a user one cluster or many cluster (clusterset) and grant access of different level

## Scenario Example

| User     | Cluster | Access Level |
| -------- | ------- | ------------ |
| user-1   | spoke-1 | View Only    |
| user-2   | spoke-2 | Edit Access  |

---

## Method 1: Assign via Organization Team

### Steps

1. Go to **Platform UI**

![go to platform](../../images/permission/go_to_platform.png)

2. Create a **Team**

![create team](../../images/permission/create_team.png)

3. Add members

![Add Member](../../images/permission/add_member.png)

4. Go to Hub → **Access**
5. Click **Assign Permission**

![Grant Permission](../../images/permission/grant_permission.png)


### Fields Explained

* **User** → Organization member
* **Level**

  * Cluster
  * ClusterSet
* **Cluster/ClusterSet** → Target
* **Role Type**

  * ClusterRole
  * Role (namespace-specific)
* **Roles Available**

  * `cluster-admin`
  * `admin`
  * `create`
  * `view`
* **Namespace** → Scope (if applicable)

