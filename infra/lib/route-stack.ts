import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as route53 from "aws-cdk-lib/aws-route53";

interface StackProps extends cdk.StackProps {
  domainName: string;
}

export class RouteStack extends cdk.Stack {
  public readonly hostedZone: route53.HostedZone;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, "InfraHostedZone", {
      zoneName: props.domainName,
      comment: `${props.domainName} public zone`,
    });

    this.hostedZone = hostedZone;
  }
}
