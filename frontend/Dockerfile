FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["serve", "-s", "build", "-l", "3000"]
