FROM node:12-alpine AS build
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:12-alpine
WORKDIR /opt/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /opt/app/dist ./dist

USER node
CMD [ "npm", "run", "start:prod" ]
EXPOSE 8080