
# building src
FROM node:18.14.2-alpine3.17 AS build

WORKDIR /tmp/build

ADD package*.json ./
ADD public ./public
ADD src ./src

RUN npm install ; npm run build


# building release img
FROM node:18.14.2-alpine3.17

WORKDIR /app

COPY LICENSE README.md package-lock.json package.json ./
COPY --from=build /tmp/build/build ./build

RUN npm install --global serve

ENTRYPOINT ["serve", "-s", "/app/build", "-p", "9000"]

