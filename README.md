# Assets Proxy

A project to download some media from social platforms like TikTok, YouTube or other websites and save it as temporary raw .mp4 file to download it or watch it directly in VRChat or Resonite.

**DEMO:** [https://assetsproxy.cyberfrogg.com/](https://assetsproxy.cyberfrogg.com/)

Join discord: [https://discord.gg/esHDJNZeDy](https://discord.gg/esHDJNZeDy)

Thanks for checking out this project!

## Stack
- Nest.JS for backend
- Nuxt3 for frontend
- S3 container for temporary storage
- PostgresDB with typeorm for database

## How to run (PROD IMAGE)

1. Create docker-compose.yml (you can copy docker-compose.prod and fill up the 'xxx')
2. sudo docker-compose up --force-recreate


## How to run (DEV)

1. Make sure to edit docker-compose.dev first to insert necessary credentials that are marked as 'xxx'

2. Run compose (DEV)
```
sudo docker-compose -f ./docker-compose.dev up --force-recreate
```

> **--force-recreate is requited to run vue in docker container because of some broken sockets shinanigans with vite. [Issue here](https://github.com/nuxt/nuxt/issues/13587#issuecomment-1397307917).**

*This will up the containers with frontend, backend and database*

Credentials required to run:
- S3 container credentials
