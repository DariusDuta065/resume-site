import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
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
    const buildOutput = new codepipeline.Artifact();

    const codePipelineProject = new codepipeline.Pipeline(
      this,
      "CodePipelineProject",
      {
        pipelineName: "Resume-Site-Pipeline",
      }
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
          runOrder: 1,
          actionName: "Build",
          input: sourceOutput,
          project: codeBuildProject,
          outputs: [buildOutput],
        }),
        new codepipeline_actions.S3DeployAction({
          runOrder: 2,
          actionName: "Upload",
          input: buildOutput,
          bucket: s3.Bucket.fromBucketName(
            this,
            "ResumeBucket",
            props.domainName
          ),
        }),
      ],
    });

    const invalidateCacheLambda = new lambda.Function(
      this,
      "InvalidateCacheLambda",
      {
        code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/")),
        memorySize: 1024,
        timeout: cdk.Duration.minutes(10),
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: "invalidate-cloudfront.lambda_handler",
      }
    );
    invalidateCacheLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "codepipeline:PutJobFailureResult",
          "codepipeline:PutJobSuccessResult",
          "cloudfront:CreateInvalidation",
        ],
        resources: ["*"],
      })
    );

    codePipelineProject.addStage({
      stageName: "Deploy",
      actions: [
        new codepipeline_actions.LambdaInvokeAction({
          actionName: "InvalidateCloudFront",
          lambda: invalidateCacheLambda,
          userParameters: {
            distributionId: props.cloudFrontDistributionID,
            objectPaths: ["/*"],
          },
        }),
      ],
    });
  }
}
