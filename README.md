# reservation-tracker-rest-api

### CI/CD
#### Serverless Framework CI/CD
##### AWS Providers
AWS Accounts where resources will be deployed. In our example, we have 2 AWS accounts for `Dev` and `Prod`.
We link each AWS account to our Serverless account as providers.

![AWS Providers](./readme_utils/cicd_aws_providers.png)

##### Serverless Apps
Allows us to group common services for an application.
Stages or Deployment Profiles can be configured for a service. Each can be mapped to a provider.
In our example, `prod` and `dev` stages are created and will serve as our environments.

![Serverless Apps](./readme_utils/apps_page.png)

##### Github Configuration
Configure Github Connection and Repository to be managed by Serverless CI/CD.
![Github](./readme_utils/cicd_git_config.png)

##### Build and Deploy Service
This is where we configure which Stage/Environment a branch needs to be deployed to.
![Build and Deploy](./readme_utils/cicd_build_deploy_config.png)