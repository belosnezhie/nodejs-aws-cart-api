FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

FROM node:20.11.1-alpine3.19

COPY --from=builder /app .

EXPOSE 4000

ENV NODE_ENV=production

ENTRYPOINT ["node", "dist/src/main.js"]

# FROM traefik/whoami

# EXPOSE 80
