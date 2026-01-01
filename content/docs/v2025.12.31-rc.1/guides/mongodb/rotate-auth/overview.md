---
title: Rotate Authentication Overview
menu:
  docs_v2025.12.31-rc.1:
    identifier: mg-rotate-auth-overview
    name: Overview
    parent: mg-rotate-auth
    weight: 5
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).

# Rotate Authentication of MongoDB

This guide will give an overview on how KubeDB Ops-manager operator Rotate Authentication configuration.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
    - [MongoDB](/docs/v2025.12.31-rc.1/guides/mongodb/concepts/mongodb)
    - [MongoDBOpsRequest](/docs/v2025.12.31-rc.1/guides/mongodb/concepts/opsrequest)

## How Rotate MongoDB Authentication Configuration Process Works

[//]: # (The following diagram shows how KubeDB Ops-manager operator Rotate Authentication of a `MongoDB`. Open the image in a new tab to see the enlarged version.)

[//]: # ()
[//]: # (<figure align="center">)

[//]: # (  <img alt="Rotate Authentication process of MongoDB" src="/docs/v2025.12.31-rc.1/images/day-2-operation/MongoDB/kf-rotate-auth.svg">)

[//]: # (<figcaption align="center">Fig: Rotate Auth process of MongoDB</figcaption>)

[//]: # (</figure>)

The authentication rotation process for MongoDB using KubeDB involves the following steps:

1. A user first creates a `MongoDB` Custom Resource Object (CRO).

2. The `KubeDB Provisioner operator` continuously watches for `MongoDB` CROs.

3. When the operator detects a `MongoDB` CR, it provisions the required `PetSets`, along with related resources such as secrets, services, and other dependencies.

4. To initiate authentication rotation, the user creates a `MongoDBOpsRequest` CR with the desired configuration.

5. The `KubeDB Ops-manager` operator watches for `MongoDBOpsRequest` CRs.

6. Upon detecting a `MongoDBOpsRequest`, the operator pauses the referenced `MongoDB` object, ensuring that the Provisioner
   operator does not perform any operations during the authentication rotation process.

7. The `Ops-manager` operator then updates the necessary configuration (such as credentials) based on the provided `MongoDBOpsRequest` specification.

8. After applying the updated configuration, the operator restarts all `MongoDB` Pods so they come up with the new authentication environment variables and settings.

9. Once the authentication rotation is completed successfully, the operator resumes the `MongoDB` object, allowing the Provisioner operator to continue its usual operations.

In the next section, we will walk you through a step-by-step guide to rotating MongoDB authentication using the `MongoDBOpsRequest` CRD.
