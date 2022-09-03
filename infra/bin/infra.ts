#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";

import { AcmStack } from "../lib/acm-stack";
import { Route53Stack } from "../lib/route-stack";
import { WebsiteStack } from "../lib/website-stack";
import { CodePipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

const STACK_PREFIX = "Resume";
const DOMAIN_NAME = "dariusduta.dev";
const SECRET_HEADER_VALUE = "RD6o3aJ9tLsHxNHB";
const ACM_CERT_SSM_PARAM = `/${DOMAIN_NAME}/acm-cert-arn`;

const routeStack = new Route53Stack(app, "Route53Stack", {
  domainName: DOMAIN_NAME,
  terminationProtection: true,
  stackName: `${STACK_PREFIX}-Route53`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

const acmStack = new AcmStack(app, "AcmStack", {
  domainName: DOMAIN_NAME,
  hostedZone: routeStack.hostedZone,
  terminationProtection: true,
  stackName: `${STACK_PREFIX}-ACM`,
  acmCertParameterName: ACM_CERT_SSM_PARAM,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

const infraStack = new WebsiteStack(app, "WebsiteStack", {
  domainName: DOMAIN_NAME,
  secretHeaderValue: SECRET_HEADER_VALUE,
  acmCertParameterName: ACM_CERT_SSM_PARAM,
  stackName: `${STACK_PREFIX}-Website`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const codePipelineStack = new CodePipelineStack(app, "CodePipelineStack", {
  stackName: `${STACK_PREFIX}-CodePipeline`,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

[routeStack, acmStack, infraStack, codePipelineStack].forEach((stack) => {
  Tags.of(stack).add("Project", "ResumeSite");
});
