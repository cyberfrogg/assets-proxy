FROM node:18.16.0-alpine

WORKDIR /usr/src/app
EXPOSE 3000

RUN apk add --no-cache git

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

CMD ["sh","-c", "npm run build && npm run start"]
