---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: billing-and-usage-guide-cost-management
    name: Cost Management
    parent: billing-and-usage-guide
    weight: 40
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
info:
  kubedb-installer: v2026.6.19
  kubeops-installer: v2026.6.19
  product: kubedbplatform
  version: v2026.6.19
---

## **Cluster and Namespace Configuration for Cost Management**

For effective cost management, users can configure their clusters and namespaces. This section covers how to set a cluster's mode to **PROD** or **NON-PROD** for different billing rates, and how to enable a one-month free trial for KubeDB resources in a specific namespace.

### **Configuring Cluster Mode (PROD vs. NON-PROD)**

We offer different billing rates for production (**PROD**) and non-production (**NON-PROD**) environments. To distinguish between these, the user must set an annotation on the kube-system namespace of the cluster. The system considers a cluster as **PROD** only if the mode is explicitly set to `prod`. All other modes (`qa`, `staging`, `dev`) are treated as **NON-PROD**.

**To set the cluster mode:**

1. Identify the kube-system namespace in the cluster.
2. Apply the following annotation: `cluster.appscode.com/mode`.

Here are the possible values for the annotation:

| Value | Cluster Mode Interpretation |
| :---- | :---- |
| prod | **PROD** (Production) |
| qa | **NON-PROD** (Quality Assurance) |
| staging | **NON-PROD** (Staging) |
| dev | **NON-PROD** (Development) |

**Example using kubectl:**

To set a cluster to **PROD** mode, run the following command:

```shell
kubectl annotate namespace kube-system cluster.appscode.com/mode=prod --overwrite
```

To set it to a **NON-PROD** mode like staging, run:

```shell
kubectl annotate namespace kube-system cluster.appscode.com/mode=staging --overwrite
```

### **Enabling the First One-Month Free Resource Trial**

Users can get a one-month free trial for every KubeDB database running within a specific namespace. This allows for evaluation of the service without incurring costs during the trial period.

To enable the free trial, the user needs to add a specific annotation to the desired namespace.

- **Who applies this:** In a DBaaS setup, downstream users typically do not have direct access to the cluster. The annotation must be applied by the cluster/infra administrator who manages the cluster.
- **Where it can be used:** The trial can be enabled in namespaces on both **PROD** and **NON-PROD** clusters. While the trial is active, eligible database usage is counted as **free usage** (not billed and reported as Free usage in the Billable section), regardless of cluster mode. After the trial ends for a database, subsequent usage follows the cluster's pricing mode (**PROD** or **NON-PROD**) and your contract status (paid contract vs. the 30‑day free contract when no paid contract exists).

**To enable the trial:**

1. Select the namespace that contains your KubeDB databases. The trial behavior depends on when databases are created relative to when the annotation is applied:
   - **Existing databases:** If a database is still within its first month from creation, it will receive free trial usage for the remaining portion of that first month (starting from when the annotation is applied). Databases that have already completed their first month are not eligible for the trial.
   - **New databases:** Any databases created after the annotation is applied will receive a full one-month free trial from their creation timestamp, as long as the namespace remains annotated.
   - **Trial eligibility:** Each database is eligible for a one-month free trial only once during its lifetime.
2. Apply the annotation `ace.appscode.com/enable-resource-trial` with the value `true`.

**Example using kubectl:**

To enable the free trial for a namespace named `my-app-ns`, run the following command:

```shell
kubectl annotate namespace my-app-ns ace.appscode.com/enable-resource-trial=true --overwrite
```

Once this annotation is applied, eligible KubeDB resources in this namespace will receive trial benefits as described above.

