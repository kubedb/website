---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: account-management-kubernetes-creds
    name: Credentials
    parent: account-management-kubernetes
    weight: 20
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Kubernetes Credentials Management

In order to integrate a vendor-managed Kubernetes cluster into our system, you can either opt o `Create` a new cluster or `Import` an existing one. This process involves adding specific credentials based on your vendor. 

Supported Credential Types include: 
- [AWS](#aws)
- [Azure](#azure)
- [Azure Storage](#azure-storage)
- [Cloudflare R2 Storage](#cloudflare-r2-storage)
- [Digital Ocean](#digital-ocean)
- [Google Cloud](#google-cloud)
- [Google OAuth](#google-oauth)
- [Hetzner](#hetzner)
- [Linode](#linode)
- [Rancher](#rancher)
- [Scaleway](#scaleway)
- [Vultr](#vultr)

Visit https://appscode.com/id/{user}/user/settings/credentials to manage credential.


## AWS

To create or import EKS clusters to [Platform Console](https://console.appscode.com/), you need to create a access-key with the following policies.
- AmazonEC2FullAccess (AWS Managed Policy)
- AWSCloudFormationFullAccess (AWS Managed Policy)
- EKSAllAccess
- IamLimitedAccess

Steps:
- Create user
- Create required policies
- Attach the policies to the user
- Create access key

Details:
- Create user
    ```sh
    aws iam create-user --user-name "eks-cluster"
    ```
- Create policies
    - Export AWS Account ID
        ```sh
        export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
        ```
    - Create `AmazonEC2FullAccess (AWS Managed Policy)` policy
        ```sh
        echo '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "ec2:*",
                    "Effect": "Allow",
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": "elasticloadbalancing:*",
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": "cloudwatch:*",
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": "autoscaling:*",
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": "iam:CreateServiceLinkedRole",
                    "Resource": "*",
                    "Condition": {
                        "StringEquals": {
                            "iam:AWSServiceName": [
                                "autoscaling.amazonaws.com",
                                "ec2scheduled.amazonaws.com",
                                "elasticloadbalancing.amazonaws.com",
                                "spot.amazonaws.com",
                                "spotfleet.amazonaws.com",
                                "transitgateway.amazonaws.com"
                            ]
                        }
                    }
                }
            ]
        }' > ec2-policy.json
        ```
        ```sh
        aws iam create-policy --policy-name ec2-policy --policy-document file://ec2-policy.json

        POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`ec2-policy`].Arn' --output text)
        aws iam attach-user-policy --user-name "eks-cluster" --policy-arn $POLICY_ARN
        ```
    - Create `AWSCloudFormationFullAccess (AWS Managed Policy)` policy
        <!-- ::: details Write policy to file -->
        ```sh
        echo '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "cloudformation:*"
                    ],
                    "Resource": "*"
                }
            ]
        }' > cloudformation-policy.json
        ```
        <!-- ::: -->
        ```sh
        aws iam create-policy --policy-name cloudformation-policy --policy-document file://cloudformation-policy.json

        POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`cloudformation-policy`].Arn' --output text)
        aws iam attach-user-policy --user-name "eks-cluster" --policy-arn $POLICY_ARN
        ```
    - Create `EKSAllAccess` policy
         ```sh
        echo '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "eks:*",
                    "Resource": "*"
                },
                {
                    "Action": [
                        "ssm:GetParameter",
                        "ssm:GetParameters"
                    ],
                    "Resource": [
                        "arn:aws:ssm:*:${AWS_ACCOUNT_ID}:parameter/aws/*",
                        "arn:aws:ssm:*::parameter/aws/*"
                    ],
                    "Effect": "Allow"
                },
                {
                    "Action": [
                    "kms:CreateGrant",
                    "kms:DescribeKey"
                    ],
                    "Resource": "*",
                    "Effect": "Allow"
                },
                {
                    "Action": [
                    "logs:PutRetentionPolicy"
                    ],
                    "Resource": "*",
                    "Effect": "Allow"
                }
            ]
        }' > eks-policy-template.json

        envsubst < eks-policy-template.json > eks-policy.json
        ```
        ```sh
        aws iam create-policy --policy-name eks-policy --policy-document file://eks-policy.json

        POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`eks-policy`].Arn' --output text)
        aws iam attach-user-policy --user-name "eks-cluster" --policy-arn $POLICY_ARN
        ```
    - Create `IamLimitedAccess` policy
        ```sh
        echo '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "iam:CreateInstanceProfile",
                        "iam:DeleteInstanceProfile",
                        "iam:GetInstanceProfile",
                        "iam:RemoveRoleFromInstanceProfile",
                        "iam:GetRole",
                        "iam:CreateRole",
                        "iam:DeleteRole",
                        "iam:AttachRolePolicy",
                        "iam:PutRolePolicy",
                        "iam:AddRoleToInstanceProfile",
                        "iam:ListInstanceProfilesForRole",
                        "iam:PassRole",
                        "iam:DetachRolePolicy",
                        "iam:DeleteRolePolicy",
                        "iam:GetRolePolicy",
                        "iam:GetOpenIDConnectProvider",
                        "iam:CreateOpenIDConnectProvider",
                        "iam:DeleteOpenIDConnectProvider",
                        "iam:TagOpenIDConnectProvider",
                        "iam:ListAttachedRolePolicies",
                        "iam:TagRole",
                        "iam:GetPolicy",
                        "iam:CreatePolicy",
                        "iam:DeletePolicy",
                        "iam:ListPolicyVersions"
                    ],
                    "Resource": [
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:instance-profile/eksctl-*",
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/eksctl-*",
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:policy/eksctl-*",
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/*",
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/aws-service-role/eks-nodegroup.amazonaws.com/AWSServiceRoleForAmazonEKSNodegroup",
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/eksctl-managed-*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "iam:GetRole"
                    ],
                    "Resource": [
                        "arn:aws:iam::${AWS_ACCOUNT_ID}:role/*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "iam:CreateServiceLinkedRole"
                    ],
                    "Resource": "*",
                    "Condition": {
                        "StringEquals": {
                            "iam:AWSServiceName": [
                                "eks.amazonaws.com",
                                "eks-nodegroup.amazonaws.com",
                                "eks-fargate.amazonaws.com"
                            ]
                        }
                    }
                }
            ]
        }' > iam-policy-template.json

        envsubst < iam-policy-template.json > iam-policy.json
        ```
        ```sh
        aws iam create-policy --policy-name iam-policy --policy-document file://iam-policy.json

        POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`iam-policy`].Arn' --output text)
        aws iam attach-user-policy --user-name "eks-cluster" --policy-arn $POLICY_ARN
        ```
- Create Access Token for the user
    ```sh
    aws iam create-access-key --user-name "eks-cluster"
    ```

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create) you got from previous step.

![Aws Cred](../images/aws-cred.png)

<!-- ![Add AWS Credential](../images/aws-cred.png) -->

## Azure

To configure Azure credentials for accessing and managing Azure Kubernetes Service (AKS) clusters, follow these steps using the Azure CLI:
- Set the Azure subscription ID using the following command.
    ```sh
    export AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    ```
- Create Azure Service Principal with `Contributor` role.
    ```sh
    az ad sp create-for-rbac --role Contributor --scopes="/subscriptions/${AZURE_SUBSCRIPTION_ID}" --sdk-auth
    ```
- Save Credentials <br>
The command will output a JSON response containing the service principal details, including clientId (Application ID), clientSecret (Client Secret), subscriptionId, tenantId, and other information. Save these credentials securely as they will be used to configure the AKS cluster.

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).


![Do Cred](../images/do-cred.png)

## Digital Ocean
To access Digital Ocean Managed clusters, you need to create a API token from Digital Ocean.

Ref: [How to Create a Personal Access Token](https://docs.digitalocean.com/reference/api/create-personal-access-token/)


Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create) you got from Digital Ocean.

<br><br><br><br>

## Google Cloud

To access GKE clusters, you need to create a GCP service account with with container.admin role.

- Set Project id, service account name
    ```sh
    # Set the project ID where you registered your Domain
    PROJECT_ID="myproject-id" # change it to your project id
    GKE_SA_NAME="gke-cluster" # change it to your desired sa name
    GKE_SA_EMAIL="$GKE_SA_NAME@${PROJECT_ID}.iam.gserviceaccount.com"
    ```
- Create Service account and Assign permission
    ```sh
    gcloud iam service-accounts create $GKE_SA_NAME --display-name $GKE_SA_NAME

    # assign google service account to dns.admin role in cloud-dns project
    gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$GKE_SA_EMAIL --role "roles/container.admin"
    ```
- Create a Service Account Secret
    ```sh
    # download static credentials
    gcloud iam service-accounts keys create $GKE_SA_NAME-credentials.json \
    --iam-account $GKE_SA_EMAIL
    ```

Then add the service account credentials [here](https://appscode.com/id/{user}/user/settings/credentials/create).

![Gcp Oauth](../images/gcp-oauth.png)

## Google OAuth

Simplest way to access GKE clusters is through creating `Google OAuth` type credential. <br>
Just head over [here](https://appscode.com/id/{user}/user/settings/credentials/create) and
- Choose a `Name`
- Select Credential Type: `Google OAuth`
- Click `Continue with Google`


This will create a credential, you will be able to access your k8s cluster with.

<br><br><br>

![Linode Cred](../images/linode-cred.png)

## Linode

To access LKE clusters, you need to create a API token from Linode with the following permissions.
- Kubernetes (Read/Write)

Ref: [Manage Linode Personal Access Tokens](https://www.linode.com/docs/products/tools/api/guides/manage-api-tokens/)


Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create) you got from Linode.

<br><br><br>

![Rancher Cred](../images/rancher-cred.png)

## Rancher

To access Rancher clusters through KubeDB Platform, you need to create an API token in your Rancher system. Follow these steps:

1. In Rancher, click on the profile icon.
2. Select `Account & API Keys`.
3. Click `Create API Key`.
4. Provide a name and set the expiration for the API key.
5. Click `Create` to complete the API token creation.

Reference: [Rancher API Keys](https://ranchermanager.docs.rancher.com/reference-guides/user-settings/api-keys)

Copy the generated access key, secret key, and API endpoint from the `Account & API Keys` overview page.

Next, add these credentials to the [KubeDB Platform user settings credentials page](https://appscode.com/id/{user}/user/settings/credentials/create).

![Azure Storage](../../images/credentials/azureStorage.png)

## Azure Storage

To access Azure Blob Storage, you need your Storage Account name and one of its access keys.

- **Account:** Your Storage Account name, found in the Azure Portal under **Storage accounts**.
- **Key:** One of the access keys (key1 or key2), found under **Security + networking > Access keys** in the storage account sidebar. Click **Show** to reveal the key value.

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).

<br><br><br><br>

![Cloudflare Storage](../../images/credentials/cloudflareStorage.png)

## Cloudflare R2 Storage

To access Cloudflare R2 Object Storage, you need your Account ID and an R2 API token.

- **Account ID:** Found on your Cloudflare Dashboard under **R2 > Overview** or in the sidebar.
- **Access Key ID & Secret Access Key:** Generated by creating an R2 API token. Navigate to **R2 > Manage R2 API Tokens > Create API Token** and ensure the token has `Edit` permissions for the target bucket.

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).

<br><br><br><br>

![Hetzner](../../images/credentials/Hetzner.png)

## Hetzner

To access Hetzner Cloud resources, you need an API token and an SSH key.

- **SSH Key Name:** The name of an existing SSH key registered in your Hetzner Cloud project.
- **Token:** A Hetzner Cloud API token. Generate one under **Security > API Tokens** in your Hetzner Cloud Console. Use `Read & Write` permissions.

Ref: [Hetzner Cloud API Tokens](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/)

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).

<br><br><br>

![Scaleway](../../images/credentials/Scaleway.png)

## Scaleway

To access Scaleway resources, you need your Organization ID and an API secret key.

- **Organization:** Your Scaleway Organization ID (a UUID), found under **Organization Settings** in the Scaleway Console.
- **Token:** Your API Secret Key. Navigate to **Identity and Access Management (IAM) > API Keys**, create a new API key, and copy the **Secret Key**.

Ref: [Scaleway API Keys](https://www.scaleway.com/en/docs/iam/how-to/create-api-keys/)

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).

<br><br><br>

![Vultr](../../images/credentials/vultr.png)

## Vultr

To access Vultr resources, you need a Vultr API key.

- **Token:** Your Vultr API key. Navigate to **Account > API** in the Vultr customer portal and generate a personal access token.

Ref: [Vultr API](https://www.vultr.com/api/)

Then add the credential [here](https://appscode.com/id/{user}/user/settings/credentials/create).
