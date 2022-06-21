FROM node:14.16.1-alpine3.13 as build-stage
# make the 'app' folder the current working directory
WORKDIR /app
# copy 'package.json' to install dependencies
COPY package*.json ./
# install dependencies
RUN npm cache clean --force
RUN apk add --no-cache git
RUN npm install
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
#Evitar problemas de falta de memoria
ENV GENERATE_SOURCEMAP=false
RUN NODE_OPTIONS="--max-old-space-size=8192"
# build app for production with minification
RUN npm run build

FROM nginx:1.13.12-alpine as production-stage

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
