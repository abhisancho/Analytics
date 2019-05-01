FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
Run npm install
COPY . .
EXPOSE 3000
CMD ["node", "main.js"] 