#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AcmStack } from "../lib/acm-stack";

import { InfraStack } from "../lib/infra-stack";
import { RouteStack } from "../lib/route-stack";

const app = new cdk.App();

const DOMAIN_NAME = "dariusduta.dev";

const routeStack = new RouteStack(app, "RouteStack", {
  domainName: DOMAIN_NAME,
  terminationProtection: true,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

const acmStack = new AcmStack(app, "AcmStack", {
  domainName: DOMAIN_NAME,
  hostedZone: routeStack.hostedZone,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});

// const acmCertArn = `${acmStack.acmCert.certificateArn}`;
const acmCertArn = `arn:aws:acm:us-east-1:590624982938:certificate/aa6464c9-e009-4aef-be57-5eb813bb1670`;
const hostedZoneID = `Z0615999Z4AFNXXABFT0`;

new InfraStack(app, "InfraStack", {
  domainName: DOMAIN_NAME,
  acmCertArn: acmCertArn,
  hostedZoneID: hostedZoneID,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
