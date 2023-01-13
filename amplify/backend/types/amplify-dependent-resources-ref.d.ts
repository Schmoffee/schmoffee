export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "schmoffee": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "schmoffee": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "schmoffeeAuth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "CreatedSNSRole": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "schmoffeeAuthCreateAuthChallenge": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeAuthDefineAuthChallenge": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeAuthPreSignup": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeAuthVerifyAuthChallengeResponse": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeCancelPayment": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeGooglePayConfirmPayment": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeePayWithStripe": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    },
    "schmoffeeSendNotification": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "storage": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}