FROM node:18.16.0-alpine

WORKDIR /usr/src/app
EXPOSE 4000

RUN apk add --no-cache git

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD ["sh","-c", "npm run migrate:up && npm run start:prod"]
