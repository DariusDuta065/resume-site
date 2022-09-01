import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as route53 from "aws-cdk-lib/aws-route53";
import * as cert from "aws-cdk-lib/aws-certificatemanager";

interface StackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: route53.HostedZone;
}

export class AcmStack extends cdk.Stack {
  public readonly acmCert: cert.Certificate;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const acmCert = new cert.DnsValidatedCertificate(this, "InfraCertificate", {
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      region: "us-east-1",
    });
    this.acmCert = acmCert;
  }
}
