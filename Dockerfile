# Estágio de Build
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine AS production-stage

# 1. Removemos QUALQUER configuração padrão que possa conflitar
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copiamos a nossa configuração que aponta para /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Limpamos a pasta de destino e copiamos os arquivos da build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]