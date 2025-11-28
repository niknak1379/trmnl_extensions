FROM node:24

WORKDIR /app

RUN npm install --no-package-lock

COPY . .
EXPOSE 3000

CMD ["node", "index.js"]