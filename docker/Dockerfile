ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY package.json .
RUN npm install --production=false

COPY . .

ARG API_URL
ARG BASE_URL

ENV API_URL=${API_URL}
ENV BASE_URL=${BASE_URL}

RUN npm run build
RUN npm prune

# Run
FROM base as production

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]