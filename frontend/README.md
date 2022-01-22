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