---
title: How to Deploy Postgres via Kubernetes PostgreSQL Operator 01111
date: "2023-02-01"
weight: 20
authors:
- Raihan Khan
tags:
- clustering
- kafka
- kraft
- kubedb
- kubernetes
- provisioner
- publisher
- subscriber
---

## Summary

AppsCode held a webinar on **“How to Deploy Postgres via Kubernetes PostgreSQL Operator”** on 25th January 2023. The contents discussed on the webinar:
- Apache Kafka and how it works
- Kafka's new Kraft mode and why it's better
- Provision Apache Kafka with KubeDB
- Kafka clustering
- Create, publish, and consume event from kafka

## Description of the Webinar

It is required to install the followings to get started:
- KubeDB Provisioner 
- KubeDB Ops-Manager

The webinar started with a brief discussion about Apache Kafka, Kafka's new Kraft mode, why Kafka is better without Zookeeper. Then, The process of provisioning Kafka in Kraft mode using KubeDB was discussed.

Later, the demo starts with provisioning Kafka in combined mode on Kubernetes using KubeDB. It was shown how to deploy Kafka on Kubernetes using a simple CRD manifest and without Zookeeper dependency. After that, Kafka topology clustering was discussed in details. Finally, The webinar ended with a hands-on demo showing how to secure KubeDB managed Kafka with TLS. 

  Take a deep dive into the full webinar below:

<iframe style="height: 500px; width: 800px" src="https://www.youtube.com/embed/guITL-l47Fk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## What Next?

Please try the latest release and give us your valuable feedback.

* If you want to install **KubeDB**, please follow the installation instruction from [here](https://kubedb.com/docs).
* Find the sample yamls from webinar [here](https://github.com/kubedb/project/tree/master/demo/kafka).


## Support

To speak with us, please leave a message on [our website](https://appscode.com/contact/).

To receive product announcements, follow us on [Twitter](https://twitter.com/kubedb).

If you have found a bug with KubeDB or want to request new features, please [file an issue](https://github.com/kubedb/project/issues/new).