---
title: MySQL Group Replcation Guide
menu:
  docs_v2020.10.27-rc.1:
    identifier: my-group-replication-guide-mysql
    name: MySQL Group Replication Guide
    parent: my-clustering-mysql
    weight: 20
menu_name: docs_v2020.10.27-rc.1
section_menu_id: guides
info:
  cli: v0.14.0-rc.1
  community: v0.14.0-rc.1
  enterprise: v0.1.0-rc.1
  installer: v0.14.0-rc.1
  version: v2020.10.27-rc.1
---

> New to KubeDB? Please start [here](/docs/v2020.10.27-rc.1/README).

# KubeDB - MySQL Group Replication

This tutorial will show you how to use KubeDB to provision a MySQL replication group in single-primary mode.

## Before You Begin

Before proceeding:

- Read [mysql group replication concept](/docs/v2020.10.27-rc.1/guides/mysql/clustering/overview) to learn about MySQL Group Replication.

- You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2020.10.27-rc.1/setup/README).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: The yaml files used in this tutorial are stored in [docs/examples/mysql](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/mysql) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Deploy MySQL Cluster

To deploy a single primary MySQL replication group , specify `spec.topology` field in `MySQL` CRD.

The following is an example `MySQL` object which creates a MySQL group with three members (one is primary member and the two others are secondary members).

```yaml
apiVersion: kubedb.com/v1alpha2
kind: MySQL
metadata:
  name: my-group
  namespace: demo
spec:
  version: "8.0.21"
  replicas: 3
  topology:
    mode: GroupReplication
    group:
      name: "dc002fc3-c412-4d18-b1d4-66c1fbfbbc9b"
      baseServerID: 100
  storageType: Durable
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  terminationPolicy: WipeOut
```

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/mysql/clustering/demo-1.yaml
mysql.kubedb.com/my-group created
```

Here,

- `spec.topology` tells about the clustering configuration for MySQL.
- `spec.topology.mode` specifies the mode for MySQL cluster. Here we have used `GroupReplication` to tell the operator that we want to deploy a MySQL replication group.
- `spec.topology.group` contains group replication info.
- `spec.topology.group.name` the name for the group. It is a valid version 4 UUID.
- `spec.topology.group.baseServerID` the id of primary member.
- `spec.storage` specifies the StorageClass of PVC dynamically allocated to store data for this database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. So, each members will have a pod of this storage configuration. You can specify any StorageClass available in your cluster with appropriate resource requests.

KubeDB operator watches for `MySQL` objects using Kubernetes API. When a `MySQL` object is created, KubeDB operator will create a new StatefulSet and a Service with the matching MySQL object name. KubeDB operator will also create a governing service for the StatefulSet with the name `<mysql-object-name>-gvr`.

```bash
$ kubectl dba describe my -n demo my-group
Name:               my-group
Namespace:          demo
CreationTimestamp:  Tue, 25 Aug 2020 16:42:10 +0600
Labels:             <none>
Annotations:        kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"kubedb.com/v1alpha2","kind":"MySQL","metadata":{"annotations":{},"name":"my-group","namespace":"demo"},"spec":{"replicas":3,"storage":{"...
Replicas:           3  total
Status:             Running
StorageType:        Durable
Volume:
  StorageClass:      standard
  Capacity:          1Gi
  Access Modes:      RWO
Halted:              false
Halted:              false
Termination Policy:  WipeOut

StatefulSet:          
  Name:               my-group
  CreationTimestamp:  Tue, 25 Aug 2020 16:42:10 +0600
  Labels:               app.kubernetes.io/component=database
                        app.kubernetes.io/instance=my-group
                        app.kubernetes.io/managed-by=kubedb.com
                        app.kubernetes.io/name=mysql
                        app.kubernetes.io/version=8.0.21
                        kubedb.com/kind=MySQL
                        kubedb.com/name=my-group
  Annotations:        <none>
  Replicas:           824638237768 desired | 3 total
  Pods Status:        3 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:        
  Name:         my-group
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=my-group
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysql
                  app.kubernetes.io/version=8.0.21
                  kubedb.com/kind=MySQL
                  kubedb.com/name=my-group
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.109.225.127
  Port:         db  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    10.244.1.4:3306,10.244.1.6:3306,10.244.2.4:3306

Service:        
  Name:         my-group-gvr
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=my-group
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysql
                  app.kubernetes.io/version=8.0.21
                  kubedb.com/kind=MySQL
                  kubedb.com/name=my-group
  Annotations:    service.alpha.kubernetes.io/tolerate-unready-endpoints=true
  Type:         ClusterIP
  IP:           None
  Port:         db  3306/TCP
  TargetPort:   3306/TCP
  Endpoints:    10.244.1.4:3306,10.244.1.6:3306,10.244.2.4:3306

Service:        
  Name:         my-group-primary
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=my-group
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysql
                  app.kubernetes.io/version=8.0.21
                  kubedb.com/kind=MySQL
                  kubedb.com/name=my-group
  Annotations:  <none>
  Type:         ClusterIP
  IP:           10.111.57.60
  Port:         db  3306/TCP
  TargetPort:   db/TCP
  Endpoints:    10.244.2.4:3306

Database Secret:
  Name:         my-group-auth
  Labels:         app.kubernetes.io/component=database
                  app.kubernetes.io/instance=my-group
                  app.kubernetes.io/managed-by=kubedb.com
                  app.kubernetes.io/name=mysql
                  app.kubernetes.io/version=8.0.21
                  kubedb.com/kind=MySQL
                  kubedb.com/name=my-group
  Annotations:  <none>
  Type:         Opaque
  Data:
    password:  16 bytes
    username:  4 bytes

AppBinding:
  Metadata:
    Annotations:
      kubectl.kubernetes.io/last-applied-configuration:  {"apiVersion":"kubedb.com/v1alpha2","kind":"MySQL","metadata":{"annotations":{},"name":"my-group","namespace":"demo"},"spec":{"replicas":3,"storage":{"accessModes":["ReadWriteOnce"],"resources":{"requests":{"storage":"1Gi"}},"storageClassName":"standard"},"storageType":"Durable","terminationPolicy":"WipeOut","topology":{"group":{"baseServerID":100,"name":"dc002fc3-c412-4d18-b1d4-66c1fbfbbc9b"},"mode":"GroupReplication"},"version":"8.0.21"}}

    Creation Timestamp:  2020-08-25T10:50:59Z
    Labels:
      app.kubernetes.io/component:   database
      app.kubernetes.io/instance:    my-group
      app.kubernetes.io/managed-by:  kubedb.com
      app.kubernetes.io/name:        mysql
      app.kubernetes.io/version:     8.0.21
      kubedb.com/kind:               MySQL
      kubedb.com/name:               my-group
    Name:                            my-group
    Namespace:                       demo
  Spec:
    Client Config:
      Service:
        Name:    my-group
        Path:    /
        Port:    3306
        Scheme:  mysql
      URL:       tcp(my-group:3306)/
    Secret:
      Name:   my-group-auth
    Type:     kubedb.com/mysql
    Version:  8.0.21

Events:
  Type    Reason      Age   From            Message
  ----    ------      ----  ----            -------
  Normal  Successful  12m   MySQL operator  Successfully created Service
  Normal  Successful  12m   MySQL operator  Successfully created primary service
  Normal  Successful  4m    MySQL operator  Successfully created StatefulSet
  Normal  Successful  4m    MySQL operator  Successfully created MySQL
  Normal  Successful  4m    MySQL operator  Successfully created appbinding


$ kubectl get statefulset -n demo
NAME       READY   AGE
my-group   3/3     49m

$ kubectl get pvc -n demo
NAME              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-my-group-0   Bound    pvc-ea20656d-6809-11e9-89c6-080027fc7fb2   1Gi        RWO            standard       49m
data-my-group-1   Bound    pvc-4a2d43b0-680a-11e9-89c6-080027fc7fb2   1Gi        RWO            standard       47m
data-my-group-2   Bound    pvc-60558ef0-680a-11e9-89c6-080027fc7fb2   1Gi        RWO            standard       46m

$ kubectl get pv -n demo
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                  STORAGECLASS   REASON   AGE
pvc-4a2d43b0-680a-11e9-89c6-080027fc7fb2   1Gi        RWO            Delete           Bound    demo/data-my-group-1   standard                56m
pvc-60558ef0-680a-11e9-89c6-080027fc7fb2   1Gi        RWO            Delete           Bound    demo/data-my-group-2   standard                55m
pvc-ea20656d-6809-11e9-89c6-080027fc7fb2   1Gi        RWO            Delete           Bound    demo/data-my-group-0   standard                59m

$ kubectl get service -n demo
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
my-group           ClusterIP   10.109.225.127   <none>        3306/TCP   17m
my-group-gvr       ClusterIP   None             <none>        3306/TCP   17m
my-group-primary   ClusterIP   10.111.57.60     <none>        3306/TCP   17m
```

KubeDB operator sets the `status.phase` to `Running` once the database is successfully created. Run the following command to see the modified `MySQL` object:

```yaml
$ kubectl get  my -n demo my-group -o yaml
apiVersion: kubedb.com/v1alpha2
kind: MySQL
metadata:
  creationTimestamp: "2019-04-26T09:59:00Z"
  finalizers:
  - kubedb.com
  generation: 2
  name: my-group
  namespace: demo
  resourceVersion: "1311"
  selfLink: /apis/kubedb.com/v1alpha2/namespaces/demo/mysqls/my-group
  uid: e9f3e216-6809-11e9-89c6-080027fc7fb2
spec:
  authSecret:
    name: my-group-auth
  podTemplate:
    controller: {}
    metadata: {}
    spec:
      resources: {}
  replicas: 3
  serviceTemplate:
    metadata: {}
    spec: {}
  storage:
    accessModes:
    - ReadWriteOnce
    dataSource: null
    resources:
      requests:
        storage: 1Gi
    storageClassName: standard
  storageType: Durable
  terminationPolicy: WipeOut
  topology:
    group:
      baseServerID: 100
      name: dc002fc3-c412-4d18-b1d4-66c1fbfbbc9b
    mode: GroupReplication
  version: 5.7.25
status:
  observedGeneration: 2$4213139756412538772
  phase: Running
```

## Connect with MySQL database

KubeDB operator has created a new Secret called `my-group-auth` **(format: {mysql-object-name}-auth)** for storing the password for `mysql` superuser. This secret contains a `username` key which contains the **username** for MySQL superuser and a `password` key which contains the **password** for MySQL superuser.

If you want to use an existing secret please specify that when creating the MySQL object using `spec.authSecret.name`. While creating this secret manually, make sure the secret contains these two keys containing data `username` and `password` and also make sure of using `root` as value of `username`. For more details see [here](/docs/v2020.10.27-rc.1/guides/mysql/concepts/mysql#specdatabasesecret).

Now, you can connect to this database from your terminal using the `mysql` user and password.

```bash
$ kubectl get secrets -n demo my-group-auth -o jsonpath='{.data.\username}' | base64 -d
root

$ kubectl get secrets -n demo my-group-auth -o jsonpath='{.data.\password}' | base64 -d
dlNiQpjULZvEqo3B
```

The operator creates a group according to the newly created `MySQL` object. This group has 3 members (one primary and two secondary).

You can connect to any of these group members. In that case you just need to specify the host name of that member Pod (either PodIP or the fully-qualified-domain-name for that Pod using the governing service named `<mysql-object-name>-gvr`) by `--host` flag.

```bash
# first list the mysql pods list
$ kubectl get pods -n demo -l kubedb.com/name=my-group
NAME         READY   STATUS    RESTARTS   AGE
my-group-0   2/2     Running   1          19m
my-group-1   2/2     Running   0          15m
my-group-2   2/2     Running   1          12m


# get the governing service
$ kubectl get service my-group-gvr -n demo
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
my-group-gvr   ClusterIP   None         <none>        3306/TCP   137m

# list the pods with PodIP
$ kubectl get pods -n demo -l kubedb.com/name=my-group -o jsonpath='{range.items[*]}{.metadata.name} ........... {.status.podIP} ............ {.metadata.name}.my-group-gvr.{.metadata.namespace}{"\\n"}{end}'
my-group-0 ........... 172.17.0.5 ............ my-group-0.my-group-gvr.demo
my-group-1 ........... 172.17.0.6 ............ my-group-1.my-group-gvr.demo
my-group-2 ........... 172.17.0.7 ............ my-group-2.my-group-gvr.demo
```

Now you can connect to these database using the above info. Ignore the warning message. It is happening for using password in the command.

```bash
# connect to the 1st server
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "select 1;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+---+
| 1 |
+---+
| 1 |
+---+

# connect to the 2nd server
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-1.my-group-gvr.demo -e "select 1;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+---+
| 1 |
+---+
| 1 |
+---+

# connect to the 3rd server
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-2.my-group-gvr.demo -e "select 1;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+---+
| 1 |
+---+
| 1 |
+---+
```

## Check the Group Status

Now, you are ready to check newly created group status. Connect and run the following commands from any of the hosts and you will get the same results.

```bash
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "show status like '%primary%'"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------------------------------+--------------------------------------+
| Variable_name                    | Value                                |
+----------------------------------+--------------------------------------+
| group_replication_primary_member | fc4a4935-e6bf-11ea-bf42-9a7560d22b8f |
+----------------------------------+--------------------------------------+
```

The value **37ed2c72-680a-11e9-8ac3-0242ac110005** in the above table means the ID of the primary member of the group.

```bash
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=MpPhZ9xbVlxvoC4d --host=my-group-0.my-group-gvr.demo -e "select * from performance_schema.replication_group_members"
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+-------------+----------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST                  | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION |
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+-------------+----------------+
| group_replication_applier | 768c83e2-e6c0-11ea-bfa5-5a3f7e8f0c23 | my-group-1.my-group-gvr.demo |        3306 | ONLINE       | SECONDARY   | 8.0.21         |
| group_replication_applier | 9ea36443-e6c0-11ea-b4d9-beec0709d261 | my-group-2.my-group-gvr.demo |        3306 | ONLINE       | SECONDARY   | 8.0.21         |
| group_replication_applier | fc4a4935-e6bf-11ea-bf42-9a7560d22b8f | my-group-0.my-group-gvr.demo |        3306 | ONLINE       | PRIMARY     | 8.0.21         |
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+-------------+----------------+
```

## Data Availability

In a MySQL group, only the primary member can write not the secondary. But you can read data from any member. In this tutorial, we will insert data from primary, and we will see whether we can get the data from any other members.

> Read the comment written for the following commands. They contain the instructions and explanations of the commands.

```bash
# create a database on primary
$ kubectl exec -it -n demo my-group-0 -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "CREATE DATABASE playground;"
mysql: [Warning] Using a password on the command line interface can be insecure.

# create a table
$ kubectl exec -it -n demo my-group-0 -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "CREATE TABLE playground.equipment ( id INT NOT NULL AUTO_INCREMENT, type VARCHAR(50), quant INT, color VARCHAR(25), PRIMARY KEY(id));"
mysql: [Warning] Using a password on the command line interface can be insecure.


# insert a row
$  kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "INSERT INTO playground.equipment (type, quant, color) VALUES ('slide', 2, 'blue');"
mysql: [Warning] Using a password on the command line interface can be insecure.

# read from primary
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+

# read from secondary-1
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-1.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+

# read from secondary-2
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-2.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+
```

## Write on Secondary Should Fail

Only, primary member preserves the write permission. No secondary can write data.

```bash
# try to write on secondary-1
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-1.my-group-gvr.demo -e "INSERT INTO playground.equipment (type, quant, color) VALUES ('mango', 5, 'yellow');"
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1290 (HY000) at line 1: The MySQL server is running with the --super-read-only option so it cannot execute this statement
command terminated with exit code 1

# try to write on secondary-2
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-2.my-group-gvr.demo -e "INSERT INTO playground.equipment (type, quant, color) VALUES ('mango', 5, 'yellow');"
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1290 (HY000) at line 1: The MySQL server is running with the --super-read-only option so it cannot execute this statement
command terminated with exit code 1
```

## Automatic Failover

To test automatic failover, we will force the primary Pod to restart. Since the primary member (`Pod`) becomes unavailable, the rest of the members will elect a new primary for these group. When the old primary comes back, it will join the group as a secondary member.

> Read the comment written for the following commands. They contain the instructions and explanations of the commands.

```bash
# delete the primary Pod my-group-0
$ kubectl delete pod my-group-0 -n demo
pod "my-group-0" deleted

# check the new primary ID
kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "show status like '%primary%'"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----------------------------------+--------------------------------------+
| Variable_name                    | Value                                |
+----------------------------------+--------------------------------------+
| group_replication_primary_member | 4c97e5a4-680a-11e9-9f6b-0242ac110006 |
+----------------------------------+--------------------------------------+

# now check the gruop status
kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "select * from performance_schema.replication_group_members"
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST                  | MEMBER_PORT | MEMBER_STATE |
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+
| group_replication_applier | 37ed2c72-680a-11e9-8ac3-0242ac110005 | my-group-0.my-group-gvr.demo |        3306 | ONLINE       |
| group_replication_applier | 4c97e5a4-680a-11e9-9f6b-0242ac110006 | my-group-1.my-group-gvr.demo |        3306 | ONLINE       |
| group_replication_applier | 625714bc-680a-11e9-9e94-0242ac110007 | my-group-2.my-group-gvr.demo |        3306 | ONLINE       |
+---------------------------+--------------------------------------+------------------------------+-------------+--------------+

# read data from new primary my-group-1.my-group-gvr.demo
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-1.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+

# read data from secondary-1 my-group-0.my-group-gvr.demo
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-0.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+

# read data from secondary-2 my-group-2.my-group-gvr.demo
$ kubectl exec -it -n demo my-group-0 -c mysql -- mysql -u root --password=dlNiQpjULZvEqo3B --host=my-group-2.my-group-gvr.demo -e "SELECT * FROM playground.equipment;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------+-------+-------+
| id | type  | quant | color |
+----+-------+-------+-------+
|  7 | slide |     2 | blue  |
+----+-------+-------+-------+
```

## Cleaning up

Clean what you created in this tutorial.

```bash
kubectl delete -n demo my/my-group
kubectl delete ns demo
```

## Next Steps

- Detail concepts of [MySQL object](/docs/v2020.10.27-rc.1/guides/mysql/concepts/mysql).
- Detail concepts of [MySQLDBVersion object](/docs/v2020.10.27-rc.1/guides/mysql/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2020.10.27-rc.1/CONTRIBUTING).
