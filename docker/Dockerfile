ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as base

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY package.json ./
RUN npm install --production=false

COPY . .

ARG API_URL="http://13.53.38.215/**"

RUN npm run generate
RUN npm prune

# Run
FROM nginx:stable-alpine-slim as production

COPY --from=build /src/.output/public /usr/share/nginx/html
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

