# ==============================================================================
# Dockerfile Multi-Stage para AWS App Runner / AWS Lightsail / AWS ECS
# Optimizado para tamaño mínimo y máximo rendimiento en Capa Gratuita
# ==============================================================================

# Etapa 1: Compilación de Frontend (Vite + React)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción Ligero
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

# Copiar artefactos compilados y servidor
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/server ./server
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "index.js"]
