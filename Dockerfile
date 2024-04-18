FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN apk add --no-cache yarn

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 8080

CMD [ "yarn", "run", "preview" ]
