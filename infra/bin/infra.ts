#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";

import params from "./config";

import { AcmStack } from "../lib/acm-stack";
import { Route53Stack } from "../lib/route-stack";
import { WebsiteStack } from "../lib/website-stack";
import { CodePipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

const routeStack = new Route53Stack(app, "Route53Stack", {
  domainName: params.DOMAIN_NAME,

  terminationProtection: true,
  stackName: `${params.STACK_PREFIX}-Route53`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

const acmStack = new AcmStack(app, "AcmStack", {
  domainName: params.DOMAIN_NAME,
  hostedZone: routeStack.hostedZone,
  acmCertParameterName: params.ACM_CERT_SSM_PARAM,

  terminationProtection: true,
  stackName: `${params.STACK_PREFIX}-ACM`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

const infraStack = new WebsiteStack(app, "WebsiteStack", {
  domainName: params.DOMAIN_NAME,
  acmCertParameterName: params.ACM_CERT_SSM_PARAM,
  secretsManagerParams: params.SECRETS_MANAGER_PARAMS,

  stackName: `${params.STACK_PREFIX}-Website`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const codePipelineStack = new CodePipelineStack(app, "CodePipelineStack", {
  domainName: params.DOMAIN_NAME,
  gitHubParams: params.GITHUB_PARAMS,
  secretsManagerParams: params.SECRETS_MANAGER_PARAMS,
  cloudFrontDistributionID: infraStack.cloudFrontDistributionID,

  stackName: `${params.STACK_PREFIX}-CodePipeline`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

[routeStack, acmStack, infraStack, codePipelineStack].forEach((stack) => {
  Tags.of(stack).add("Project", "ResumeSite");
});
