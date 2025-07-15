
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .env

ENV PORT=8080
ENV HOSTNAME=0.0.0.0

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start"]
