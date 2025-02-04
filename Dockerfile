FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 9000
CMD ["npx", "pocketbase-uml@latest"]