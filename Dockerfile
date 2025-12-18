# Estágio de Build
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção
FROM nginx:stable-alpine AS production-stage
# Remove a config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copia a sua config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos da build para o lugar correto
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]