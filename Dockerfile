FROM zenika/alpine-chrome:with-puppeteer

USER root
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8080
CMD ["npm" , "start"]
