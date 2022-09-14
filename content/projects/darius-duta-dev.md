---
title: "dariusduta.dev"
author: "Darius Duta"
date: "2022-09-09"
tags: ["project"]
description: My personal website
dataFile: dariusdutadev

math: true
showMeta: true
showToc: true
showBreadCrumbs: true
showReadingTime: true
showWordCount: true
showScrollToTop: true
showMetaInList: false

showAuthor: false
showDate: true
contentWidthClass: "max-w-4xl"
---

I built this website to share more about myself online and the side projects I’ve been working on; it also helps me keep track of my progress throughout my career.  
Another objective of mine is to become a better writer and a better communicator, especially when having to communicate technical concepts in simple words.

<!--more-->

{{< github link="https://github.com/dduta065/resume-site" title="Source code" >}}

{{< tech_stack >}}

## Requirements

The non-functional requirements for this website were easy to establish, especially after looking at several other personal websites:

- Quick to build
- Great performance
- Uncomplicated maintenance
- Cheap to run
- Simple to automate & deploy

A static site generator that generates a fully-static website is the perfect fit on this occasion. Static site generators reduce complexity by storing all content pages in [Markdown](https://www.markdownguide.org/basic-syntax/) format. This means that the content can be tracked and managed by using version control software (like `git`), instead of requiring a database to store the content.

Because the site is static, no web servers, load balancers, or other hardware is needed. Instead, a content delivery network can be used to scale the traffic and serve it worldwide with amazing performance and cost savings.

There are many static site generators available today that are mature and ready for production. They include Jekyll, Gatsby, Hugo, Next.js, and Eleventy, just to mention a few.

## Hugo

I chose [Hugo](https://gohugo.io) for this small project because it was recommended to me by a friend.

<!-- I have already tried `go` and I found it simple enough to grasp the fundamentals and differences from other languages — the way packages work, error handling, and the concurrency model with _goroutines_ based on message-passing and _channels_ for communication. -->

Maintainability is straightforward with Hugo; working with a couple of markdown files is enough to update or add new content to the website.

Performance is unbeatable when it comes to hosting a static website on the cloud today; all generated files are either HTML or other types of assets (images, web fonts, CSS, JS), and putting everything behind a CDN such as CloudFront makes everything load instantly regardless of the user’s location.

This also gives another advantage in terms of cost performance and savings. Hosting this Hugo static website costs almost nothing, because of the massive economies at scale of AWS and the consumption model.

With minimal effort put into configuring CloudFront’s caching behaviour, I was able to achieve the maximum score on Google’s Lighthouse test on both desktop & mobile categories.

{{< figure src="images/lighthouse_test_results.png" title="Lighthouse test results" align="center" >}}

## Infrastructure

The AWS resources are provisioned through [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/), which is a new framework built by AWS and released in 2019. CDK is awesome because it allows us to use programming languages to define AWS infrastructure and the output of it is just a CloudFormation template.

In my opinion, CDK makes authoring CloudFormation templates much more straightforward, because it allows you to make use of the typing system of a programming language, in my case TypeScript. This saves me a lot of time, since I don't have to consult the online documentation for the CloudFormation resources I need to provision.

<!-- CDK Constructs are the basic build blocks that represent AWS resources. A CDK Stack can contain one or more Constructs. The `cdk synth Stack` command shows the equivalent CloudFormation template file for the CDK Stack. This is very helpful, especially when migrating existing CloudFormation files into CDK.  
Constructs are categorised into multiple layers.

Layer three (**L3**) [CDK Constructs](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html), also called _patterns_, are very helpful and are meant to increase the developer productivity, by composing several L2 Constructs and offering sane configuration defaults. -->

### CDK example

The following CDK code is enough to request a new ACM certificate for a domain and automatically validate its ownership through the Route53 DNS service.  
The resulting certificate's ARN is stored in SSM Parameter Store, so it can be used by stacks that deploy in different AWS Regions.

Those ~20 lines of CDK synthesize into a CloudFormation template that contains over 100 lines of YAML:

```typescript
export class AcmStack extends cdk.Stack {
  public readonly acmParam: ssm.StringParameter;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const acmCert = new cert.DnsValidatedCertificate(
      this, 
      "InfraCertificate", {
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      region: "us-east-1",
    });

    this.acmParam = new ssm.StringParameter(
      this, 
      "AcmCertificateParameter", {
      parameterName: props.acmCertParameterName,
      stringValue: `${acmCert.certificateArn}`,
    });
  }
}
```

The `DnsValidatedCertificate` construct deploys a separate Lambda function that will begin the process of requesting a new TLS certificate from AWS ACM.  
The Lambda function will add the required DNS records into the provided Route53 Hosted Zone. Then, the function will keep checking every 30 seconds whether the DNS validation has succedeed, and only then signal the completion of the resource.

<!-- ### CDK limitations

Two main issues:

- SSM Secret does not get updated
  - CDK compiles down to CloudFormation
  - There's currently no way as of yet for CloudFormation to know that the value of a Secrets Manager secret has changed in the meantime.
  - The new value of the secret is not reflected when CloudFormation computes the change sets; from its point of view, nothing has changed and the CloudFormation template is still the same.
  - Solution is to add an environment variable or something that gets generated automatically and changes on every deployment, such that CloudFormation will recognise there's an update to the resources and redeploy them.
- Cross-region stack import
  - CloudFront only accepting ACM certificates issued in the `us-east-1` region
  - The rest of the stacks being deployed in `eu-west-2`, means that the stacks need to communicate to pass the `AcmCertificateARN` - which is needed to enable HTTPS support on CloudFront.
  - This communication is achieved by using a custom resource that implements a custom AWS API call to retrieve the value of a parameter from SSM Parameter Store. -->

## CodePipeline

### Connecting to GitHub

There are two ways of connecting CodePipeline to GitHub; the first one involves the AWS console, in which you have to complete the OAuth flow and sign into GitHub, so that you can grant the *AWS Connector for GitHub* access to your GitHub repositories.

The second method involves using the CDK construct `GitHubSourceAction` [(docs)](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codepipeline_actions.GitHubSourceAction.html).  
For that to work, a [GitHub personal access token](https://dev.to/mmoanis/how-to-connect-github-to-aws-codepipelines-2l0h) must be generated and stored within a secret in AWS Secrets Manager. This access token is then supplied to GitHubSourceAction as the `oauthToken`.

I chose to use a GitHub access token, because it can be automated more easily and involves no further modifications to the CDK code.

In addition to that, a Lambda function can be used to automate the refresh of the GitHub access token and store its new value back into Secrets Manager.

### CI/CD Pipeline

This was the first time I used CDK to automate a CodePipeline. For static site generators, the deployment process is simple and is usually more or less made of these 3 stages:

- **Source** stage
  - Runs on every new commit on a specific `git` branch
  - Code is downloaded from the GitHub repository
- **Build** stage
  - Uses CodeBuild and following the instructions from `buildspec.yml`, calls Hugo to generate the files
  - Uploads the generated HTML files to the target S3 Bucket
- **Deploy** stage
  - Calls a custom Lambda function that invalidates the CloudFront cache
  - After the invalidation, CloudFront will request & cache the newly-uploaded files from S3

## Conclusion

For my use case, I think Hugo is a good choice. The total cost, including the domain, works out at around $2 per month; for that, I get reliable and performant cloud hosting through Amazon CloudFront and the AWS network.

There is very little maintenance required; the TLS certificate renews itself automatically through AWS ACM, content is kept in Markdown files and CodePipeline deploys every time updates are committed to GitHub.

A good setup for the years to come. :smile:
