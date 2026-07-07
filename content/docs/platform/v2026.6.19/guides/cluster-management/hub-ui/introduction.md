---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: hub-ui-introduction
    name: Introduction
    parent: hub-ui
    weight: 30
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---
# Hub UI

Hub UI lets you manage multiple clusters from a single point.

![Hub & Spoke Model](../../images/introduction/hub-spoke-model.png)

### What is OCM?

**Open Cluster Management (OCM)** is a platform for managing multiple Kubernetes clusters from a single control point.

Think of it like this:

* You run multiple stores across different cities (**clusters**)
* You manage them from a central office (**hub cluster**)

OCM acts as that central office, allowing you to:

* Monitor clusters
* Apply configurations
* Manage workloads
* Enforce policies across environments

---

## Core Terminology

### Hub Cluster

The **central control plane** that:

* Manages other clusters
* Stores cluster states
* Distributes applications and policies

---

### Spoke Cluster

A **cluster connected to a hub**

**Analogy:**

* Hub = center of a wheel
* Spokes = connected clusters

Spoke clusters:

* Run workloads
* Receive policies/configurations from the hub

---

### Subscription

Defines what applications/configurations should be deployed to clusters.

---

### Policy

Rules enforced across clusters, such as:

* Security settings
* Network configurations
* Compliance rules
