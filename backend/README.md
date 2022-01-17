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
```

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
