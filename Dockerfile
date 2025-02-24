# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Устанавливаем только production-зависимости
RUN npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Копируем весь код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies.
FROM base as final

# Используем production-окружение
ENV NODE_ENV production

# Запускаем сервер от пользователя node
USER node

# Копируем package.json для работы с package manager
COPY package.json ./

# Копируем production-зависимости и собранное приложение
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Открываем порт приложения
EXPOSE 4200

# Запускаем сервер
CMD npm start
