FROM node:14

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1338

CMD ["node", "database.js"]
