FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN ls -l /app

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]