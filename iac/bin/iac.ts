#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebStack } from "../lib/web-stack";
import { GtihubActionsOidcStack } from "../lib/github-actions-oidc-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

new GtihubActionsOidcStack(app, "StaticCacheGHOidcStack", {
  env: {
    region: "ap-northeast-1",
  },
});

new ApiStack(app, "ApiStack", {
  env: {
    region: "ap-northeast-1",
  },
});

new WebStack(app, "WebStack", {
  env: {
    region: "ap-northeast-1",
  },
});
