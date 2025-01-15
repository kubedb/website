---
title: Deploy Cassandra using Kubernetes Cassandra Operator
Description: Get started with your containerized Cassandra deployment. Learn how to deploy Cassandra database effortlessly using Kubernetes Cassandra Operator.
alt: Cassandra Operator
date: "2025-01-15"
---

# Deploy Cassandra using Kubernetes Cassandra Operator

![Kubernetes Cassandra Operator](./hero.jpg "Cassandra Operator")

In today’s cloud-first era, the need for highly-available, scalable databases is more critical than ever. Kubernetes is the industry-standard container orchestration platform, renowned for efficiently managing containerized applications. While it simplifies deployment and scaling for stateless applications, deploying stateful services such as databases requires additional tooling. **Kubernetes Cassandra Operator** — a tool that streamlines the intricate tasks of configuring, and managing Cassandra databases within the Kubernetes environment.

In this article, we will have an overview of the Cassandra database setup by using the KubeDB cassandra operator. We will also explore the benefits and features of KubeDB Cassandra while running it in Kubernetes environment.

## Why Cassandra in Kubernetes
Kubernetes is an open-source platform designed for container orchestration. It offers a standardized approach to automating container deployment, managing their lifecycle, and ensuring availability and reliability. Kubernetes has emerged as the preferred solution for organizations aiming to build scalable, resilient, and efficient cloud-native applications.

Apache Cassandra is a highly scalable and distributed NoSQL database. It was designed to handle large amounts of data across multiple nodes. It is popular for its high availability, fault tolerance and no single point of failure.

By combining Cassandra's scalability and fault tolerance with Kubernetes' orchestration capabilities, Cassandra in Kubernetes allows for smooth deployment, scaling, and management. Kubernetes ensures high availability and portability across environments by automating resource allocation, monitoring, and self-healing. It is perfect for contemporary, distributed applications since it incorporates Cassandra into the cloud-native ecosystem and supports tools for monitoring, backups, and CI/CD.

## Deploy Cassandra on Kubernetes
### Pre-requisites
We have to configure the environment to deploy Cassandra on Kubernetes using a Kubernetes Cassandra operator. This tutorial requires you to have a functional Kubernetes cluster in place and a basic grasp of Cassandra concepts. Here, we are going to create our kubernetes cluster using [Kind](https://kubernetes.io/docs/tasks/tools/#kind). Also, you’ll require to install [Helm](https://helm.sh/docs/intro/install/) to your Kubernetes cluster.

In this article, We will use the Kubernetes Cassandra operator [KubeDB](https://kubedb.com/) to deploy Cassandra on Kubernetes. But before we start, you need to make sure you have KubeDB already installed in your Kubernetes setup. To use KubeDB, you'll also need a license, which you can get for free from the [Appscode License Server](https://license-issuer.appscode.com/). To get this license, you'll need the Kubernetes cluster ID. You can find this ID by running the command we'll provide below.

 
```bash
$ kubectl get ns kube-system -o jsonpath='{.metadata.uid}'
e5b4a1a0-5a67-4657-b390-db7200108bae
```

The license server will email us with a "license.txt" file attached after we provide the necessary data. To install KubeDB, run the following commands,

```bash
$ helm install kubedb oci://ghcr.io/appscode-charts/kubedb \
  --version v2025.1.9 \
  --namespace kubedb --create-namespace \
  --set-file global.license=/path/to/the/license.txt \
  --wait --burst-limit=10000 --debug \
  --set global.featureGates.cassandra=true
```


Verify the installation by the following command,

```bash
$ kubectl get pods --all-namespaces -l "app.kubernetes.io/instance=kubedb"
NAMESPACE   NAME                                            READY   STATUS    RESTARTS   AGE
kubedb      kubedb-kubedb-autoscaler-7d98f45f84-fhttj       1/1     Running   0          37m
kubedb      kubedb-kubedb-ops-manager-64bdc96d99-85bhz      1/1     Running   0          37m
kubedb      kubedb-kubedb-provisioner-c765ffcd5-5pzxc       1/1     Running   0          37m
kubedb      kubedb-kubedb-webhook-server-7b97d994f8-m8lxw   1/1     Running   0          37m
kubedb      kubedb-petset-operator-6b5fddcd9-wl2cp          1/1     Running   0          37m
kubedb      kubedb-petset-webhook-server-59ff65f4fd-tg52g   2/2     Running   0          37m
kubedb      kubedb-sidekick-f8674fc4f-qkwtr                 1/1     Running   0          37m
``` 
We can go on to the next stage if every pod status is running.

### Create a Namespace
Now we'll create a new namespace in which we will deploy Cassandra. To create a namespace, we can use the following command:

```bash
$ kubectl create namespace cassandra-demo
namespace/cassandra-demo created
``` 

### Deploy Cassandra via Kubernetes Cassandra operator
We need to create a yaml configuration to deploy Cassandra database on Kubernetes. And we will apply this yaml below,

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Cassandra
metadata:
  name: cassandra-quickstart
  namespace: cassandra-demo
spec:
  version: 5.0.0
  topology:
    rack:
      - name: myrack
        replicas: 2
        storageType: Ephemeral
        storage:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 1Gi
        podTemplate:
          spec:
            containers:
              - name: cassandra
                resources:
                  limits:
                    memory: 4Gi
                    cpu: 4
                  requests:
                    cpu: 1
                    memory: 1Gi
  deletionPolicy: WipeOut
```

We will save this yaml configuration to `cassandra.yaml`. Then create the above Cassandra object.

```bash
$ kubectl create -f cassandra.yaml
Cassandra.kubedb.com/cassandra-quickstart created
```

If all the above steps are handled correctly and the Cassandra is deployed, you will see that the following objects are created:

```bash
$ kubectl get all -n cassandra-demo
NAME                     READY   STATUS    RESTARTS   AGE
pod/cassandra-quickstart-0   1/1     Running   0          4m51s

NAME                            TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
service/cassandra-quickstart        ClusterIP   10.96.70.253   <none>        9042/TCP   4m51s
service/cassandra-quickstart-pods   ClusterIP   None           <none>        9042/TCP   4m51s

NAME                                                  TYPE                   VERSION   AGE
appbinding.appcatalog.appscode.com/cassandra-quickstart   kubedb.com/Cassandra   1.6.22    4m51s

NAME                                    VERSION   STATUS   AGE
cassandra.kubedb.com/cassandra-quickstart   1.6.22    Ready    4m51s

```

We have successfully deployed Cassandra to Kubernetes via the Kubernetes Cassandra operator. Now, we will connect to the Cassandra database to insert some sample data and verify whether our Cassandra database is usable or not. First, check the database status,

```bash
$ kubectl get Cassandra -n cassandra-demo
NAME               VERSION   STATUS   AGE
cassandra-quickstart   1.6.22    Ready    5m46s
```

Here, we should have to obtain necessary credentials in order to connect to the database. Let’s export the credentials as environment variable to our current shell. KubeDB will create Secret and Service for the database `cassandra-cluster` that we have deployed. Let’s check them,

```bash
$ kubectl get secret -n cassandra-demo -l=app.kubernetes.io/instance=cassandra-quickstart
NAME                      TYPE     DATA   AGE
cassandra-quickstart-config   Opaque   1      8m1s

$ kubectl get service -n cassandra-demo -l=app.kubernetes.io/instance=cassandra-quickstart
NAME                    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
cassandra-quickstart        ClusterIP   10.96.70.253   <none>        9042/TCP   8m58s
cassandra-quickstart-pods   ClusterIP   None           <none>        9042/TCP   8m58s
```
### Accessing Database Through CLI

To access your database through the CLI, you first need the credentials for the database. KubeDB will create several Kubernetes Secrets and Services for your Cassandra Server instance. To view them, use the following commands:

```bash
$ kubectl get secret -n cassandra-demo -l=app.kubernetes.io/instance=cassandra-quickstart 
NAME                                 TYPE                       DATA   AGE
cassandra-quickstart-auth            kubernetes.io/basic-auth   2      8m31s
cassandra-quickstart-config          Opaque                     1      8m31s


$ kubectl get service -n cassandra-demo -l=app.kubernetes.io/instance=cassandra-quickstart 
NAME                               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
cassandra-quickstart             ClusterIP   10.128.113.192   <none>        9042/TCP   8m37s
cassandra-quickstart-pods        ClusterIP   None             <none>        9042/TCP   8m37s
```

From the above list, the `cassandra-quickstart-auth` Secret contains the admin-level credentials needed to connect to the database. Use the following commands to obtain the username and password:

```bash
$ kubectl get secret -n demo cassandra-quickstart-auth  -o jsonpath='{.data.username}' | base64 -d
admin
$ kubectl get secret -n demo cassandra-quickstart-auth  -o jsonpath='{.data.password}' | base64 -d
dS57E93oLDi6wezv
```

### Insert sample data to the Cassandra database
In this section, we are going to login into our Cassandra database pod and insert some sample data.
First, we have to connect to this database using cqlsh. A command-line utility called cqlsh is used to communicate with Apache Cassandra through the Cassandra Query Language (CQL).

```bash
$ kubectl get pods -n cassandra-demo
NAME                             READY   STATUS    RESTARTS   AGE
cassandra-quickstart-rack-r0-0   1/1     Running   0          13m

# We will connect to `cassandra-quickstart-0` pod using cqlsh.
$ kubectl exec -it -n cassandra-demo cassandra-quickstart-0 -- cqlsh -u admin -p "dS57E93oLDi6wezv"

Connected to Test Cluster at 127.0.0.1:9042
[cqlsh 6.2.0 | Cassandra 5.0.2 | CQL spec 3.4.7 | Native protocol v5]
Use HELP for help.
cqlsh> 
# We have connected to cqlsh. Now we will create a keyspace named `kubedb` and within this `kubedb` keyspace, we will create a table named `users` and insert data into it.
cqlsh> CREATE KEYSPACE kubedb  WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
cqlsh> USE kubedb;
cqlsh:kubedb> CREATE TABLE users (
          ... id UUID PRIMARY KEY,
          ... name TEXT 
          ... );
cqlsh:kubedb> INSERT INTO users (id, name, email) VALUES (uuid(), 'cassandra');

# Now to see the contents of `users` table, we will use another query, and the output will be like below- 
cqlsh:kubedb> select * from users;
 id                                   | name
--------------------------------------+-----------
 0e87779a-ca9c-4007-b281-a975a6991f9f | cassandra

```
We’ve successfully deployed Cassandra to Kubernetes via **Kubernetes Cassandra operator** which is managed by KubeDB and insert some sample data into it.

## Cassandra on Kubernetes: Best Practices
Implementing Cassandra on Kubernetes with the Kubernetes Cassandra Operator requires following best practices. These practices ensure your application's reliability and stability. To optimize your Cassandra deployment within a Kubernetes environment, adhere to these essential recommendations.

* **Version Compatibility:** Ensure that the Cassandra version you have decided to use is compatible with the Kubernetes version you are currently using, especially when deploying with the Kubernetes Cassandra Operator. Planning and rigorous testing are crucial, as compatibility issues can lead to unexpected behavior. For version upgrades, rolling upgrades can be used to minimize disruptions.

* **Monitoring and Health Checks:** Configure your Cassandra pods for monitoring and health checks.Monitor key metrics such as query performance, CPU utilization, disk I/O, and memory consumption. Use tools like Prometheus and Grafana to visualize performance data and identify any potential bottlenecks or issues early. Proactively implement alerting mechanisms to get notified of anomalies before they impact system performance or availability. Kubernetes provides features for monitoring, whereas Cassandra delivers useful performance indicators. You can proactively find and then fix performance bottlenecks or problems by gathering and evaluating these metrics, guaranteeing peak Cassandra performance.

* **Disaster Recovery Strategies:** Create resilient disaster recovery strategies for Cassandra to address data corruption, pod failures, and potential cluster-wide outages. By establishing clear, effective recovery plans, you can reduce downtime as well as safeguard data integrity, ensuring continuity even in adverse conditions.


## Conclusion

Cassandra an open-source and widely used data storage known for its scalability and high availability, especially in case of handling large amounts of data efficiently. By following the above process, you can successfully deploy a Cassandra database on Kubernetes, by utilizing the Kubernetes Cassandra Operator managed by KubeDB. Effective database maintenance, whether on-premises or in the cloud, requires skills as well as consistent procedures. KubeDB offers a robust set of support tools for ensuring your database management meets great performance and availability standards. Whether your database infrastructure is hosted locally, spans multiple regions, or is built on cloud-based or database-as-a-service platforms, KubeDB streamlines and enhances the entire process in a production-grade environment.
