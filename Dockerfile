# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS build

WORKDIR /app

# 1. Instalar pnpm globalmente en el contenedor
RUN npm install -g pnpm

# 2. Copiar los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# 3. Instalar dependencias con pnpm
RUN pnpm install --frozen-lockfile

# 4. Copiar el resto del código de la app
COPY . .

# 5. Construir la aplicación
RUN pnpm run build

# --- Etapa 2: Servidor Web (Nginx) ---
FROM nginx:alpine

# Copiar la build generada en la etapa anterior a la carpeta de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Opcional) Si tienes un nginx.conf personalizado, descomenta la siguiente línea:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]