# ---------- ETAPA 1: BUILD ----------
FROM node:22-alpine AS build

WORKDIR /app

# Copiar solo los manifests primero (cache de capa de dependencias)
COPY package*.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

# Copiar el resto del código fuente
COPY . .

# Construir la versión de producción
RUN npm run build

# ---------- ETAPA 2: SERVICIO (nginx) ----------
FROM nginx:alpine

# Copiar los archivos estáticos generados
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de nginx para SPA (fallback a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
