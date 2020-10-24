---
title: KubeDB Overview
menu:
  docs_v2020.10.24-beta.0:
    identifier: overview-readme
    name: Readme
    parent: overview
    weight: -1
menu_name: docs_v2020.10.24-beta.0
section_menu_id: overview
url: /docs/v2020.10.24-beta.0/overview/
aliases:
- /docs/v2020.10.24-beta.0/overview/README/
info:
  cli: v0.14.0-beta.4
  community: v0.14.0-beta.4
  enterprise: v0.1.0-beta.4
  installer: v0.14.0-beta.4
  version: v2020.10.24-beta.0
---

# KubeDB

Kubernetes has emerged as the de-facto way to deploy modern containerized apps on cloud or on-premises. Despite all that growth on the application layer, the data layer hasn’t gotten as much traction with containerization. That’s not surprising, since handling things like state (the database), availability to other layers of the application, and redundancy for a database makes it challenging to run a database in a distributed environment like Kubernetes.

However, many developers want to treat data infrastructure the same as application stacks. Operators want to use the same tools for databases and applications and get the same benefits as the application layer in the data layer: rapid spin-up and repeatability across environments. This is where KubeDB by AppsCode comes as a solution.

KubeDB by AppsCode is a production-grade cloud-native database management solution for Kubernetes. KubeDB simplifies and automates routine database tasks such as provisioning, patching, backup, recovery, failure detection, and repair for various popular databases on private and public clouds. It frees you to focus on your applications so you can give them the fast performance, high availability, security and compatibility they need.

KubeDB provides you with many familiar database engines to choose from, including PostgreSQL, MySQL, MongoDB, Elasticsearch, Redis and Memcached. And the list is growing. KubeDB’s native integration with Kubernetes makes a unique solution compared to competitive solutions from cloud providers and database vendors.
