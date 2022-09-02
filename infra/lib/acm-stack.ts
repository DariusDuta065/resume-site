import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as ssm from "aws-cdk-lib/aws-ssm";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as cert from "aws-cdk-lib/aws-certificatemanager";

interface StackProps extends cdk.StackProps {
  domainName: string;
  hostedZone: route53.HostedZone;
  acmCertParameterName: string;
}

export class AcmStack extends cdk.Stack {
  public readonly acmParam: ssm.StringParameter;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const acmCert = new cert.DnsValidatedCertificate(this, "InfraCertificate", {
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      region: "us-east-1",
    });

    this.acmParam = new ssm.StringParameter(this, "AcmCertificateParameter", {
      parameterName: props.acmCertParameterName,
      stringValue: `${acmCert.certificateArn}`,
    });
  }
}
