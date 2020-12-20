# build environment
FROM node:12-alpine

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN ["npm", "run", "build"]

CMD ["npm", "run", "start:prod"]