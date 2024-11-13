# Fetching the latest node image on alpine linux
FROM node:23-alpine AS development

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173

# Starting our application
CMD ["npm","run", "dev"]