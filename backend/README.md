# Backend

Serverless-based API using MongoDB as a database.

## Installing

### Dependencies

Just running the following installs all dependecies:
```bash
npm i
```

### Serverless

[Serverless](https://www.serverless.com/framework/docs/getting-started) is required to run this, so please verify it's installed first or install it.

To verify the installation:
```bash
serverless -v
```

The output should be similar to this:
```bash
Serverless: Running "serverless" installed locally (in service node_modules)
Framework Core: 2.72.0 (local)
Plugin: 5.5.3
SDK: 4.3.0
Components: 3.18.1
```

**NOTE:** Serverless v3.x was released during development, it introduces breaking changes, so the version we recommend is `2.72.0`, which can be installed like so:
```bash
npm i -g serverless@2.72.0
```

### AWS CLI

In order to configure credentials for deployment, the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is required. Please verify it's installed or install it.

To verify the installation:
```bash
aws --version
```

The output should be similar to this:
```bash
aws-cli/2.2.38 Python/3.8.8 Darwin/21.2.0 exe/x86_64 prompt/off
```

## Configuring

A `.env` with the following environment variables is required:
```
MONGO_CONNECTION_STRING=Connection string to the MongoDB database
INFURA_PROJECT_ID=Infura project ID
DEPLOYMENT_ADDRESS=Address of wallet used for deployments
DEPLOYMENT_PRIVATE_KEY=Private key for that address
ETHERSCAN_API_KEY=API Key for Etherscan
ETHERSCAN_API_URL=URL for the Etherscan API
PINATA_API_KEY=API Key ID for Pinata
PINATA_API_SECRET=API secret for Pinata
```

Also a `.env.development` file is required to have the following environment variables:
```
RECAPTCHA_SECRET_KEY=Private Recaptcha V3 key
```
This variable will only be used locally for development.

Configuring AWS IAM credentials is also required, with AWS CLI run the following and follow the instructions to configure it:
```bash
aws configure
```

## Development

For local development, `serverless-offline` provides a way to invoke the API locally, just run:
```bash
npm run dev
```

A local server on port `8000` will start working, `ctrl + c` to stop it.

## Deployment

In order to deploy it, just running the following will deploy the infrastructure:
```bash
npm run deploy
```

### Locally Deploying to Production

#### Configuration

A `.env.production_deploy` file is required to have the following environment variables:
```
AWS_ACCESS_KEY_ID=Access key ID for a user with backend deployment permissions
AWS_SECRET_ACCESS_KEY=Secret access key for a user with backend deployment permissions
```

A `.env.production` file is required to have the following environment variables:
```
RECAPTCHA_SECRET_KEY=Private Recaptcha V3 key
```
This file has environment variables that will be used when deploying the site.

#### Deployment

To run a deploy, just run:
```
npm run deploy-local
```

#### What it does?

This will set the appropriate environment variables and run the `serverless deploy` command.

## Ethereum Funds

In order to get test ethereum for Rinkeby, the following pages can be used:
- https://faucets.chain.link/rinkeby
- https://faucet.rinkeby.io/