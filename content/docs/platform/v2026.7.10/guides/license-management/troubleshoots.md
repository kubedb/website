---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: license-management-license-proxyserver-troubleshoot
    name: Troubleshoot
    parent: license-management
    weight: 40
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

## Troubleshooting License Proxy Server Issues
The troubleshooting process involves verifying its API registration, service health, connectivity to the AppsCode backend etc.

#### 1. Verify `APIService` Configuration
First, confirm that the APIService for the license-proxyserver is correctly registered and available within the Kubernetes API aggregation layer.

```bash
kubectl get apiservice v1alpha1.proxyserver.licenses.AppsCode.com -o yaml
```

**Interpretation:**
Examine the `status.conditions` section of the output. Look for a condition with `type: Available` and `status: "True"`. ![APIService Status](../images/license-proxy-apiservice-yaml-status.png) 
This indicates that the Kubernetes API aggregation layer is properly configured to route requests to the `license-proxyserver`. If this condition is `"False"` or `missing`, it suggests an issue with the APIService registration or the `license-proxyserver's` readiness.


#### 2. Check `API Resources`
Next, verify that the custom API resources exposed by the `license-proxyserver` are recognized by the Kubernetes API.

```bash
kubectl api-resources | grep -i license
```
**Expected Output:**
You should see entries similar to these, confirming the presence of license-related API resources:
```text
NAME                                SHORTNAMES                     APIVERSION                                           NAMESPACED   KIND
addofflinelicenses                                                 offline.licenses.AppsCode.com/v1alpha1               false        AddOfflineLicense
offlinelicenses                                                    offline.licenses.AppsCode.com/v1alpha1               true         OfflineLicense
licenserequests                                                    proxyserver.licenses.AppsCode.com/v1alpha1           false        LicenseRequest
licensestatuses                                                    proxyserver.licenses.AppsCode.com/v1alpha1           false        LicenseStatus
```

This output confirms that the Kubernetes API recognizes the custom resources provided by the `license-proxyserver`.

You can also inspect the raw `API definition` exposed by the `license-proxyserver` to confirm its capabilities:
```bash
kubectl get --raw=/apis/proxyserver.licenses.AppsCode.com/v1alpha1/ | jq
```
**Expected Output (abbreviated):**
```json
{
  "kind": "APIResourceList",
  "apiVersion": "v1",
  "groupVersion": "proxyserver.licenses.AppsCode.com/v1alpha1",
  "resources": [
    {
      "name": "licenserequests",
      "singularName": "licenserequest",
      "namespaced": false,
      "group": "proxyserver.licenses.AppsCode.com",
      "version": "v1alpha1",
      "kind": "LicenseRequest",
      "verbs": [
        "create"
      ]
    },
    {
      "name": "licensestatuses",
      "singularName": "licensestatus",
      "namespaced": false,
      "group": "proxyserver.licenses.AppsCode.com",
      "version": "v1alpha1",
      "kind": "LicenseStatus",
      "verbs": [
        "get",
        "list"
      ]
    }
  ]
}
```

**Interpretation:**
This output confirms that the `license-proxyserver` API server is exposing `licenserequests` (with create verb) and `licensestatuses` (with `get`, `list` verbs) resources. 
This is crucial for the `kubectl get licensestatus` command to function correctly.

#### 3. Verify `license-proxyserver` Service and Endpoints
If the API registration appears correct, the next step is to ensure that the Kubernetes Service and Endpoints for the `license-proxyserver` are functioning properly, allowing internal cluster 
traffic to reach the pod.

```bash
kubectl get svc -n kubeops license-proxyserver
kubectl get endpoints -n kubeops license-proxyserver
```

**Interpretation:**
- For the `kubectl get svc -n kubeops license-proxyserver` command, verify that the service `TYPE is ClusterIP` and has a `cluster-IP`.
```text
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)            AGE
license-proxyserver   ClusterIP   10.43.189.38   <none>        443/TCP,8080/TCP   19h
```

- For the `kubectl get endpoints -n kubeops license-proxyserver` command, ensure that the endpoints list contains the IP address(es) of the `license-proxyserver` pod(s). 
  The IP(s) listed here should match the IP(s) of the actual `license-proxyserver` pod(s) in the `kubeops` namespace. If the endpoints are missing or incorrect, 
  it indicates a problem with the `service selector` or the `license-proxyserver`  pod itself (e.g., pod not `running`, `crashlooping`).


#### 4. Test AppsCode Backend Connectivity (for Online Mode/Fallback)
If the `in-cluster` components of the `license-proxyserver` appear healthy, and you are operating in `Online Mode` or troubleshooting an `Offline Mode fallback` scenario, verify that the cluster can reach the AppsCode licensing backend.

1. **Check Network Connectivity:** Ensure that the cluster has internet access and can reach the AppsCode licensing backend. This may involve checking `firewall rules`, `network policies`, or `proxy settings`. <br><br>
2. **Get Cluster ID:** Retrieve the unique identifier for your Kubernetes cluster:
   ```bash 
     kubectl get ns kube-system -o=jsonpath='{.metadata.uid}'
   ```
   Copy the output, which will be your `<CLUSTER_ID>`. <br><br>
3. **Get Platform Token:** Extract the platform token used by the `license-proxyserver` for authentication with the AppsCode backend:
    ```bash
    kubectl get secrets -n kubeops ace-licenseserver-cred -o=jsonpath='{.data.license-proxyserver\.yaml}' | base64 -d
    ```
   From the output, locate the token field under `platform:` (e.g., `token: ac9b9eeec181fb09j73ab1604bd0180a4361e859`). Copy this value as your `<TOKEN>`. <br><br>
4. **Get License Using CURL:** Perform a `curl` request to the AppsCode Backend: Use `curl` from within a pod in your cluster (or a machine with network access to the cluster's outbound internet) to simulate a 
  license request to the AppsCode backend. Replace `<CLUSTER_ID>` and `<TOKEN>` with the values obtained in the previous steps. The features can be get from the Contract details page in AppsCode Billing Console
  ```bash
    curl -k -X 'POST' -d '{"cluster":"<CLUSTER_ID>","features":["kubedb-enterprise"]}' \
    -H 'Authorization: Bearer <TOKEN>' \
    -H 'Content-Type: application/json' \
    -H 'User-Agent: license-proxyserver/v0.0.22' \
    'https://api.AppsCode.com/api/v1/license/issue' --compressed
```
  **Expected curl Response Analysis:**
  A successful response indicates that your cluster can communicate with the AppsCode backend and that the authentication token is valid. The response will contain `contract` and `license` sections:
  ```json
    {
      "contract": {
          "id": "1187",
          "startTimestamp": "2025-05-21T00:00:00Z",
          "expiryTimestamp": "2025-06-21T23:59:59Z"
      },
      "license": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUlaRENDQjB5Z0F3SUJBZ0lJUFY2NEVSL0o1aE13RFFZSktvWklodmNOQVFFTEJRQXdKVEVXTUJRR0ExVUUKQ2hNTlFYQndjME52WkdVZ1NXNWpMakVMTUFrR0ExVUVBeE1DWTJFd0hoY05NalV3TlRJek1EUTFNVE0xV2hjTgpNalV3TlRNd01EUTFNVE0xV2pDQ0JRUXhEekFOQmdOVkJBWVRCbXQxWW1Wa1lqRVRNQkVHQTFVRUNCTUtaVzUwClpYSndjbWx6WlRHQ0ErZ3dnZ1BrQmdOVkJBY01nZ1BiVW1WemRISnBZM1JwYjI1elBYc05DaUFnSWtSeWRXbGsKSWpvZ2V3MEtJQ0FnSUNKMlpYSnphVzl1UTI5dWMzUnlZV2x1ZENJNklDSXFJZzBLSUNCOUxBMEtJQ0FpUld4aApjM1JwWTNObFlYSmphQ0k2SUhzTkNpQWdJQ0FpZG1WeWMybHZia052Ym5OMGNtRnBiblFpT2lBaUtpSXNEUW9nCklDQWdJbVJwYzNSeWFXSjFkR2x2Ym5NaU9pQmJEUW9nSUNBZ0lDQWlUM0JsYmxObFlYSmphQ0lOQ2lBZ0lDQmQKRFFvZ0lIMHNEUW9nSUNKR1pYSnlaWFJFUWlJNklIc05DaUFnSUNBaWRtVnljMmx2YmtOdmJuTjBjbUZwYm5RaQpPaUFpS2lJTkNpQWdmU3dOQ2lBZ0lrdGhabXRoSWpvZ2V3MEtJQ0FnSUNKMlpYSnphVzl1UTI5dWMzUnlZV2x1CmRDSTZJQ0lxSWcwS0lDQjlMQTBLSUNBaVRXRnlhV0ZFUWlJNklIc05DaUFnSUNBaWRtVnljMmx2YmtOdmJuTjAKY21GcGJuUWlPaUFpS2lJTkNpQWdmU3dOQ2lBZ0lrMWxiV05oWTJobFpDSTZJSHNOQ2lBZ0lDQWlkbVZ5YzJsdgpia052Ym5OMGNtRnBiblFpT2lBaUtpSU5DaUFnZlN3TkNpQWdJazE1VTFGTUlqb2dldzBLSUNBZ0lDSjJaWEp6CmFXOXVRMjl1YzNSeVlXbHVkQ0k2SUNJcUlnMEtJQ0I5TEEwS0lDQWlVR1Z5WTI5dVlWaDBjbUZFUWlJNklIc04KQ2lBZ0lDQWlkbVZ5YzJsdmJrTnZibk4wY21GcGJuUWlPaUFpS2lJTkNpQWdmU3dOQ2lBZ0lsQm5RbTkxYm1ObApjaUk2SUhzTkNpQWdJQ0FpZG1WeWMybHZia052Ym5OMGNtRnBiblFpT2lBaUtpSU5DaUFnZlN3TkNpQWdJbEJuCmNHOXZiQ0k2SUhzTkNpQWdJQ0FpZG1WeWMybHZia052Ym5OMGNtRnBiblFpT2lBaUtpSU5DaUFnZlN3TkNpQWcKSWxCdmMzUm5jbVZ6SWpvZ2V3MEtJQ0FnSUNKMlpYSnphVzl1UTI5dWMzUnlZV2x1ZENJNklDSXFJaXdOQ2lBZwpJQ0FpWkdsemRISnBZblYwYVc5dWN5STZJRnNOQ2lBZ0lDQWdJQ0pQWm1acFkybGhiQ0lzRFFvZ0lDQWdJQ0FpClJHOWpkVzFsYm5SRVFpSU5DaUFnSUNCZERRb2dJSDBzRFFvZ0lDSlFjbTk0ZVZOUlRDSTZJSHNOQ2lBZ0lDQWkKZG1WeWMybHZia052Ym5OMGNtRnBiblFpT2lBaUtpSU5DaUFnZlN3TkNpQWdJbEpoWW1KcGRFMVJJam9nZXcwSwpJQ0FnSUNKMlpYSnphVzl1UTI5dWMzUnlZV2x1ZENJNklDSXFJZzBLSUNCOUxBMEtJQ0FpVW1Wa2FYTWlPaUI3CkRRb2dJQ0FnSW5abGNuTnBiMjVEYjI1emRISmhhVzUwSWpvZ0lqdzlJRGN1TkRBaURRb2dJSDBzRFFvZ0lDSlQKYjJ4eUlqb2dldzBLSUNBZ0lDSjJaWEp6YVc5dVEyOXVjM1J5WVdsdWRDSTZJQ0lxSWcwS0lDQjlMQTBLSUNBaQpXbTl2UzJWbGNHVnlJam9nZXcwS0lDQWdJQ0oyWlhKemFXOXVRMjl1YzNSeVlXbHVkQ0k2SUNJcUlnMEtJQ0I5CkRRcDlNWUdrTUJjR0ExVUVDaE1RYTNWaVpXUmlMV052YlcxMWJtbDBlVEFYQmdOVkJBb1RFR3QxWW1Wa1lpMWwKZUhRdGMzUmhjMmd3R0FZRFZRUUtFeEZyZFdKbFpHSXRZWFYwYjNOallXeGxjakFZQmdOVkJBb1RFV3QxWW1WawpZaTFsYm5SbGNuQnlhWE5sTUJ3R0ExVUVDaE1WY0dGdWIzQjBhV052YmkxbG5SbGNuQnlhWE5sTUJBNEdBMVVFCkNoTVhhM1ZpWldSaUxXMXZibWwwYjNKcGJtY3RZV2RsYm5ReEdqQVlCZ05WQkFzVEVXdDFZbVZrWWkxbGJuUmwKY25CeWFYTmxNUzB3S3dZRFZRUURFeVJsTlRjd1pqVXpNeTAwTmpSbExUUTNaVGd0WVdZMU9TMDJOek16TlRBMQpOVFpoWkRJd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNhVDZsdldiSFFsTVpZClphRjNNTStjQ0VPblM0cVJ2cWoyWTNaS2E3K1d1THNhd09xQ2MxdzlLMXpReGVXaGpPSktSL1lqSlNzdUpNV1MKVkY2cEFRZXFEUWgwdFNFUE42Z0pCdmZIVDlxOXliSTc3Q0kwcDFKMTFYL1BFSVhyZStUbWpWWEthcTV3WUNOcQpEdExwZ0tEUG5TajczdHNoSFBhV2Jqb0VLL01OTEw0ZVI0ZUtvRHNqWEN1TEZXeVl4THBZSHhBSVZHN0c1VDB3ClRaaVpSS2dvSGFHOU9FYmZWNmVxT3h3ODNJcGlnV1JvNlZ0ekcwMEpWMG5uM05oTXRmdk01eEUrV3ZndVd0czcKdkFZZTk4UXJ2TitHUVphTTB0RDVUZ1F5SXhIdjdHZEdDMUVUWlhUc2dMNVIrVFg5SXgzV21zQXFDM0VSQncrbgpMZEJvSGx3SkFnTUJBQUdqZ2JZd2diTXdEZ1lEVlIwUEFRSC9CQVFEQWdXZ01CTUdBMVVkSlFRTU1Bb0dDQ3NHCkFRVUZCd01DTUI4R0ExVWRJd1FZTUJhQUZOa3hFU1FnWHIwYmVyTXdJdEtiMFBPU3hLQjVNR3NHQTFVZEVRUmsKTUdLQ0pHVTFOekJtTlRNekxUUTJOR1V0TkRkbE9DMWhaalU1TFRZM016TTFNRFUxTm1Ga01vRWhiM0puTFhoNQplaUE4TXpNME5qRXlRR2xrTG1KNWRHVXVZblZwYkdSbGNuTStnUmN6TXpRMk1USkFhV1F1WW5sMFpTNWlkV2xzClpHVnljekFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBQWRUeXpWWE9SR09zS2FaUDFRZFQxT0lhUW5KWm9wOTgKdUd6R1l2clNlSmdVTnRPaVNka2U0N1VVTGEzTkE4SDhtViszNG1zcUFaUTRkYWppSVova001cm5DbFdDUWE3MgpGV3dJUU9xRm4rcEFReDhYeEVJOEs3OSt6SzBESlRPdHpCYTRoVWgyNlMxOFFMQWRuN1VYWUJ0S3JGTm9VVGoxCmF6ZVF3bDIwbW1IQkNPcVBKdE4wSjVtendOajVzVWhNWG05ZUY4djlhQW9KQ2xySlBuY3BHdWFoQ1JFOW1RbWMKMkw4YnZPYVAzODl4ZmF5VDFsYXBJcXA3QUZockc3RU5RZUF5QmpOUGlJZG1uNExmK0VVdFFwbEd4V0pSdVJ4NgpNdFo0M0lVLzJhM3lvTzRwSzBqNXdSM28xcWllWkN3Q2w0UEpXZFNuT1I2dkVoTmE3TTlwcUE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
    }
  ```
  **Interpretation:**
  - `contract.id:` This field is crucial. If it displays `0`, it indicates that the license issued is a `1-month (30-day)` free `trial` license, automatically provided by AppsCode because the cluster is not explicitly associated with any paid contract. This is useful for initial testing. Each cluster is eligible for this free trial only once.
  - `contract.startTimestamp` and `contract.expiryTimestamp:` These fields define the validity period of the contract under which the license was issued.
  - `license:` This is the actual `Base64-encoded` license token. A valid token here confirms that the AppsCode backend successfully issued a license.
  If the curl command fails (e.g., `connection refused`, `timeout`, `authentication` error), it indicates a network or authentication issue preventing the `license-proxyserver` from reaching the AppsCode backend.

#### 5. Conclusion
The AppsCode License Management System delivers a `lightweight`, `in-cluster` authority for fast, reliable license validation in Kubernetes. Its `online` and `offline` modes accommodate both 
always-connected and isolated environments. It empowers customers with `self-service` capabilities for cluster association.

For unresolved issues, email [support@appscode.com](mailto:support@appscode.com) or [platform-support@appscode.com](mailto:support@appscode.com), or file a ticket at [AppsCode Contact](https://appscode.com/contact).