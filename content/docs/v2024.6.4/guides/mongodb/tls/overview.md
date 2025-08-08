---
title: MongoDB TLS/SSL Encryption Overview
menu:
  docs_v2024.6.4:
    identifier: mg-tls-overview
    name: Overview
    parent: mg-tls
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# MongoDB TLS/SSL Encryption

**Prerequisite :** To configure TLS/SSL in `MongoDB`, `KubeDB` uses `cert-manager` to issue certificates. So first you have to make sure that the cluster has `cert-manager` installed. To install `cert-manager` in your cluster following steps [here](https://cert-manager.io/docs/installation/kubernetes/).

To issue a certificate, the following crd of `cert-manager` is used:

- `Issuer/ClusterIssuer`: Issuers, and ClusterIssuers represent certificate authorities (CAs) that are able to generate signed certificates by honoring certificate signing requests. All cert-manager certificates require a referenced issuer that is in a ready condition to attempt to honor the request. You can learn more details [here](https://cert-manager.io/docs/concepts/issuer/).

- `Certificate`: `cert-manager` has the concept of Certificates that define a desired x509 certificate which will be renewed and kept up to date. You can learn more details [here](https://cert-manager.io/docs/concepts/certificate/).

**MongoDB CRD Specification :**

KubeDB uses following crd fields to enable SSL/TLS encryption in `MongoDB`.

- `spec:`
  - `sslMode`
  - `tls:`
    - `issuerRef`
    - `certificates`
  - `clusterAuthMode`
Read about the fields in details from [mongodb concept](/docs/v2024.6.4/guides/mongodb/concepts/mongodb),

When, `sslMode` is set to `requireSSL`, the users must specify the `tls.issuerRef` field. `KubeDB` uses the `issuer` or `clusterIssuer` referenced in the `tls.issuerRef` field, and the certificate specs provided in `tls.certificate` to generate certificate secrets using `Issuer/ClusterIssuers` specification. These certificates secrets including `ca.crt`, `tls.crt` and `tls.key` etc. are used to configure `MongoDB` server, exporter etc. respectively.

## How TLS/SSL configures in MongoDB

The following figure shows how `KubeDB` enterprise used to configure TLS/SSL in MongoDB. Open the image in a new tab to see the enlarged version.

<figure align="center">
<img alt="Deploy MongoDB with TLS/SSL" src="/docs/v2024.6.4/images/day-2-operation/mongodb/mongodb-tls.svg">
<figcaption align="center">Fig: Deploy MongoDB with TLS/SSL</figcaption>
</figure>

Deploying MongoDB with TLS/SSL configuration process consists of the following steps:

1. At first, a user creates a `Issuer/ClusterIssuer` cr.

2. Then the user creates a `MongoDB` cr which refers to the `Issuer/ClusterIssuer` cr that the user created in the previous step.

3. `KubeDB` Provisioner  operator watches for the `MongoDB` cr.

4. When it finds one, it creates `Secret`, `Service`, etc. for the `MongoDB` database.

5. `KubeDB` Ops-manager operator watches for `MongoDB`(5c), `Issuer/ClusterIssuer`(5b), `Secret` and `Service`(5a).

6. When it finds all the resources(`MongoDB`, `Issuer/ClusterIssuer`, `Secret`, `Service`), it creates `Certificates` by using `tls.issuerRef` and `tls.certificates` field specification from `MongoDB` cr.

7. `cert-manager` watches for certificates.

8. When it finds one, it creates certificate secrets `tls-secrets`(server, client, exporter secrets etc.) that holds the actual certificate signed by the CA.

9. `KubeDB` Provisioner  operator watches for the Certificate secrets `tls-secrets`.

10. When it finds all the tls-secret, it creates the related `StatefulSets` so that MongoDB database can be configured with TLS/SSL.

In the next doc, we are going to show a step by step guide on how to configure a `MongoDB` database with TLS/SSL.