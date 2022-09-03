import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";

interface StackProps extends cdk.StackProps {
  domainName: string;
  cloudFrontDistributionID: string;

  secretsManager: {
    secretName: string;
    githubSecretField: string;
  };

  gitHubParams: {
    branch: string;
    owner: string;
    repo: string;
  };
}

export class CodePipelineStack extends cdk.Stack {
  public readonly acmParam: ssm.StringParameter;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const codeBuildProject = new codebuild.PipelineProject(
      this,
      "CodeBuildProject",
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_6_0,
          computeType: codebuild.ComputeType.SMALL,
        },
        buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.yml"),
      }
    );

    const sourceOutput = new codepipeline.Artifact();
    const sourceOutput2 = new codepipeline.Artifact();

    const codePipelineProject = new codepipeline.Pipeline(
      this,
      "CodePipelineProject"
    );

    codePipelineProject.addStage({
      stageName: "Source",
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: "Source",
          output: sourceOutput,
          repo: props.gitHubParams.repo,
          owner: props.gitHubParams.owner,
          branch: props.gitHubParams.branch,
          oauthToken: cdk.SecretValue.secretsManager(
            props.secretsManager.secretName,
            {
              jsonField: props.secretsManager.githubSecretField,
            }
          ),
        }),
      ],
    });

    codePipelineProject.addStage({
      stageName: "Build",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "Build",
          input: sourceOutput,
          project: codeBuildProject,
          outputs: [sourceOutput2],
          runOrder: 1,
        }),
        new codepipeline_actions.S3DeployAction({
          actionName: "Upload",
          input: sourceOutput2,
          runOrder: 2,
          bucket: s3.Bucket.fromBucketName(
            this,
            "ResumeBucket",
            props.domainName
          ),
        }),
      ],
    });

    codePipelineProject.addStage({
      stageName: "Deploy",
      actions: [
        // TODO: automate InvalidateCloudFrontLambda creation via CDK
        new codepipeline_actions.LambdaInvokeAction({
          actionName: "InvalidateCloudFront",
          lambda: lambda.Function.fromFunctionName(
            this,
            "InvalidateCloudFrontLambda",
            "InvalidateCloudFront"
          ),
          userParameters: {
            distributionId: props.cloudFrontDistributionID,
            objectPaths: ["/*"],
          },
        }),
      ],
    });
  }
}
