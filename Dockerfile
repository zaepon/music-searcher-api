FROM mhart/alpine-node:11

WORKDIR /usr/src/app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

ENV NODE_ENV production

RUN yarn build

CMD ["node", "dist/index.js"]


