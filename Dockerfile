# build environment
FROM node:12-alpine

EXPOSE 8080
WORKDIR /opt/app

COPY package*.json /opt/app
COPY . /opt/app/

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

CMD ["npm", "run", "start:prod"]