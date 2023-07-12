import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfront_origins,
  aws_ssm as ssm,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webBucket = new s3.Bucket(this, "webBucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: `${this.account}-static-cache-web-app`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      websiteIndexDocument: "index.html",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    const apiUrl = ssm.StringParameter.fromStringParameterAttributes(
      this,
      "apiUrlSsm",
      {
        parameterName: "/staticweb/apiurl",
      }
    ).stringValue;

    const distribution = new cloudfront.Distribution(this, "webDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: new cloudfront_origins.HttpOrigin(
          webBucket.bucketWebsiteDomainName,
          {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }
        ),
      },
      additionalBehaviors: {
        "/api/*": {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new cloudfront_origins.HttpOrigin(apiUrl),
        },
      },
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, "webDeploy", {
      sources: [
        cdk.aws_s3_deployment.Source.asset("../web/out"),
        cdk.aws_s3_deployment.Source.data("/error.html", "<h1>Error</h1>"),
      ],
      destinationBucket: webBucket,
      distribution: distribution,
      distributionPaths: ["/*"],
    });
  }
}
