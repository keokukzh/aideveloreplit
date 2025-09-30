FROM node:20-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client ./client
COPY server ./server
COPY shared ./shared
RUN corepack enable && pnpm i --frozen-lockfile
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./package.json
RUN corepack enable && pnpm i --prod --frozen-lockfile
EXPOSE 5000
CMD ["pnpm","start"]

