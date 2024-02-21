FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm update

COPY . .

EXPOSE 6969

CMD node server.js
