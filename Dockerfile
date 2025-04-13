FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

# EXPOSE 4000

# ENTRYPOINT ["npm start"]

FROM node:20.11.1-alpine3.19

COPY --from=builder /app .

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
