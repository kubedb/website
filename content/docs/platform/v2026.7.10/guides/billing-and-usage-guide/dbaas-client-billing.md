---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: billing-and-usage-guide-dbaas-client-billing
    name: DBaaS Client Billing
    parent: billing-and-usage-guide
    weight: 30
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

### **DBaaS Provider Billing APIs**

This section is intended for DBaaS providers (self-hosted administrators) who manage the platform for end-users. To help providers monitor the resource consumption of their clients, we expose a set of APIs that deliver detailed usage reports for specific namespaces. This is particularly useful for billing, resource planning, and gaining insights into how end-users are utilizing the KubeDB resources within their assigned namespaces.

#### **Prerequisites: Enabling Client Billing**

Before these APIs can be used, the **Client Billing** feature must be enabled in your contract with us. This is a digital agreement that activates the necessary backend services to collect and expose usage data for your clients' namespaces from our central system.

For more information on how to view or modify your contract, please refer to the [official contract management documentation](https://appscode.com/docs/en/guides/license-management/contract.html) or contact [AppsCode administrators](https://appscode.com/contact/). Once **Client Billing** is enabled in your contract, you can proceed to use the API endpoints detailed below.

### **Authentication**

To use these APIs, you must authenticate your requests. Usage information is collected and stored in our central system, and accessing it requires a secure token.

1. **Generate an Access Token:** Create a user-scoped API token from your account.
   - Go to User Settings and open the `Tokens` tab, then click on `Generate Token`.
     ![Navigate to API Tokens](../images/create-token-ui-navigation.png)
   - Provide a token name and (optionally) an expiry, then click on `Generate`.
     ![Create token options](../images/create-token-options.png)
   - Copy the token and store it securely. It’s shown only once.
     ![Copy the generated token](../images/created-token-result.png)
2. **Use as a Bearer Token:** This token must be included in the Authorization header of your API requests as a Bearer token.

**Example Header:** Authorization: Bearer <YOUR_ACCESS_TOKEN>  

**Note:** Treat this access token as a confidential credential. Do not expose it in client-side code or public repositories.

### **Information Available for Client-Side Billing**

The billing reports expose the following information for use in customer invoicing and internal chargeback. This section describes what you can expect to see; the next section explains how to query it via APIs.

1) Namespace Level
   - **Database Information:** Identifies the type of database deployed in each namespace (for example, MongoDB, PostgreSQL, MySQL), along with the database name as visible to the platform.

2) Database Level
   - **Pod Details:**
     - **Flavor:** CPU and Memory allocation for each pod.
     - **Age of Pod:** Duration since pod creation.
     - **Number of Pods:** Total pod count, including autoscaling pods.
   - Volume Details:
     - **Volume Name:** Name of the persistent volume.
     - **Initial Size:** Initial size of the volume at creation.
     - **Expanded Sizes:** Any volume size increases, including the size and timestamp of each expansion.
     - **Volume Created At:** Timestamp when the volume was created.
     - **Volume Age:** Duration since the volume was created.
     - **Volume Expansion History:** Record of any expansion events, with size and timestamp.
     - **Volume Deleted At:** Timestamp when the volume was deleted (if applicable).

**Notes:** Timestamps are reported in UNIX time. Sizes are returned as strings with Gi units (for example, '10Gi').

### **API Endpoints**

The following APIs are available to retrieve billing and usage reports.

#### **1. Get Usage Reports for All Namespaces**

This endpoint retrieves a consolidated usage report for all namespaces that are bound to your client organizations. It is ideal for generating auditing reports and getting a high-level overview of resource consumption.

* **Endpoint:** 
> GET https://appscode.com/api/v1/dbaas/billing/reports/namespaces
* **Description:** Returns a list of usage reports, with each report corresponding to a namespace managed under your DBaaS platform. This endpoint is particularly useful for auditing, billing reconciliation, and high‑level usage analysis.
* **Query Parameters:**
    * **org** (string, optional): The organization name in the central **appscode.com** platform that owns your billing contract and receives usage from your self-hosted installation. The authenticated user must be a member of this organization. Use this to restrict results to namespaces reported under that org.
* **Limitations:**
    * The current implementation does not support pagination. As a result, the endpoint returns all available namespaces, which may lead to large response sizes over time.
    * Resources (including namespaces, pods, and volumes) that were deleted more than six months ago are automatically excluded from the response.
* **Example Response:** The response will contain a list of namespace reports. Each report includes cluster information, namespace details, and a breakdown of the databases running within that namespace. Please see the [Additional Resources](#additional-resources) section below for detailed response schema and example.

#### **2. Get Usage Report for a Specific Namespace**

This endpoint allows you to drill down and retrieve a detailed usage report for a single, specific namespace within a given cluster. This is useful for generating invoices or analyzing the consumption of a particular client.

* **Endpoint:** 
> GET https://appscode.com/api/v1/dbaas/billing/reports/clusters/{clusterID}/namespaces/{namespace}
* **Description:** Returns a detailed usage report for the specified namespace, including information about the cluster, the namespace itself, and all KubeDB resources deployed within it.
* **Path Parameters:**
    * **clusterID** (string, required): The unique identifier of the spoke cluster where the namespace is located.
    * **namespace** (string, required): The name of the namespace for which the report is being requested.
* **Query Parameters:**
    * **org** (string, optional): The organization name in the central **appscode.com** platform that owns your billing contract and to which your self-hosted app reports usage. The authenticated user must be a member of this organization. Provide the org created for your DBaaS customer to target the correct data.
* **Cautions:**
    * The namespace name provided in the path should be unique within the specified cluster, or unique across all clusters if you need to ensure you are targeting the correct one.
    * In the self-hosted platform, each **client organization** (client-org) name must be unique because the DBaaS namespace is created with exactly the same name as that client-org. This one-to-one mapping means duplicate client-org names will cause namespace conflicts.
    * You can optionally add an annotation to the namespace to tag the downstream end-user (for example, a customer ID or external reference) so you can map reports back to your own user records.
* **Response Breakdown:** The JSON response for a single namespace provides granular details:
    * **clusterInfo**: Contains metadata about the cluster, such as its name, Kubernetes version, provider, and resource capacity.
    * **namespaceInfo**: Includes the namespace's labels, annotations, and creation timestamp.
    * **databases**: An array of objects, where each object represents a KubeDB instance and contains:
        * **databaseInfo**: Basic details like the database kind, product, and resource name.
        * **podDetails**: Information about the pods, including CPU and memory resources allocated.
        * **volumeDetails**: Details about the persistent volumes, including their initial size and any expansion history.

For full field-by-field schemas, sample payloads, and screenshots, see the [Additional Resources](#additional-resources) section below.

### **General API Cautions**

- **Time Format:** All time-related values in the API responses (e.g., createdAt, lastReceivedAt) are represented in the **UNIX time format**.
- **Data Retention:** The API response does not include resources (namespaces, pods, volumes, etc.) that were deleted more than **six months ago**.

### **Additional Resources**
- **Document Files:** For related document files, please access the following shared drive: [DBaaS Billing API Documents](https://drive.google.com/drive/u/1/folders/14ccceVuJQCKLvi9iSswnz86LqvB3Dfeq)
