#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AcmStack } from "../lib/acm-stack";

import { InfraStack } from "../lib/infra-stack";
import { RouteStack } from "../lib/route-stack";

const app = new cdk.App();

const DOMAIN_NAME = "dariusduta.dev";
const SECRET_HEADER_VALUE = "RD6o3aJ9tLsHxNHB";
const ACM_CERT_SSM_PARAM = `/${DOMAIN_NAME}/acm-cert-arn`;

const routeStack = new RouteStack(app, "RouteStack", {
  domainName: DOMAIN_NAME,
  terminationProtection: true,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

new AcmStack(app, "AcmStack", {
  domainName: DOMAIN_NAME,
  hostedZone: routeStack.hostedZone,
  acmCertParameterName: ACM_CERT_SSM_PARAM,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

new InfraStack(app, "InfraStack", {
  domainName: DOMAIN_NAME,
  secretHeaderValue: SECRET_HEADER_VALUE,
  acmCertParameterName: ACM_CERT_SSM_PARAM,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
