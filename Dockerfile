FROM node:20

WORKDIR /backend

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN mkdir -p src
RUN yarn install

COPY ./src/ ./src/

RUN yarn build

CMD ["yarn", "start:prod"]