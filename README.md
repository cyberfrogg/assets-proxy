# Assets Proxy

A project to download some media from social platforms like TikTok, YouTube or other websites and save it as temporary raw .mp4 file to download it or watch it directly in VRChat or Resonite.

Join discord: [https://discord.gg/esHDJNZeDy](https://discord.gg/esHDJNZeDy)

Thanks for checking out this project!

## Stack
- Nest.JS for backend
- Nuxt3 for frontend
- S3 container for temporary storage
- PostgresDB with typeorm for database

## How to run

```
docker-compose up --force-recreate
```

! **--force-recreate is requited to run vue in docker container because of some broken sockets shinanigans with vite. [Issue here](https://github.com/nuxt/nuxt/issues/13587#issuecomment-1397307917).**

*This will up the containers with frontend, backend and database*

Credentials required to run:
- S3 container credentials
