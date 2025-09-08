# ---- Build Vite app ----
FROM node:22-alpine AS build
WORKDIR /fe
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# ---- Nginx runtime ----
FROM nginx:alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /fe/dist /usr/share/nginx/html
EXPOSE 80