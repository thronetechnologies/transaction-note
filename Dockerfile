FROM node:16-alpine3.16

RUN apk add --update python3 make gcc g++ && rm -rf /var/cache/apk/*

ENV PORT=$ARG_PORT

WORKDIR /app

RUN yarn global add node-gyp

COPY package.json /app 

RUN yarn install

COPY . .

RUN yarn add --force bcrypt