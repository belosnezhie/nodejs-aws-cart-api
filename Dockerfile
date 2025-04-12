FROM node:20.11.1-alpine3.19

COPY . /

RUN npm install

EXPOSE 4000

ENTRYPOINT ["npm start"]
