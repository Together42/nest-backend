FROM node:20

WORKDIR /backend

COPY package*.json .
COPY yarn.lock .
COPY tsconfig*.json .
COPY nest-cli.json .

RUN yarn install

COPY ./src ./src

RUN yarn build

CMD ["yarn", "start:prod"]