# Front-End

## Configuration

A `.env` file is needed with the following:
```
VITE_API_URL=https://api.smart-nfts.gonzalohirsch.com/ or http://localhost:8000/
```

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