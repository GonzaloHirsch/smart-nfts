# Docs

## Configuration

No configuration is required for this module.

## Development

For development, the `smart-nfts-spec.json` contains the entire API spec, just edit that file.

A server is required to serve the files, one can be spawned like this:
```sh
npx browser-sync start --server
```

## Build

No building is required

## Production

When a commit that affects the `/docs/api-spec` folder is made, an automatic deploy to S3 and caché invalidation are generated.

### Locally Deploying to Production

#### Configuration

The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is required to deploy to production.

A `.env.production_deploy` file is required to have the following environment variables:
```
AWS_ACCESS_KEY_ID=Access key ID for a user with docs deployment permissions
AWS_SECRET_ACCESS_KEY=Secret access key for a user with docs deployment permissions
S3_BUCKET=S3 Bucket name for the docs
DISTRIBUTION_ID=Cloudfront Distribution ID for the docs
```

#### Deployment

To run a deploy, just run:
```
npm run deploy-local
```

#### What it does?

This will:
- Configure AWS credentials under the following named profile `docsProdProfile`
- Upload all required files with cache control
- Upload all required files without cache control
- Invalidate Cloudfront distribuition cache