import { Construct } from "constructs";
import {
  AwsSdkCall,
  AwsCustomResource,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import * as iam from "aws-cdk-lib/aws-iam";

interface SSMParameterReaderProps {
  parameterName: string;
  region: string;
}

export class SSMParameterReader extends AwsCustomResource {
  /**
   * original author: https://stackoverflow.com/a/63559786
   * docs: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.custom_resources-readme.html
   * #get-the-latest-version-of-a-secure-ssm-parameter
   */

  constructor(scope: Construct, name: string, props: SSMParameterReaderProps) {
    const { parameterName, region } = props;

    const ssmAwsSdkCall: AwsSdkCall = {
      service: "SSM",
      action: "getParameter",
      parameters: {
        Name: parameterName,
      },
      region,
      physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
    };

    super(scope, name, {
      onUpdate: ssmAwsSdkCall,
      policy: {
        statements: [
          new iam.PolicyStatement({
            resources: ["*"],
            actions: ["ssm:GetParameter"],
            effect: iam.Effect.ALLOW,
          }),
        ],
      },
    });
  }

  public getParameterValue(): string {
    return this.getResponseField("Parameter.Value").toString();
  }
}
