export type AmplifyDependentResourcesAttributes = {
  api: {
    schmoffee: {
      GraphQLAPIKeyOutput: 'string';
      GraphQLAPIIdOutput: 'string';
      GraphQLAPIEndpointOutput: 'string';
    };
  };
  auth: {
    schmoffeeAuth: {
      IdentityPoolId: 'string';
      IdentityPoolName: 'string';
      UserPoolId: 'string';
      UserPoolArn: 'string';
      UserPoolName: 'string';
      AppClientIDWeb: 'string';
      AppClientID: 'string';
      CreatedSNSRole: 'string';
    };
  };
  analytics: {
    schmoffee: {
      Region: 'string';
      Id: 'string';
      appName: 'string';
    };
  };
  function: {
    schmoffeeAuthCreateAuthChallenge: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
    schmoffeeAuthDefineAuthChallenge: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
    schmoffeeAuthPreSignup: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
    schmoffeeAuthVerifyAuthChallengeResponse: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
  };
};
