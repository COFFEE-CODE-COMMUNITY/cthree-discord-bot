FROM node:22-slim as builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM node:22-slim

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/app-config*.json ./

ENV NODE_ENV=development

CMD ["npm", "start"]
