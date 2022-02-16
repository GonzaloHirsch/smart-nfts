# Front-End

## Configuration

A `.env` file is needed with the following:
```
VITE_API_URL=ULR_TO_THE_API
```

The following values work:
- https://api.smart-nfts.gonzalohirsch.com/ (using production API)
- http://localhost:8000/ (local development)

## Development

Installing dependencies and running:

```sh
npm i
npm run dev
```

## Build

```sh
npm i
npm run build
```

## Production

When a commit that affects the `/frontend` folder is made, an automatic deploy to S3 and caché invalidation are generated.

### Locally Deploying to Production

#### Configuration

The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is required to deploy to production.

A `.env.production_deploy` file is required to have the following environment variables:
```
AWS_ACCESS_KEY_ID=Access key ID for a user with frontend deployment permissions
AWS_SECRET_ACCESS_KEY=Secret access key for a user with frontend deployment permissions
S3_BUCKET=S3 Bucket name for the frontend
DISTRIBUTION_ID=Cloudfront Distribution ID for the frontend
```

A `.env.production` file is required to have the following environment variables:
```
VITE_API_URL=https://api.smart-nfts.gonzalohirsch.com/
VITE_RECAPTCHA_KEY=Public Recaptcha v3 key
```
This file has environment variables that will be used when deploying the site.

#### Deployment

To run a deploy, just run:
```
npm run deploy-local
```

#### What it does?

This will:
- Install dependencies
- Clean old artifacts
- Build the frontend
- Configure AWS credentials under the following named profile `frontendProdProfile`
- Upload all required files with cache control
- Upload all required files without cache control
- Invalidate Cloudfront distribuition cache