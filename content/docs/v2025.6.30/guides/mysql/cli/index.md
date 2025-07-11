---
title: CLI | KubeDB
menu:
  docs_v2025.6.30:
    identifier: guides-mysql-cli
    name: CLI
    parent: guides-mysql
    weight: 100
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# Manage KubeDB objects using CLIs

## KubeDB CLI

KubeDB comes with its own cli. It is called `kubedb` cli. `kubedb` can be used to manage any KubeDB object. `kubedb` cli also performs various validations to improve ux. To install KubeDB cli on your workstation, follow the steps [here](/docs/v2025.6.30/setup/README).

### How to Create objects

`kubectl create` creates a database CRD object in `default` namespace by default. Following command will create a MySQL object as specified in `mysql.yaml`.

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/mysql/cli/yamls/mysql-demo.yaml
mysql.kubedb.com/mysql-demo created
```

You can provide namespace as a flag `--namespace`. Provided namespace should match with namespace specified in input file.

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/mysql/cli/yamls/mysql-demo.yaml --namespace=kube-system
mysql.kubedb.com/mysql-demo created
```

`kubectl create` command also considers `stdin` as input.

```bash
cat mysql-demo.yaml | kubectl create -f -
```

### How to List Objects

`kubectl get` command allows users to list or find any KubeDB object. To list all MySQL objects in `default` namespace, run the following command:

```bash
$ kubectl get mysql
NAME         VERSION   STATUS    AGE
mysql-demo   9.1.0    Running   5m1s
mysql-dev    5.7.44 Running   10m1s
```

To get YAML of an object, use `--output=yaml` flag.

```yaml
$ kubectl get mysql mysql-demo -n demo --output=yaml
apiVersion: kubedb.com/v1
kind: MySQL
metadata:
  name: mysql-demo
  namespace: demo
spec:
  authSecret:
    name: mysql-demo-auth
  podTemplate:
    spec:
      containers:
        - name: mysql
          resources:
            limits:
              memory: 1Gi
            requests:
              cpu: 500m
              memory: 1Gi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            runAsGroup: 999
            runAsNonRoot: true
            runAsUser: 999
            seccompProfile:
              type: RuntimeDefault
      initContainers:
        - name: mysql-init
          resources:
            limits:
              memory: 512Mi
            requests:
              cpu: 200m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            runAsGroup: 999
            runAsNonRoot: true
            runAsUser: 999
            seccompProfile:
              type: RuntimeDefault
      serviceAccountName: mysql-demo
  replicas: 1
  storage:
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
    storageClassName: standard
  storageType: Durable
  deletionPolicy: Delete
  version: 9.1.0
```

To get JSON of an object, use `--output=json` flag.

```bash
kubectl get mysql mysql-demo --output=json
```

To list all KubeDB objects, use following command:

```bash
$ kubectl get all -n demo -o wide
NAME               READY   STATUS    RESTARTS   AGE     IP            NODE                 NOMINATED NODE   READINESS GATES
pod/mysql-demo-0   1/1     Running   0          2m17s   10.244.0.13   kind-control-plane   <none>           1/1

NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE     SELECTOR
service/mysql-demo        ClusterIP   10.107.205.135   <none>        3306/TCP   2m17s   app.kubernetes.io/instance=mysql-demo,app.kubernetes.io/managed-by=kubedb.com,app.kubernetes.io/name=mysqls.kubedb.com
service/mysql-demo-pods   ClusterIP   None             <none>        3306/TCP   2m17s   app.kubernetes.io/instance=mysql-demo,app.kubernetes.io/managed-by=kubedb.com,app.kubernetes.io/name=mysqls.kubedb.com

NAME                          READY   AGE     CONTAINERS   IMAGES
petset.apps/mysql-demo   1/1     2m17s   mysql        kubedb/mysql:9.1.0

NAME                                            TYPE               VERSION   AGE
appbinding.appcatalog.appscode.com/mysql-demo   kubedb.com/mysql   9.1.0    2m17s

NAME                          VERSION   STATUS   AGE
mysql.kubedb.com/mysql-demo   9.1.0    Ready    2m17s
```

Flag `--output=wide` is used to print additional information.

List command supports short names for each object types. You can use it like `kubectl get <short-name>`. Below are the short name for KubeDB objects:

- MySQL: `my`

To print only object name, run the following command:

```bash
$ kubectl get all -o name
mysql/mysql-demo
mysql/mysql-dev
mysql/mysql-prod
mysql/mysql-qa
```

### How to Describe Objects

`kubectl dba describe` command allows users to describe any KubeDB object. The following command will describe MySQL database `mysql-demo` with relevant information.

```bash
$ kubectl dba describe my -n demo
Name:               mysql-demo
Namespace:          demo
CreationTimestamp:  Mon, 15 Mar 2021 17:53:48 +0600
Labels:             <none>
Annotations:        kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"kubedb.com/v1","kind":"MySQL","metadata":{"annotations":{},"name":"mysql-demo","namespace":"demo"},"spec":{"storage":{"accessModes...
Replicas:           1  total
Status:             Ready
StorageType:        Durable
Volume:
  StorageClass:      standard
  Capacity:          1Gi
  Access Modes:      RWO
Paused:              false
Halted:              false
Termination Policy:  Delete

PetSet:          
  Name:               mysql-demo
  CreationTimestamp:  Mon, 15 Mar 2021 17:53:48 +0600
  Labels:               app.kubernetes.io/component=database
                        app.kubernetes.io/instance=mysql-demo
                        app.kubernetes.io/managed-by=kubedb.com
                        app.kubernetes.io/name=mysqls.kubedb.com
  Annotations:        <none>
  Replicas:           824638230984 desired | 1 total
  Pods Status:        1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:        
  Name:         mysql-demo
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=mysql-demo
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysqls.kubedb.com
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.107.205.135
  Port:         primary  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    10.244.0.13:3306

Service:        
  Name:         mysql-demo-pods
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=mysql-demo
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysqls.kubedb.com
  Annotations:  <none>
  Type:         ClusterIP
  IP:           None
  Port:         db  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    10.244.0.13:3306

Auth Secret:
  Name:         mysql-demo-auth
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=mysql-demo
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysqls.kubedb.com
  Annotations:  <none>
  Type:         kubernetes.io/basic-auth
  Data:
    password:  16 bytes
    username:  4 bytes

AppBinding:
  Metadata:
    Annotations:
      kubectl.kubernetes.io/last-applied-configuration:  {"apiVersion":"kubedb.com/v1","kind":"MySQL","metadata":{"annotations":{},"name":"mysql-demo","namespace":"demo"},"spec":{"storage":{"accessModes":["ReadWriteOnce"],"resources":{"requests":{"storage":"1Gi"}},"storageClassName":"standard"},"version":"9.1.0"}}

    Creation Timestamp:  2021-03-15T11:53:48Z
    Labels:
      app.kubernetes.io/component:   database
      app.kubernetes.io/instance:    mysql-demo
      app.kubernetes.io/managed-by:  kubedb.com
      app.kubernetes.io/name:        mysqls.kubedb.com
    Name:                            mysql-demo
    Namespace:                       demo
  Spec:
    Client Config:
      Service:
        Name:    mysql-demo
        Path:    /
        Port:    3306
        Scheme:  mysql
      URL:       tcp(mysql-demo:3306)/
    Parameters:
      API Version:  appcatalog.appscode.com/v1alpha1
      Kind:         StashAddon
      Stash:
        Addon:
          Backup Task:
            Name:  mysql-backup-9.1.0
          Restore Task:
            Name:  mysql-restore-9.1.0
    Secret:
      Name:   mysql-demo-auth
    Type:     kubedb.com/mysql
    Version:  9.1.0

Events:
  Type    Reason      Age   From             Message
  ----    ------      ----  ----             -------
  Normal  Successful  5m    KubeDB Operator  Successfully created governing service
  Normal  Successful  5m    KubeDB Operator  Successfully created service for primary/standalone
  Normal  Successful  5m    KubeDB Operator  Successfully created database auth secret
  Normal  Successful  5m    KubeDB Operator  Successfully created PetSet
```

`kubectl dba describe` command provides following basic information about a MySQL database.

- PetSet
- Storage (Persistent Volume)
- Service
- Secret (If available)
- Monitoring system (If available)

To hide events on KubeDB object, use flag `--show-events=false`

To describe all MySQL objects in `default` namespace, use following command

```bash
kubectl dba describe my
```

To describe all MySQL objects from every namespace, provide `--all-namespaces` flag.

```bash
kubectl dba describe my --all-namespaces
```

To describe all KubeDB objects from every namespace, use the following command:

```bash
kubectl dba describe all --all-namespaces
```

You can also describe KubeDB objects with matching labels. The following command will describe all MySQL objects with specified labels from every namespace.

```bash
kubectl dba describe my --all-namespaces --selector='group=dev'
```

To learn about various options of `describe` command, please visit [here](/docs/v2025.6.30/reference/cli/kubectl-dba_describe).

### How to Edit Objects

`kubectl edit` command allows users to directly edit any KubeDB object. It will open the editor defined by _KUBEDB_EDITOR_, or _EDITOR_ environment variables, or fall back to `nano`.

Lets edit an existing running MySQL object to setup database [Halted](/docs/v2025.6.30/guides/mysql/concepts/database/#spechalted). The following command will open MySQL `mysql-demo` in editor.

```bash
$ kubectl edit my -n demo mysql-quickstart

spec:
  ....
  authSecret:
    name: mysql-quickstart-auth
# add database halted = true to delete PetSet services and database other resources
  halted: true
  ....

mysql.kubedb.com/mysql-quickstart edited
```

#### Edit Restrictions

Various fields of a KubeDB object can't be edited using `edit` command. The following fields are restricted from updates for all KubeDB objects:

- apiVersion
- kind
- metadata.name
- metadata.namespace

If PetSets exists for a MySQL database, following fields can't be modified as well.

- spec.authSecret
- spec.init
- spec.storageType
- spec.storage
- spec.podTemplate.spec.nodeSelector

For DormantDatabase, `spec.origin` can't be edited using `kubectl edit`

### How to Delete Objects

`kubectl delete` command will delete an object in `default` namespace by default unless namespace is provided. The following command will delete a MySQL `mysql-dev` in default namespace

```bash
$ kubectl delete mysql mysql-dev
mysql.kubedb.com "mysql-dev" deleted
```

You can also use YAML files to delete objects. The following command will delete a mysql using the type and name specified in `mysql.yaml`.

```bash
$ kubectl delete -f mysql-demo.yaml
mysql.kubedb.com "mysql-dev" deleted
```

`kubectl delete` command also takes input from `stdin`.

```bash
cat mysql-demo.yaml | kubectl delete -f -
```

To delete database with matching labels, use `--selector` flag. The following command will delete mysql with label `mysql.app.kubernetes.io/instance=mysql-demo`.

```bash
kubectl delete mysql -l mysql.app.kubernetes.io/instance=mysql-demo
```

## Using Kubectl

You can use Kubectl with KubeDB objects like any other CRDs. Below are some common examples of using Kubectl with KubeDB objects.

```bash
# Create objects
$ kubectl create -f

# List objects
$ kubectl get mysql
$ kubectl get mysql.kubedb.com

# Delete objects
$ kubectl delete mysql <name>
```

## Next Steps

- Learn how to use KubeDB to run a MySQL database [here](/docs/v2025.6.30/guides/mysql/README).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.6.30/CONTRIBUTING).
