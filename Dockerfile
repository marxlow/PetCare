FROM node:10.1.0

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
EXPOSE 3000
