FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
RUN test -n "$VITE_API_BASE_URL" && npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S hospeda && adduser -S hospeda -G hospeda
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
COPY scripts/migrate.mjs ./scripts/migrate.mjs
COPY db/migrations ./db/migrations
RUN mkdir -p /mnt/hospeda-uploads && chown -R hospeda:hospeda /app /mnt/hospeda-uploads
USER hospeda
ENV STORAGE_DIR=/mnt/hospeda-uploads API_PORT=53128
EXPOSE 53128
CMD ["sh","-c","node scripts/migrate.mjs && exec node server/index.js"]
