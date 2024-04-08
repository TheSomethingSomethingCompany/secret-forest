Application available through [this link](http://499-new-lb-420614602.ca-central-1.elb.amazonaws.com)
# AWS configuration from scratch
This tutorial document is heavily influenced by [this video](https://www.youtube.com/watch?v=esISkPlnxL0) which was used as a tutorial when deploying this app. If there is any confusion regarding the steps provided, please refer to the video as it may provide some more context.  

There are a few services that need to be set up as a pre-requisite to the deployment process as they will be used throughout.

### Pre-requisites:
1. Download the AWS CLI version greater than 2.0.0
2. Create AWS account
3. Create a Virtual Private Cloud (VPC) in AWS
   - a. Navigate to VPC from the AWS console menu
   - b. Select create VPC
   - c. Select ‘VPC and more’ for ‘Resources to create’
   - d. Ensure that there are 2 or more availability zones, 2 or more public subnets, 2 or more private subnets and 1 NAT gateway per AZ. The rest can be left as default. 
4. Set up the buckets for video and file storage + the facial blurring function. Following the steps in the following tutorial will automatically create the functions in AWS Lambda and AWS Rekognition to facilitate facial blurring as well as create the input and output buckets in Simple Storage Service (S3): [Blur Faces in Videos Automatically with Amazon Rekognition Video](https://aws.amazon.com/blogs/machine-learning/blur-faces-in-videos-automatically-with-amazon-rekognition-video/). 
   - Notes: 
     - In the step where you configure the AWS CLI, make sure that the region chosen is us-west-2, any other regions (such as ca-central-1) will not facilitate the video blurring functionality. 
     - If there is any issues with the bootstrapping or deployment, ensure that you have Python version 3.11 and in the `rekognition_video_face_blurring_cdk_stack.py` file, change all instances of `PYTHON_3_7` to `PYTHON_3_11`.
5. Create S3 access permission in AWS Identity and Access Management (IAM)

    - a. Navigate to IAM from the console menu
   
    - b. Select ‘Policies’ and then ‘Create policy’
   
    - c. Choose S3 as the service
   
    - d. In the search filter, you will need to choose 3 permissions: GetObject, DeleteObject and PutObject
   
    - e. In the resources tab, you need to specify the name or ARN of the S3 buckets that were created in step 4 along with the deployment of the facial blurring functions
      - i. Open a new tab and navigate to S3 from the console menu
      - ii. Identify the input and output buckets, they are identifiable by their name starting with ‘rekognitionvideofaceblurr-inputimagebucket’ or ‘rekognitionvideofaceblurr-outputimagebucket’ followed by other characters. *Note*: These are the bucket names that should be specified in your code as the buckets where files will be input to and where the app will retrieve from. 
      - iii. Open one of them and copy the name of the bucket at the top of the page
   
    - f. Back in the resources tab of IAM policy maker, select ‘Add ARNs’
   
    - g. Paste the bucket name into the ‘Resource bucket name’ field, then enter an asterisk (*) in the ‘Resource object name’.
   
    - h. Repeat steps e-g for the other bucket

    - i. Proceed by selecting next
   
    - j. Give the policy an identifiable name and review its properties then select ‘Create policy’
   
    - k. Once that policy has been created, it now needs to be attached to a role which will be used by the app. Navigate to the Roles page from the IAM console menu and select ‘Create role’
   
    - l. Select ‘AWS service’ as the ‘Trusted entity type’
   
    - m. For the Use case tab, select Elastic Container Service and specify the Elastic Container Service Task selection
   
    - n. On the next page you will be attaching the policy that was created in the steps prior along with another. Search for the policy name that you created in the previous steps and select its checkbox.
   
    - o. Search for the policy name `AmazonECSTaskExecutionRolePolicy` and attach it as well. This policy will need to be selected as it will be used in later steps
   
    - p. Once those 2 policies are attached to the role, proceed to the next page to name the role and create it
   

**Context:** When the app is deployed on AWS, it needs permission to access the S3 buckets. We provided this permission by the creation of policy, and then the creation of the role will allow the policy to be attached to the application at a later step.

6. Create Load balancer, Security group and Target group which will be used in later steps
   - a. Navigate to the EC2 menu from the AWS console menu then navigate to the Load balancers page and select Create load balancer 
   - b. Select application load balancer and give it an identifiable name
   - c. In Network mapping select the VPC that you created in step 3 and select the 2 public subnets associated with that VPC
   - d. In the security group tab, you will need to make a security group for the Load balancer which will give permission to certain addresses to access the load balancer’s DNS. Click on the link to ‘create a new security group’ which will redirect you to the security group creation page
       - i. Give the security group an identifiable name and select the VPC from step 3
       - ii. Create 4 inbound rules as follows (format is type, port range, source):
            1. HTTP, port 80, 0.0.0.0/0
            2. Custom TCP, port 6969, 0.0.0.0/0
            3. Custom TCP, port 7979, 0.0.0.0/0
            4. Custom TCP, port 8989, 0.0.0.0/0
       - iii. Create an outbound rule of type ‘All Traffic’ and to destination of 0.0.0.0/0
       - iv. Save the rules and navigate back to the load balancer creation page
   - e. Back at the security groups tab of the load balancer creation page, press the refresh button and select the security group you have just created. Make sure it is the only security group selected
   - f. In the Listeners and routing tab, you will need to create target groups which the load balancer will forward traffic to
       - i. Press the ‘Create target group’ link. You will need to create 4 target groups for each of the 4 ports respectively
            1. Target group 1 (port 3000): 
               - a. Health check path: /home
               - b. Select the advanced health check settings
               - c. Override the health check port
               - d. Set port to 3000
               - e. Timeout: 120 seconds
               - f. Interval: 300 seconds
               - g. Success codes: 200-299
            2. Target group 2 (port 6969): 
               - a. Health check path: /health1
               - b. Select the advanced health check settings
               - c. Override the health check port
               - d. Set port to 6969
               - e. Timeout: 120 seconds
               - f. Interval: 300 seconds
               - g. Success codes: 200-299
            3. Target group 1 (port 7979): 
               - a. Health check path: /health1
               - b. Select the advanced health check settings
               - c. Override the health check port
               - d. Set port to 6969
               - e. Timeout: 120 seconds
               - f. Interval: 300 seconds
               - g. Success codes: 200-299
            4. Target group 1 (port 8989): 
               - a. Health check path: /health1
               - b. Select the advanced health check settings
               - c. Override the health check port
               - d. Set port to 6969
               - e. Timeout: 120 seconds
               - f. Interval: 300 seconds
               - g. Success codes: 200-299
       -  *Note*: For all target groups, the target type is IP addresses, the VPC is the one created in step 3, and the remaining is left as default. Make sure to give each target group an identifiable name
   - g. Once all target groups have been created, head back to the listeners and routing tab in the load balancer creation page. 
   - h. Add 4 listeners, each listening to one of the 4 ports (3000, 6969, 7979, 8989) and select the associated target group with that port
   - i. Review the configuration of the load balancer and create it
   - j. Select the load balancer you have just created and take note of the DNS name in the details tab. This will be used to adjust the code since routing will no longer be based on localhost when in the deployed environment


This is the end of setting up the pre-requisites to set up services needed for the deployment. The following steps are directly related to the deployment of the app.

7. Modify the code slightly such that the code is set to use the newly created load balancer (the following steps are for VScode IDE, replicate the same steps if using a different IDE)
    - a. In VScode, press ctrl+shift+F to search for all instance of a term. search for `${process.env.NEXT_PUBLIC_DNS}`
    - b. Replace every instance of this variable. press ctrl+shift+H to bring up the replacement field. enter the DNS of the load balancer `http://499-new-lb-420614602.ca-central-1.elb.amazonaws.com`
    - c. in the `server.js` file, ensure that the origin trait in the `corsOption` option variable is set to be the dns of the load balancer only without the port extension of `:3000`
    - d. in the second app directory, make a new directory to store the dockerfiles. within that directory, have another 2 directories, as each will house the dockerfiles for express and next respectivley.
    - e. place the express and next dockerfiles into that directory

8. Create 2 image repositories in AWS ECR (one for Next.js and Express.js)
   - a. Navigate to ECR from the console menu
   - b. Select ‘Create repository’
   - c. Select ‘private visibility’ and assign the repository a name
   - d. Repeat steps a-c to create the second repository
   - e. Take note of the URI of the repositories as they will be used at a later step

9. In the app directory, run `aws configure sso` and follow the instructions and ensure that login is successful

10. Select one of the repositories in ECR and select ‘view push commands’ which should be followed to upload an image to the repository. Do this for both repositories. *Note*: if there is an issue with the first command (aws ecr login), make sure to specify your profile name as a variable (e.g.: --profile COSC499_CapstonePowerUserAccess-[ACCOUNT-NUMBER])

11. Create task definition for the system. A task definition is a framework or skeleton on how the system will run.
   - a. Navigate to AWS ECS from the console menu
   - b. Navigate to Task definitions within ECS console and select Create new task definition
   - c. In the task role tab, select the role that was created in step 5. Leave the default task execution role
   - d. You will need to configure 2 containers, one for Next.JS and one for Express.JS.
       - i. Paste one of the URIs into the image URI field, specify that it is an essential container and give it an identifiable name
       - ii. Set the container port to be the one specific to the image (3000 for next and 6969 for express) and name the port
       - iii. Select the Use log collection checkbox to receive console logs at a later step
       - iv. Repeat the sub-steps i-iii for the other container
   - e. All other configurations can be left as default

12. Once the task definition is created, it can be used to create the task itself.
   - a. Navigate to Clusters in the ECS and create a new cluster, ensuring that it uses the AWS Fargate infrastructure
   - b. Navigate into the cluster
   - c. Create the service that will house the tasks. A task is the instance of the system hosted on AWS
       - i. Select Create in the services tab of the cluster.
       - ii. Select Capacity provider strategy for the Compute option and FARGATE_SPOT as the capacity provider
       - iii. For the deployment configuration, ensure that the application type is a service.
       - iv. Select the task definition that was created in step 12, and assign a unique name to the service
       - v. In the networking tab, select the VPC that was created in step 3 and select the 2 public subnets within that VPC
       - vi. Open another tab in your browser and navigate to the security groups page as another will need to be created
       - vii. Set all inbound rules to be custom TCP, each for the respective ports that are used (3000, 6969, 7979, 8989) and set the source to be 0.0.0.0/0
       - viii. Return to the create service page and select the security group created in the step above
       - ix. In the load balancing tab, select application load balancer as the load balancer type
       - x. Select the Next.JS container which will be the one accepting incoming traffic
       - xi. Select ‘Use and existing load balancer’ and select the load balancer that was created in step 6.
       - xii. Select ‘Use an existing listener’ and select the 80:HTTP listener which would have been created in step 6 along with the creation of the target groups
       - xiii. Select ‘Use an existing target group’ and ensure they both reference the Next.JS listener and target group
       - xiv. Any configuration not mentioned can be kept as default

13. Final configuration to make sure the system is running
   - a. Navigate to the load balancer that is associated with this service and select ‘View load balancer’. The load balancer DNS is present on this page. This is the URL that will provide access to the application
   - b. Select the resource map tab in the load balancer page which will show the different listeners and their appropriate routing
   - c. An IP will be assigned to the target group associated with port 3000. Due to this being the only target group directly connected to the load balancer, it will be generated automatically on every launch of the task, but the other target groups will not have auto-generated IPs
   - d. Copy this IP as it will be used in the following steps of registering this IP with the other target groups
   - e. Open the 3 other target groups and select ‘register targets’ within them
   - f. Ensure that the correct VPC is chosen and enter the IP address that was copied into the appropriate field.
   - g. For the respective target group, set the port to be the same as its listener. Eg: in the express target group, set the IP and then set the port to be 6969
   - h. Select ‘Include as pending below’ then select ‘register pending targets’
   - i. Wait until the health checks pass and the IPs are all registered.

14. That are all the steps needed to configure all necessary services to deploy the application. Enter the DNS of the load balancer into a browser to reach the application. Note that it may be sluggish/laggy at the start as it requires the rendering of every page.


## System Maintenance

Steps to update the system if you have access to our AWS accounts and don’t need to fully configure everything

1.	Upon any updates to the code, a new build of the images will be necessary then to be pushed to ECR. Follow steps 10 and 11 for the upload of new images to ECR
2.	Navigate to task definition in the ECS console, select the task definition and create a new revision. This will refresh the task definition to use the latest images from ECR
3.	Navigate to the cluster that houses the service and select that service. In the service page, select update service and check the ‘Force new deployment’ option at the top of the page. This will stop the currently-running task and launch a new one using the updated task definition. This will also deregister the IP that is currently in use which will be addressed in the next step
4.	Navigate to the load balancer page and select the resource map tab. You will notice that the target group for port 3000 will be forwarding to the new IP. Perform step 14 to register the new IP in relation to the target groups. An additional step is to also deregister the old IP for each target group which will now be unreachable. 
5.	Wait for all the health checks to pass and the IP addresses to register before accessing the application once more through the load balancer DNS. 
