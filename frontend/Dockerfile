FROM node:18-alpine

WORKDIR /app

ARG BACKEND
ENV VITE_BACKEND $BACKEND

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
