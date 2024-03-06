FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm update

RUN npm install -g nodemon

COPY . .

EXPOSE 6969

CMD nodemon server.js
