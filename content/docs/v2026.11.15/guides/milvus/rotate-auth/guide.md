---
title: Rotate Authentication of Milvus
menu:
  docs_v2026.11.15:
    identifier: milvus-rotate-auth-guide
    name: Guide
    parent: milvus-rotate-auth
    weight: 20
menu_name: docs_v2026.11.15
section_menu_id: guides
info:
  autoscaler: v0.54.0
  cli: v0.69.0
  dashboard: v0.45.0
  installer: v2026.11.15
  ops-manager: v0.56.0
  product: kubedb
  provisioner: v0.69.0
  schema-manager: v0.45.0
  ui-server: v0.45.0
  version: v2026.11.15
  webhook-server: v0.45.0
---

> New to KubeDB? Please start [here](/docs/v2026.11.15/README).

# Rotate Authentication of Milvus

This guide will show you how to use the `KubeDB` Ops-manager operator to rotate the authentication credentials of a Milvus database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.11.15/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.11.15/guides/milvus/concepts/milvusopsrequest)
  - [Rotate Authentication Overview](/docs/v2026.11.15/guides/milvus/rotate-auth/overview)

- Complete the dependency setup from [Prepare Dependencies](/docs/v2026.11.15/guides/milvus/quickstart/prerequisites). It installs MinIO and creates the object-storage secrets (`milvus-storage-config` for `milvus-standalone`, `milvus-cluster-storage-config` for `milvus-cluster`).

> Note: The yaml files used in this tutorial are stored in [docs/guides/milvus/rotate-auth/yamls](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/milvus/rotate-auth/yamls) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Deploy Milvus

This guide rotates the credentials of the databases from the quickstarts. Deploy the [standalone quickstart](/docs/v2026.11.15/guides/milvus/quickstart/standalone) manifest, which does not set `spec.authSecret`, and wait until it is `Ready`:

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/quickstart/yamls/standalone.yaml
milvus.kubedb.com/milvus-standalone created

$ kubectl get milvuses.kubedb.com -n demo milvus-standalone -w
```

> If you deleted a Milvus of the same name in an earlier guide, delete its object-storage prefix first, as shown in [Prepare Dependencies](/docs/v2026.11.15/guides/milvus/quickstart/prerequisites#delete-a-milvus-instances-object-storage-data). Otherwise the new database can hang in `Provisioning`.

## Auth Secret Basics

Milvus authentication is enabled by default. When `spec.authSecret` is omitted, KubeDB creates a `kubernetes.io/basic-auth` secret named `<db>-auth` with a `root` user and a random password:

```bash
$ kubectl get secret milvus-standalone-auth -n demo
NAME                     TYPE                       DATA   AGE
milvus-standalone-auth   kubernetes.io/basic-auth   2      92s

$ kubectl get secret milvus-standalone-auth -n demo -o jsonpath='{.data.username}' | base64 -d
root
```

There are two ways to rotate this credential.

## Rotate Standalone Milvus (User-Supplied Secret)

This sample provides a new secret with a known password and asks the operator to switch to it.

`rotate-auth-standalone.yaml`

```yaml
---
apiVersion: v1
kind: Secret
metadata:
 name: milvus-new-auth1
 namespace: demo
type: Opaque
stringData:
 username: root
 password: NewPassword1
---
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: milvus-rotate-auth-user-secret
  namespace: demo
spec:
  type: RotateAuth
  databaseRef:
    name: milvus-standalone
  authentication:
    secretRef:
      kind: Secret
      name: milvus-new-auth1
```

Here, `spec.authentication.secretRef.name` points at the user-created secret. To let the operator generate a random password instead, simply omit `spec.authentication`.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/rotate-auth/yamls/rotate-auth-standalone.yaml
secret/milvus-new-auth1 created
milvusopsrequest.ops.kubedb.com/milvus-rotate-auth-user-secret created
```

### Watch Progress

```bash
$ kubectl get milvusopsrequest milvus-rotate-auth-user-secret -n demo
NAME                             TYPE         STATUS       AGE
milvus-rotate-auth-user-secret   RotateAuth   Successful   83s
```

```bash
$ kubectl describe milvusopsrequest milvus-rotate-auth-user-secret -n demo
...
Status:
  Conditions:
    Message:  Milvus ops-request has started to rotate auth for milvus nodes
    Reason:   RotateAuth
    Type:     RotateAuth
    Message:  Successfully referenced the user provided authSecret
    Reason:   UpdateCredential
    Type:     UpdateCredential
    Message:  Successfully updated milvus credential dynamically
    Reason:   UpdateCredentialDynamically
    Type:     UpdateCredentialDynamically
    Message:  successfully reconciled the Milvus with new auth secret
    Reason:   UpdatePetSets
    Type:     UpdatePetSets
    Message:  Successfully restarted all milvus nodes
    Reason:   RestartNodes
    ...
  Phase:      Successful
```

### Verify the Rotation

The database now references the new secret:

```bash
$ kubectl get milvuses.kubedb.com milvus-standalone -n demo -o jsonpath='{.spec.authSecret.name}'
milvus-new-auth1
```

The new activation time is recorded in `spec.authSecret.activeFrom` and in the `kubedb.com/auth-active-from` annotation of the **new** secret. (The old `milvus-standalone-auth` secret keeps its original annotation, from when the database was created.)

```bash
$ kubectl get milvuses.kubedb.com milvus-standalone -n demo -o jsonpath='{.spec.authSecret.activeFrom}'
2026-06-30T17:19:33Z

$ kubectl get secret milvus-new-auth1 -n demo -o jsonpath='{.metadata.annotations.kubedb\.com/auth-active-from}'
2026-06-30T17:19:33Z
```

Finally, check the credentials against Milvus itself. Port-forward the REST port in a separate terminal (`kubectl port-forward svc/milvus-standalone -n demo 8080:8080`), then try the old password, which is still stored in `milvus-standalone-auth`:

```bash
$ OLD_PASSWORD=$(kubectl get secret milvus-standalone-auth -n demo -o jsonpath='{.data.password}' | base64 -d)
$ curl -s -X POST "http://localhost:8080/v2/vectordb/collections/list" \
    -H "Authorization: Bearer root:${OLD_PASSWORD}" \
    -H "Content-Type: application/json" -d '{}'
{"code":1800,"message":"user hasn't authenticated"}
```

The same request with `Bearer root:NewPassword1` succeeds (`"code":0`) and lists the collections.

## Rotate Distributed Milvus

For a distributed Milvus, point `spec.databaseRef.name` at the distributed database (`milvus-cluster`). The credential is updated dynamically inside every distributed role.

Deploy the [distributed quickstart](/docs/v2026.11.15/guides/milvus/quickstart/distributed) manifest and wait until it is `Ready`:

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/quickstart/yamls/distributed.yaml
milvus.kubedb.com/milvus-cluster created

$ kubectl get milvuses.kubedb.com -n demo milvus-cluster -w
```

The distributed sample reuses the OpsRequest name of the standalone one, so delete the standalone OpsRequest first. If the `milvus-new-auth1` secret from the standalone section still exists, `kubectl apply` reports it as `unchanged` instead of `created`.

```bash
$ kubectl delete milvusopsrequest -n demo milvus-rotate-auth-user-secret
```

`rotate-auth-distributed.yaml`

```yaml
---
apiVersion: v1
kind: Secret
metadata:
 name: milvus-new-auth1
 namespace: demo
type: Opaque
stringData:
 username: root
 password: NewPassword1
---
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: milvus-rotate-auth-user-secret
  namespace: demo
spec:
  type: RotateAuth
  databaseRef:
    name: milvus-cluster
  authentication:
    secretRef:
      kind: Secret
      name: milvus-new-auth1
```

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/rotate-auth/yamls/rotate-auth-distributed.yaml
secret/milvus-new-auth1 created
milvusopsrequest.ops.kubedb.com/milvus-rotate-auth-user-secret created

$ kubectl get milvusopsrequest milvus-rotate-auth-user-secret -n demo
NAME                             TYPE         STATUS       AGE
milvus-rotate-auth-user-secret   RotateAuth   Successful   3m56s
```

The credential is updated dynamically and then every role is reconciled and restarted:

```bash
$ kubectl describe milvusopsrequest milvus-rotate-auth-user-secret -n demo
...
Status:
  Conditions:
    Message:  Successfully referenced the user provided authSecret
    Reason:   UpdateCredential
    Type:     UpdateCredential
    Message:  Successfully updated milvus credential dynamically
    Reason:   UpdateCredentialDynamically
    Type:     UpdateCredentialDynamically
    Message:  successfully reconciled the Milvus with new auth secret
    Reason:   UpdatePetSets
    Type:     UpdatePetSets
  Phase:      Successful

$ kubectl get milvuses.kubedb.com milvus-cluster -n demo -o jsonpath='{.spec.authSecret.name}'
milvus-new-auth1
```

## Automatic Rotation Recommendations

The Recommendation Engine can generate `RotateAuth` recommendations automatically based on two fields on `spec.authSecret`:

- **`rotateAfter`** — once the credential is older than this duration, a `RotateAuth` recommendation is generated.
- **`activeFrom`** — the timestamp the credential became active (also reflected in the `kubedb.com/auth-active-from` annotation on the secret); `rotateAfter` is measured from this point.

See the [Recommendation Engine guide](/docs/v2026.11.15/guides/milvus/recommendation/guide) for an end-to-end walkthrough.

## Cleaning up

```bash
$ kubectl delete milvusopsrequest -n demo milvus-rotate-auth-user-secret
$ kubectl patch -n demo milvus.kubedb.com milvus-standalone -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
$ kubectl patch -n demo milvus.kubedb.com milvus-cluster -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
$ kubectl delete milvus.kubedb.com -n demo milvus-standalone milvus-cluster
$ kubectl delete secret -n demo milvus-new-auth1
$ kubectl delete ns demo
```

## Next Steps

- Learn more about the [Recommendation Engine](/docs/v2026.11.15/guides/milvus/recommendation/guide).
- Detail concepts of [Milvus object](/docs/v2026.11.15/guides/milvus/concepts/milvus).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.11.15/CONTRIBUTING).
