FROM node:19-alpine as builder

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install && yarn cache clean

COPY ./ ./
ENV VITE_APP_API_URL=https://api.ethoradev.com
ENV VITE_APP_DISABLE_STRICT=true
ENV VITE_APP_DOMAIN_NAME=domainxxx.com
RUN yarn build

FROM nginx:1.17-alpine

RUN apk add --no-cache curl

COPY ./default.conf /etc/nginx/conf.d

WORKDIR /app

COPY --from=builder /app/build ./public