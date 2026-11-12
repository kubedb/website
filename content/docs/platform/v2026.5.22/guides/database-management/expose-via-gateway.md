---
layout: docs
menu:
  docsplatform_v2026.5.22:
    identifier: database-management-expose-via-gateway
    name: Expose via Gateway
    parent: database-management
    weight: 77
menu_name: docsplatform_v2026.5.22
section_menu_id: guides
info:
  product: kubedbplatform
  version: v2026.5.22
---

# Expose via Gateway

Control whether your database is exposed externally through the gateway. Enabling this makes your database accessible outside the cluster via the configured gateway endpoint.

---

## 1. Getting Started

Select **Expose via Gateway** from the **Operations** section in the left sidebar. The form has a single toggle that controls the gateway exposure state of your database.

![Expose via Gateway page showing the Expose Database toggle and Deploy button](../images/expose-via-gateway.png)

---

## 2. Exposing the Database

1. **Expose Database:** Toggle this switch to enable or disable external access to your database through the gateway.
   - Toggle **on** — The database will be exposed and accessible via the gateway endpoint.
   - Toggle **off** — The database will be unexposed and gateway access will be removed.

> **Warning:** Exposing your database through the gateway makes it accessible from outside the cluster. Ensure TLS and authentication are properly configured before enabling this option.

---

## 3. Applying the Change

1. **Deploy:** Once you have set the toggle to the desired state, click **Deploy** to apply the change immediately.

> **Note:** Unlike other operations, this action does not have a Preview step — the change is applied as soon as you click **Deploy**. Verify your toggle state before proceeding.

---

## Quick Reference

| Action | How to do it |
|---|---|
| Expose database via gateway | Toggle **Expose Database** on → **Deploy** |
| Remove gateway exposure | Toggle **Expose Database** off → **Deploy** |
