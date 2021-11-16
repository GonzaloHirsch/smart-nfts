# Front-End

## Desarrollo

Instalar las dependencias y correr con `dev`:

```sh
npm i
npm run dev
```

## Build

```sh
npm i
npm run build
```

## Producción

Al hacer un commit que afecte a la carpeta `frontend`, automaticamente se hace un deploy a S3 e invalidación del CDN.
