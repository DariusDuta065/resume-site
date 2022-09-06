# Infrastructure

The infrastructure required for this project is fully-automated via [CDK](https://aws.amazon.com/cdk/).

## Basic commands

- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
- `cdk deploy`      deploy this stack to your default AWS account/region
- `cdk diff`        compare deployed stack with current state
- `cdk synth`       emits the synthesized CloudFormation template

## Provisioned resources

The following AWS resources have been automated:

- **Route53** Hosted Zone
- **ACM** certificate
  - with automatic DNS validation
- **S3** bucket & configuration
- **CloudFront** distribution & configuration
- **Lambda** functions that invalidates CloudFront
- **CodeBuild** project
- **CodePipeline** pipeline
- **Secrets Manager** secrets
- **SSM Parameter Store** parameters

This allows me to run `cdk deploy` and have everything ready to go within 5 minutes.

## CI/CD pipeline

**CodePipeline** takes care of every new commit on the `master` branch - it generates the files, uploads them to S3, and calls a Lambda function that invalidates the CloudFront cache.

<p align="center">
  <img title="CodePipeline stages" style="max-height: 800px; width:auto;" src="assets/code_pipeline_screenshot.png">
</p>

---

## Deployment steps

### **1 —** Secrets

- Generate [GitHub OAuth Token](https://github.com/settings/tokens) with `repo` scope
- Create a Secret in Secret Manager (eg `dariusduta.dev`)
  - Store the token within the secret JSON (key `github-oauth-token`)
  - Store a secret value that will be used to restrict S3 website access to CloudFront only via the Referer header (key `secret-header-value`)

  ```bash
  aws secretsmanager put-secret-value --secret-id "dariusduta.dev" --region eu-west-2 \
    --secret-string '{"github-oauth-token":"ghp_SKsd2x0ZI9FCR...","secret-header-value":"RD6o3..."}'
  ```

### **2 —** DNS

- **Deploy `Route53Stack`** (`cdk deploy Route53Stack`)
  - provisions a Route53 hosted zone
- Update nameservers on Gandi.net to match those on the Route53 Hosted Zone
  - unfortunately Route53 domain registrar doesn't support `.dev` domains at the moment
  - so this step has to be done manually each time the Hosted Zone is destroyed/created

### **3 —** ACM certificate

- Check that nameservers have propagated eg using `dig dariusduta.dev NS +short`
- **Deploy `AcmStack`** (`cdk deploy AcmStack`)
- Wait for ACM certificate to be created as part of `AcmStack`

### **4 —** CloudFront & S3

- Clear the context cache (`cdk context --clear`)
- **Deploy `WebsiteStack`** (`cdk deploy WebsiteStack`)
- **Build Hugo project** & upload `/public` files to S3
  - `yarn deploy`

### **5 —** CodePipeline CI/CD

- **Deploy `CodePipelineStack`** (`cdk deploy CodePipelineStack`)
