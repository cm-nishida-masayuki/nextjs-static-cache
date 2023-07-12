import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import * as path from "node:path";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageAssets = new cdk.aws_ecr_assets.DockerImageAsset(
      this,
      "ApiStack",
      {
        directory: path.join(__dirname, "../../web"),
        platform: cdk.aws_ecr_assets.Platform.LINUX_AMD64,
      }
    );

    const apiAppRunner = new apprunner.Service(this, "ApiService", {
      source: apprunner.Source.fromAsset({
        imageConfiguration: {
          port: 3000,
          environmentVariables: { HOSTNAME: "0.0.0.0" },
        },
        asset: imageAssets,
      }),
    });

    new cdk.aws_ssm.StringParameter(this, "/staticweb/apiurl", {
      parameterName: "/staticweb/apiurl",
      stringValue: apiAppRunner.serviceUrl,
    });
  }
}

/**
 * どうしても APP Runner が動かないので Fargate で一旦作ってみる
 * => なんとか動いた
 */

// VPC
// const vpc = new cdk.aws_ec2.Vpc(this, "VPC", {
//   subnetConfiguration: [
//     {
//       cidrMask: 24,
//       name: "public",
//       subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
//     },
//   ],
// });

// // SG
// const albSG = new cdk.aws_ec2.SecurityGroup(this, "albSG", {
//   vpc,
// });
// albSG.addIngressRule(
//   cdk.aws_ec2.Peer.ipv4("0.0.0.0/0"),
//   cdk.aws_ec2.Port.tcp(443)
// );

// // ALB
// const alb = new cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer(
//   this,
//   "alb",
//   {
//     vpc,
//     securityGroup: albSG,
//     internetFacing: true,
//   }
// );

// // ECS
// const taskDefinition = new cdk.aws_ecs.FargateTaskDefinition(
//   this,
//   "TaskDefinition",
//   {
//     memoryLimitMiB: 512,
//     cpu: 256,
//   }
// );

// const container = taskDefinition.addContainer("api", {
//   image: cdk.aws_ecs.ContainerImage.fromAsset("../web", {
//     platform: cdk.aws_ecr_assets.Platform.LINUX_AMD64,
//   }),
//   logging: cdk.aws_ecs.LogDriver.awsLogs({
//     streamPrefix: "static-cache-ecs",
//     logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
//   }),
// });

// container.addPortMappings({
//   containerPort: 3000,
//   hostPort: 3000,
// });

// const cluster = new cdk.aws_ecs.Cluster(this, "StaticCacheCluster", {
//   vpc,
// });

// const service = new cdk.aws_ecs.FargateService(this, "Service", {
//   cluster,
//   taskDefinition,
//   desiredCount: 1,
//   assignPublicIp: true,
// });

// const targetGroup =
//   new cdk.aws_elasticloadbalancingv2.ApplicationTargetGroup(
//     this,
//     "TargetGroup",
//     {
//       vpc,
//       port: 3000,
//       protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
//       targetType: cdk.aws_elasticloadbalancingv2.TargetType.IP,
//       healthCheck: {
//         path: "/",
//         healthyHttpCodes: "200",
//       },
//     }
//   );

// // Set up ECS and ALB
// service.attachToApplicationTargetGroup(targetGroup);
// const listener = alb.addListener("api", { port: 80 });
// listener.addTargetGroups("api", {
//   targetGroups: [targetGroup],
// });
