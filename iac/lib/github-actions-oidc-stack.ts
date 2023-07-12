import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_iam as iam } from "aws-cdk-lib";

export class GtihubActionsOidcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, "StaticCacheGHActionRole", {
      roleName: "StaticCacheGHActionRole",
      maxSessionDuration: Duration.hours(2),
      assumedBy: new iam.WebIdentityPrincipal("your iam arn", {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        },
        StringLike: {
          "token.actions.githubusercontent.com:sub":
            "repo:cm-nishida-masayuki/nextjs-static-cache:*",
        },
      }),
    });

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
  }
}
