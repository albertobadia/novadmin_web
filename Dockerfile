FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /var/www
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]