FROM node:20

WORKDIR /backend

COPY ./package*.json ./package*.json
COPY ./yarn.lock ./yarn.lock
COPY ./tsconfig*.json ./tsconfig*.json
COPY ./nest-cli.json ./nest-cli.json

RUN yarn install

COPY ./src ./src

RUN yarn build

CMD ["yarn", "start:prod"]