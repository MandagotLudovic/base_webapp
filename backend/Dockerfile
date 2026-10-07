FROM node:20-alpine

WORKDIR /app

# Copie des manifestes d'abord pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# Mode dev par défaut (nodemon) ; surchargé en production
CMD ["npm", "run", "dev"]