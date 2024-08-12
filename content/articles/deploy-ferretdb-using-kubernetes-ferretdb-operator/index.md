---
title: Deploy FerretDB using Kubernetes FerretDB Operator
Description: Simplify your deployment process with Kubernetes FerretDB Operator. Learn how to deploy FerretDB on Kubernetes for optimal performance effortlessly.
date: "2024-07-18"
---

# Deploy FerretDB using Kubernetes FerretDB Operator

![Kubernetes FerretDB](./hero.jpg "Kubernetes FerretDB")

The combination of containerization and databases has reshaped application development landscapes. Kubernetes, the industry-standard container orchestration platform, has become essential for deploying and managing scalable applications. Integrating databases into Kubernetes environments, especially NoSQL solutions like MongoDB, often presents unique challenges related to data persistence, scalability, and high availability.

FerretDB, an open-source alternative to MongoDB, bridges these challenges by using PostgreSQL as its storage backend. This architecture leverages the robustness and reliability of PostgreSQL while providing a MongoDB-compatible API, offering a simpler and more versatile deployment model. This article explores how to integrate FerretDB into Kubernetes environments using the **Kubernetes FerretDB** Operator. We will dive into the benefits of deploying FerretDB on Kubernetes, discuss effective deployment strategies, and provide best practices for optimizing performance and reliability. Through this comprehensive guide, you will gain insights into leveraging the combined strengths of FerretDB and PostgreSQL to build highly available and scalable NoSQL applications on Kubernetes.

## Benefits of FerretDB in Kubernetes

FerretDB, a MongoDB wire protocol compatible database that uses PostgreSQL as its storage backend, offers several advantages when integrated into Kubernetes environments. This unique combination of features provides a robust and scalable solution for managing NoSQL data within containerized applications. By using FerretDB, you can leverage familiar MongoDB APIs while benefiting from PostgreSQL's ACID compliance, strong consistency, and advanced query capabilities.

In Kubernetes, FerretDB can be easily scaled horizontally to accommodate increasing workloads. Deploying multiple FerretDB instances as Kubernetes StatefulSets allows you to distribute data across nodes and ensure high availability. Additionally, FerretDB's integration with PostgreSQL's replication mechanisms enhances data redundancy and fault tolerance, making your data management more resilient.

FerretDB optimizes resource utilization by using PostgreSQL's efficient storage and query optimization techniques. Running FerretDB on Kubernetes enables you to take advantage of cost-saving features like autoscaling and spot instances, ensuring that your resources are used effectively. The integration of FerretDB with Kubernetes also simplifies database management tasks, you can utilize Kubernetes-native tools and practices to deploy, scale, and manage FerretDB instances, reducing operational overhead.

By combining the strengths of MongoDB and PostgreSQL, FerretDB provides a compelling solution for managing NoSQL data in Kubernetes environments. Its compatibility, scalability, reliability, and ease of management make it an excellent choice for modern cloud-native applications.

## Deploying FerretDB on Kubernetes

### Pre-requisites

Before deploying FerretDB on Kubernetes using the Kubernetes FerretDB Operator, you need to ensure your environment is properly set up. First, you must have a functional Kubernetes cluster. In this guide, we’ll create our cluster using [Kind](https://kubernetes.io/docs/tasks/tools/#kind). Additionally, you should have a basic understanding of FerretDB and PostgreSQL, as this will help you navigate the deployment process more effectively.

Next, make sure that [Helm](https://helm.sh/docs/intro/install/) is installed on your Kubernetes cluster, as it is necessary for managing packages. This guide utilizes the Kubernetes FerretDB operator [KubeDB](https://kubedb.com/), so you’ll need to have KubeDB installed in your Kubernetes environment. To use KubeDB, you’ll also require a license, which you can obtain for free from the [Appscode License Server](https://appscode.com/issue-license/).

To get your KubeDB license, you’ll need the Kubernetes cluster ID. You can retrieve the cluster ID by running the following command:


```bash
$ kubectl get ns kube-system -o jsonpath='{.metadata.uid}'
5dt336705-0cku-4de8-b62f-2e7ec34c379d
```

After providing the required information, we will receive an email from the license server including a `license.txt` file. To install KubeDB, use the following helm commands.

```bash
$ helm install kubedb oci://ghcr.io/appscode-charts/kubedb \
  --version v2024.6.4 \
  --namespace kubedb --create-namespace \
  --set-file global.license=/path/to/the/license.txt \
  --set global.featureGates.FerretDB=true \
  --wait --burst-limit=10000 --debug
```

Verify the KubeDB installation by the following command,

```bash
$ kubectl get pods --all-namespaces -l "app.kubernetes.io/instance=kubedb"
NAMESPACE   NAME                                            READY   STATUS    RESTARTS      AGE
kubedb      kubedb-kubedb-autoscaler-75cf766448-qjlhc       1/1     Running   0             2m47s
kubedb      kubedb-kubedb-ops-manager-7c4b676b49-qxgp8      1/1     Running   0             2m47s
kubedb      kubedb-kubedb-provisioner-73675bd9f4-vz9t9      1/1     Running   0             2m47s
kubedb      kubedb-kubedb-webhook-server-549cfbb687-xdrz9   1/1     Running   0             2m47s
kubedb      kubedb-petset-operator-5d94e6ddb8-tpck5         1/1     Running   0             2m47s
kubedb      kubedb-petset-webhook-server-8647ce4464-fvsg2   2/2     Running   0             2m47s
kubedb      kubedb-sidekick-5d9947bd9-wgded                 1/1     Running   0             2m47s
```

If all of the pod status is running, we can move to the next step.

## Create a Namespace

We will now create a new namespace and deploy FerretDB. The following command can be used to create a namespace:

```bash
$ kubectl create namespace ferretdemo
namespace/ferretdemo created
```

## Deploy FerretDB using Kubernetes FerretDB operator

Here is the yaml of the FerretDB CR we are going to use:

```yaml
apiVersion: kubedb.com/v1alpha2
kind: FerretDB
metadata:
  name: ferret
  namespace: ferretdemo
spec:
  version: "1.18.0"
  storageType: Durable
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  backend:
    externallyManaged: false
  deletionPolicy: WipeOut
```

You can see the detailed yaml specifications in the [Kubernetes FerretDB documentation.](https://kubedb.com/docs/latest/guides/ferretdb/)

Let’s save this yaml configuration into `ferret.yaml`. Then create the above FerretDB CR,

```bash
$ kubectl apply -f ferret.yaml
ferretdb.kubedb.com/ferret created
```
Once these are handled correctly and the FerretDB object is deployed, you will see that the following objects are created:

```bash
$ kubectl get all -n ferretdemo
NAME                              READY   STATUS    RESTARTS   AGE
pod/ferret-0                      1/1     Running   0          23s
pod/ferret-pg-backend-0           2/2     Running   0          91s
pod/ferret-pg-backend-1           2/2     Running   0          47s
pod/ferret-pg-backend-arbiter-0   1/1     Running   0          34s

NAME                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
service/ferret                      ClusterIP   10.96.39.167    <none>        27017/TCP                    95s
service/ferret-pg-backend           ClusterIP   10.96.119.129   <none>        5432/TCP,2379/TCP            95s
service/ferret-pg-backend-pods      ClusterIP   None            <none>        5432/TCP,2380/TCP,2379/TCP   95s
service/ferret-pg-backend-standby   ClusterIP   10.96.140.224   <none>        5432/TCP                     95s

NAME                                         READY   AGE
statefulset.apps/ferret-pg-backend           2/2     91s
statefulset.apps/ferret-pg-backend-arbiter   1/1     34s

NAME                                                   TYPE                  VERSION   AGE
appbinding.appcatalog.appscode.com/ferret              kubedb.com/ferretdb   1.18.0    23s
appbinding.appcatalog.appscode.com/ferret-pg-backend   kubedb.com/postgres   13.13     91s

NAME                                    VERSION   STATUS   AGE
postgres.kubedb.com/ferret-pg-backend   13.13     Ready    95s
```

We have successfully deployed FerretDB to Kubernetes using the Kubernetes FerretDB operator. First, check the status of the `ferretdb` to determine if it is ready.

```bash
$ kubectl get ferretdb -n ferretdemo ferret
NAME     NAMESPACE         VERSION   STATUS   AGE
ferret   ferretdemo        1.18.0    Ready    117s
```

### Connect with FerretDB

We will use [port forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to connect with FerretDB.

#### Port-forward the Service

KubeDB will create few Services to connect with the database. Let’s check the Services by following command,

```bash
$ kubectl get service -n ferretdemo | grep ferret
ferret                      ClusterIP   10.96.39.167    <none>        27017/TCP                    2m31s
ferret-pg-backend           ClusterIP   10.96.119.129   <none>        5432/TCP,2379/TCP            2m31s
ferret-pg-backend-pods      ClusterIP   None            <none>        5432/TCP,2380/TCP,2379/TCP   2m31s
ferret-pg-backend-standby   ClusterIP   10.96.140.224   <none>        5432/TCP                     2m31s
```
Here, we are going to use Service named `ferret`. Now, let’s port-forward the `ferret` Service to the local machine’s port `27017`.

```bash
$ kubectl port-forward -n ferretdemo svc/ferret 27017
Forwarding from 127.0.0.1:27017 -> 27017
Forwarding from [::1]:27017 -> 27017
```

#### Access the Credentials

KubeDB also create Secret for the ferret instance. Let’s check by following command,

```bash
$ kubectl get secret -n ferretdemo | grep ferret
ferret-pg-backend-auth   kubernetes.io/basic-auth   2      2m53s
```

Now, we are going to use `ferret-pg-backend-auth` to get the credentials.

```bash
$ kubectl get secrets -n ferretdemo ferret-pg-backend-auth -o jsonpath='{.data.username}' | base64 -d
postgres

$ kubectl get secrets -n ferretdemo ferret-pg-backend-auth -o jsonpath='{.data.password}' | base64 -d
6QWXX*d8FcuGf95S
```

### Insert Sample Data

In this section, we will to log in via [MongoDB Shell](https://www.mongodb.com/try/download/shell) and insert some sample data.

```bash
$ mongosh 'mongodb://postgres:6QWXX*d8FcuGf95S@localhost:27017/ferretdb?authMechanism=PLAIN'
Current Mongosh Log ID:	666ae3d956fa285b80a26a12
Connecting to:		mongodb://<credentials>@localhost:27017/ferretdb?authMechanism=PLAIN&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6
Using MongoDB:		7.0.42
Using Mongosh:		2.2.6

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-06-10T12:19:37.648Z: Powered by FerretDB v1.18.0 and PostgreSQL 13.13 on x86_64-pc-linux-musl, compiled by gcc.
   2024-06-10T12:19:37.648Z: Please star us on GitHub: https://github.com/FerretDB/FerretDB.
   2024-06-10T12:19:37.648Z: The telemetry state is undecided.
   2024-06-10T12:19:37.648Z: Read more about FerretDB telemetry and how to opt out at https://beacon.ferretdb.io.
------

ferretdb> show dbs
kubedb_system  80.00 KiB


ferretdb> use musicdb
switched to db musicdb

musicdb> db.music.insertOne({"Avicii": "The Nights"})
{
  acknowledged: true,
  insertedId: ObjectId('666ae4b156fa285b80a26a15')
}

musicdb> db.music.insertOne({"Bon Jovi": "It's My Life"})
{
  acknowledged: true,
  insertedId: ObjectId('666ae4b956fa285b80a26a16')
}

musicdb> db.music.find()
[
  { _id: ObjectId('666ae4b156fa285b80a26a15'), Avicii: 'The Nights' },
  {
    _id: ObjectId('666ae4b956fa285b80a26a16'),
    'Bon Jovi': "It's My Life"
  }
]

musicdb> show dbs
kubedb_system  80.00 KiB
musicdb        80.00 KiB

musicdb> exit
```

> Here, we’ve stored some sample data in our `ferret-pg-backend` PostgreSQL using `mongosh`.

### Verify Data in PostgreSQL Backend Engine

Now, We are going to exec into the PostgreSQL pod to verify if the data has been stored successfully.

```bash
$ kubectl exec -it -n ferretdemo ferret-pg-backend-0 -- bash
Defaulted container "postgres" out of: postgres, pg-coordinator, postgres-init-container (init)
ferret-pg-backend-0:/$ psql
psql (13.13)
Type "help" for help.

postgres=# \l
                                   List of databases
     Name      |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
---------------+----------+----------+------------+------------+-----------------------
 ferretdb      | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 kubedb_system | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 postgres      | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 template0     | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
 template1     | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
(5 rows)

postgres=# \c ferretdb
You are now connected to database "ferretdb" as user "postgres".

ferretdb=# \dn
     List of schemas
     Name      |  Owner   
---------------+----------
 kubedb_system | postgres
 musicdb       | postgres
 public        | postgres
(3 rows)

ferretdb=# SET search_path TO musicdb;
SET

ferretdb=# \dt
                    List of relations
 Schema  |            Name             | Type  |  Owner   
---------+-----------------------------+-------+----------
 musicdb | _ferretdb_database_metadata | table | postgres
 musicdb | music_9f9c4fd4              | table | postgres
(2 rows)

ferretdb=# SELECT * FROM music_9f9c4fd4;
                                                                              _jsonb                                                                              
------------------------------------------------------------------------------------------------------------------------------------------------------------------
 {"$s": {"p": {"_id": {"t": "objectId"}, "Avicii": {"t": "string"}}, "$k": ["_id", "Avicii"]}, "_id": "666ae4b156fa285b80a26a15", "Avicii": "The Nights"}
 {"$s": {"p": {"_id": {"t": "objectId"}, "Bon Jovi": {"t": "string"}}, "$k": ["_id", "Bon Jovi"]}, "_id": "666ae4b956fa285b80a26a16", "Bon Jovi": "It's My Life"}
(2 rows)

ferretdb=# exit
```

We’ve successfully deployed FerretDB to Kubernetes using the **Kubernetes FerretDB Operator** from KubeDB. Additionally, we inserted sample data and verified it using the PostgreSQL backend.

## FerretDB on Kubernetes: Best Practices

To optimize FerretDB performance and reliability in a Kubernetes environment, consider the following best practices:

- **Optimize Resource:** Ensure efficient resource allocation by defining appropriate resource requests and limits for FerretDB pods. Leverage Kubernetes' Horizontal Pod Autoscaler (HPA) to dynamically adjust the number of FerretDB replicas based on workload fluctuations. For large datasets, consider data sharding to distribute data across multiple instances, enhancing performance and scalability.

- **Data Persistence:** Utilize Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) to guarantee data persistence across pod restarts. Implement a robust backup strategy to protect your data from loss, and consider using Kubernetes tools like CronJobs to automate backups and ensure data integrity.

- **Index Management:** Create and maintain appropriate indexes to improve query performance. Regularly analyze query patterns and index usage to identify opportunities for optimization and avoid unnecessary overhead.

- **Monitoring and Logging:** Continuously monitor FerretDB performance metrics and logs to identify potential issues and optimize performance. Use Kubernetes-native monitoring tools like Prometheus and Grafana to track resource utilization and application health, ensuring your FerretDB instances run smoothly.

- **Utilizing the Kubernetes FerretDB Operator:** Utilize the Kubernetes FerretDB Operator to streamline FerretDB deployment and management. The Operator automates administrative tasks such as configuration, scaling, and updates, allowing database administrators to focus on optimizing performance without manual intervention.

## Conclusion

In conclusion, FerretDB presents a powerful and flexible solution for integrating MongoDB-compatible applications within Kubernetes environments. By leveraging PostgreSQL as its storage backend, FerretDB combines the strengths of both SQL and NoSQL paradigms, offering robust data management, high availability, and scalability. The FerretDB Operator, facilitated by KubeDB, simplifies the deployment process, enabling seamless integration and efficient management of your FerretDB instances on Kubernetes. This guide has provided you with the essential knowledge to deploy FerretDB on Kubernetes using the FerretDB Operator from KubeDB. For further exploration and advanced configurations, the official [FerretDB documentation](https://docs.ferretdb.io/) offers comprehensive insights. Remember, optimizing your database environment requires continuous monitoring, tuning, and following best practices specific to FerretDB and PostgreSQL. Whether your database infrastructure is on-premises, geographically dispersed, or utilizes cloud services and database-as-a-service providers, KubeDB services can further assist in ensuring that your FerretDB deployments achieve peak performance and operational excellence.