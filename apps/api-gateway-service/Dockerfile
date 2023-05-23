FROM docker.io/node:lts-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

RUN npx nx build api-gateway-service ${BUILD_FLAG}

CMD [ "node", "dist" ]