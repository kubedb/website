---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: database-management-delete
    name: Delete Database
    parent: database-management
    weight: 110
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Delete Database

There are two ways to delete a database — from the **Datastore Overview** page (bulk or single) or from inside the **individual database page**. Both lead to the same confirmation step.

> **Warning:** Deleting a database is a permanent and irreversible action. Ensure you have a valid backup before proceeding.

---

## 1. Getting Started

Navigate to the **Datastore** section from the left sidebar and select your database engine (e.g., **MongoDB**). This opens the **Datastore Overview** page, which lists all database instances in the selected namespace.

---

## 2. Deleting from the Datastore Overview

Use this method to delete one or more databases at once from the instance list.

![Datastore Overview page with a database instance selected and the Delete Selected button highlighted](../images/delete-overview.png)

1. **Select Namespace:** Use the **Select Namespace** dropdown in the top-right to filter instances by namespace if needed.
1. **Select Instance(s):** Check the checkbox next to each database instance you want to delete (e.g., `mongodb demo`).
1. **Delete Selected:** Click the red **Delete Selected** button that appears in the top-right of the Overview table.
1. **Confirm:** A confirmation modal will appear asking *"Are you sure you want to delete the selected databases?"* Click **Yes** to proceed, or **Cancel** to abort.

![Bulk delete confirmation modal on the Datastore Overview page](../images/delete-overview-modal.png)

---

## 3. Deleting from the Database Detail Page

Use this method to delete a specific database from its detail page.

![MongoDB database detail page showing the Delete button in the top-right navbar](../images/delete.png)

1. From the **Datastore Overview**, click on the name of the database instance you want to delete to open its detail page.
1. **Delete:** Click the red **Delete** button in the top-right corner of the page.
1. **Confirm:** A confirmation modal will appear showing the name of the database. Click **Yes** to permanently delete it, or **Cancel** to abort.

![Delete confirmation modal asking "Do you want to delete mongodb?" with Cancel and Yes buttons](../images/delete-modal.png)

> **Warning:** Clicking **Yes** immediately and permanently removes the database. There is no undo. Confirm you have a backup before proceeding.

---

## Quick Reference

| Action | How to do it |
|---|---|
| Delete one or more databases at once | **Datastore Overview** → check instance(s) → **Delete Selected** |
| Delete a specific database | Open the database detail page → click **Delete** (top-right) |
| Confirm deletion | Confirmation modal → click **Yes** |
| Abort deletion | Confirmation modal → click **Cancel** or **✕** |
