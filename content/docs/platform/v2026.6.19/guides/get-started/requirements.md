---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: guide-ace-requirements
    name: KubeDB Platform Requirements
    parent: guide-start
    weight: 14
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Requirements to deploy KubeDB Platform
We will discuss the resources requirements. networking requirements & best practices for deploying your first KubeDB Platform & DBaaS cluster. It is highly recommended to read the [architecture](https://appscode.com/docs/en/guides/get-started/architecture.html) doc first before continuing. 

## Requirements for KubeDB Platform Cluster

### 1. Resources
**Minimum**: Single node with 4 cpu, 16 GB ram, 100 GB disk attached. A k3s cluster will be deployed on that VM. And then the ui-components will be installed.

**HA Deployment**: 3 worker nodes, each with 4 cpu, 16 GB ram, PVC support (3000 iops, 200 GB disk across multiple pvcs) and LB service support. The Kubernetes control plane should be also HA.

### 2. Networking
If you want to run in an air-gapped environments (disconnected from internet), You will have to make sure that all images are cached locally. You can use Harbor or jfrog artifactory for this. 

We maintain a complete list of the [charts](https://github.com/appscode-cloud/installer/blob/master/catalog/copy-images.sh) & [images](https://github.com/appscode-cloud/installer/blob/master/catalog/ace.yaml).

#### Connectivity
These are the required connectivities to everything work correctly:
- `DB pod to pod` communication using dns (k8s service discovery)
- `operator to db-pods` for health checks
- `db pods to kube-apiserver` for failover handling (update pod label when it becomes a primary replica)
- `operator to kube-apiserver` for CRUD
- `Backup pods to db pods` over network and on node level so they can access the shared disks.
- `Backup pods to object storage` (s3 , minio etc.)

#### Port Requirements
1. 80  -  Auto redirects to https
2. 443  -  Https Ingress port
3. 4222  -  NATS.io port
4. 4224  -  s3-proxy service port

Here is a sample video on how you can setup KubeDB Platform:
<iframe width="560" height="315" src="https://www.youtube.com/embed/1diG8qq73f4?si=pisqA3gOrfO1wxlx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Requirements for DBaaS Cluster
### 1. Resources
Depends on how many and what size of databases users are running.

Minimum: Kubernetes cluster with 3 worker nodes, each with 8- 16GB ram, PVC support (3000 iops, 200 GB disk across multiple pvcs) and LB service support.

Note that, The largest node must be able to fit the largest DB Pod(in terms of CPU, memory).

### 2. Networking
Literally all the Networking requirements described for KubeDB Platform are also applicable here, except the `Port Requiements` part.
Only one additional requirement here is that the DBaaS cluster should be accessible from the management/KubeDB Platform cluster.

You now have an overall idea on the requirements. So, [Login](https://appscode.com/docs/en/guides/get-started/register-login.html) into your account & get going with our [installer](https://appscode.com/selfhost/). Happy KubeDB Platform!
