FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY vite.config.js .

EXPOSE 5173

CMD ["npx", "vite", "--host"]
